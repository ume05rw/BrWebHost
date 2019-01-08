using BrWebHost.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BrWebHost.Models.Stores
{
    public class ScheduleStore : IDisposable
    {
        private static IServiceProvider Provider = null;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            ScheduleStore.Provider = provider;
        }

        public static void ReleaseServiceProvider()
        {
            ScheduleStore.Provider = null;
        }


        private Dbc _dbc;

        public ScheduleStore(
            [FromServices] Dbc dbc
        )
        {
            this._dbc = dbc;
        }

        public async Task<Schedule[]> Tick()
        {
            var schedules = this._dbc.Schedules
                .Include(e => e.CurrentJob)
                .Include(e => e.Scene)
                    .ThenInclude(e2 => e2.Details)
                        .ThenInclude(detail => detail.ControlSet)
                .Include(e => e.Scene)
                    .ThenInclude(e2 => e2.Details)
                        .ThenInclude(detail => detail.Control)
                .Include(e => e.ControlSet)
                .Include(e => e.Control)
                .Where(e => e.Enabled)
                .ToArray();

            var now = DateTime.Now;

            foreach (var schedule in schedules)
            {
                // カレントジョブEnsure
                if (schedule.CurrentJob == null)
                {
                    var newJob1 = await this.GetNewJob(schedule);
                    schedule.CurrentJobId = newJob1.Id;

                    this._dbc.Entry(schedule).State = EntityState.Modified;
                    await this._dbc.SaveChangesAsync();

                    schedule.CurrentJob = newJob1;
                }

                if (schedule.Enabled && schedule.NextDateTime == null)
                {
                    schedule.NextDateTime = this.GetNextDateTime(schedule, true);
                    this._dbc.Entry(schedule).State = EntityState.Modified;
                    await this._dbc.SaveChangesAsync();
                }

                if (!schedule.Enabled)
                {
                    // スケジュールが無効のとき
                    await schedule.CurrentJob.SetProgress((decimal)0.5, "ScheduleStore.Tick: Disabled.");
                }
                else if (schedule.NextDateTime == null)
                {
                    // スケジュールが有効だが、起動時刻が未セットのとき
                    await schedule.CurrentJob.SetProgress((decimal)0.5, "ScheduleStore.Tick: Enabled, but All-Weekday Disabled.");
                }
                else if (now < schedule.NextDateTime)
                {
                    // スケジュールが有効で、起動時刻に到達していないとき
                    await schedule.CurrentJob.SetProgress((decimal)0.5, "ScheduleStore.Tick: Waiting...");
                }
                else if (schedule.NextDateTime <= now)
                {
                    // スケジュールが有効で、起動時間を過ぎたとき
                    try
                    {
                        var elapsed = now - schedule.NextDateTime;
                        if (elapsed < (new TimeSpan(0, 1, 30)))
                        {
                            // 指定時間超過が1分半以下のとき
                            // 通常実行
                            // 1.実行する。
                            var errors = await this.ExecSchedule(schedule);

                            // 2.カレントジョブに結果を記録する。
                            var job = schedule.CurrentJob;
                            if (errors.Length > 0)
                            {
                                // エラー終了時
                                await job.SetFinish(true, errors, "ScheduleStore.Tick Error");
                            }
                            else
                            {
                                // 正常終了時
                                await job.SetFinish(false, null);
                            }
                        }
                        else
                        {
                            // 指定時間を1分半以上過ぎたとき
                            var job = schedule.CurrentJob;
                            await job.SetFinish(true, null, "ScheduleStore.Tick Timeout");
                        }

                        // 3.カレントジョブを新規取得する。
                        var newJob2 = await this.GetNewJob(schedule);
                        schedule.CurrentJobId = newJob2.Id;
                        schedule.CurrentJob = newJob2;

                        // 4.次回起動時間をセットする。
                        schedule.NextDateTime = this.GetNextDateTime(schedule);

                        // 保存前に参照Entityを削除しておく。
                        // 差し替えたJobエンティティをInsertしようとしてしまう。
                        // scheduleから見て新規Entityに見える、ということか？
                        // DB上の参照制約はCascade(参照先更新)でなくRestrict(参照先存在確認)なので、問題は無い。
                        schedule.CurrentJob = null;
                        this._dbc.Entry(schedule).State = EntityState.Modified;
                        await this._dbc.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        if (schedule.CurrentJob != null)
                            await schedule.CurrentJob.SetProgress(0.5, $"ScheduleStore.Tick: Unexpected Exception: {ex.Message} / {ex.StackTrace}");
                    }
                }
                else
                {
                    await schedule.CurrentJob.SetProgress((decimal)0.5, "ScheduleStore.Tick: Unexpected Faiure.");
                }
            }

            return schedules;
        }

        private async Task<Error[]> ExecSchedule(Schedule schedule)
        {
            var errors = new List<Error>();

            using (var serviceScope = ScheduleStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                if (schedule.Scene != null)
                {
                    using (var sceneStore = serviceScope.ServiceProvider.GetService<SceneStore>())
                    {
                        await sceneStore.Exec(schedule.Scene);
                        return errors.ToArray();
                    }
                }
                else if (schedule.Control != null && schedule.ControlSet != null)
                {
                    using (var controlSetStore = serviceScope.ServiceProvider.GetService<ControlSetStore>())
                    {
                        return await controlSetStore.Exec(schedule.Control);
                    }
                }
                else
                {
                    // ここには来ないはず。
                    throw new Exception("なんでやー");
                }
            }
        }

        private async Task<Job> GetNewJob(Schedule schedule)
        {
            using (var serviceScope = ScheduleStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var jobStore = serviceScope.ServiceProvider.GetService<JobStore>();
                var newJob = await jobStore.CreateJob("Schedule Job: " + schedule.Name);
                return newJob;
            }
        }

        private DateTime? GetNextDateTime(Schedule schedule, bool includesToday = false)
        {
            var day = DateTime.Now;
            DateTime? result = null;
            var startIndex = (includesToday)
                ? 0
                : 1;

            for (var i = startIndex; i <= 7; i++)
            {
                if (i != 0)
                    day = day.AddDays(1);

                if (schedule.GetWeekdayFlag(day.DayOfWeek))
                {
                    var next = new DateTime(
                        day.Year,
                        day.Month,
                        day.Day,
                        schedule.StartTime.Hour,
                        schedule.StartTime.Minute,
                        schedule.StartTime.Second
                    );
                    if (DateTime.Now < next)
                    {
                        result = next;
                        break;
                    }
                }
            }

            return result;
        }


        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!IsDisposed)
            {
                if (disposing)
                {
                    this._dbc.Dispose();
                    this._dbc = null;
                }

                // TODO: アンマネージド リソース (アンマネージド オブジェクト) を解放し、下のファイナライザーをオーバーライドします。
                // TODO: 大きなフィールドを null に設定します。

                IsDisposed = true;
            }
        }

        // このコードは、破棄可能なパターンを正しく実装できるように追加されました。
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
