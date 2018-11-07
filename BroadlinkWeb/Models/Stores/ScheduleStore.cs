using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Stores
{
    public class ScheduleStore
    {
        private static IServiceProvider Provider = null;
        private static Task LoopRunner = null;
        private static Job _loopRunnerJob = null;

        public static void SetLoopRunner(IServiceProvider provider)
        {
            ScheduleStore.Provider = provider;

            using (var serviceScope = ScheduleStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                // ジョブを取得する。
                var jobStore = serviceScope.ServiceProvider.GetService<JobStore>();
                ScheduleStore._loopRunnerJob = jobStore.CreateJob("Schedule LoopScanner")
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();
            }

            // なんか違和感がある実装。
            // 代替案はあるか？
            ScheduleStore.LoopRunner = Task.Run(async () =>
            {
                var status = new LoopJobStatus();
                var hour = DateTime.Now.Hour;

                // 1分に1回、A1デバイスの値を取得して平均値を作る。
                while (true)
                {
                    try
                    {
                        try
                        {
                            if (ScheduleStore.Provider == null)
                                break;
                        }
                        catch (Exception)
                        {
                            break;
                        }

                        using (var serviceScope = ScheduleStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        {
                            Xb.Util.Out("Regularly Scehule Ticker");

                            var store = serviceScope.ServiceProvider.GetService<ScheduleStore>();
                            var schedules = await store.Tick();

                            // ジョブ状態を記録
                            status.Count++;
                            status.StatusMessage = $"Schedule Count: {schedules.Length}";
                            var json = JsonConvert.SerializeObject(status);
                            await ScheduleStore._loopRunnerJob.SetProgress((decimal)0.5, json);

                            // 10秒待機
                            await Task.Delay(1000 * 20);
                        }
                    }
                    catch (Exception ex)
                    {
                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");
                        //throw;

                        status.Count++;
                        status.ErrorCount++;
                        status.LatestError = string.Join(" ", Xb.Util.GetErrorString(ex));
                        var json = JsonConvert.SerializeObject(status);
                        await ScheduleStore._loopRunnerJob.SetProgress((decimal)0.5, json);
                    }
                }

                ScheduleStore.ReleaseServiceProvider();

                Xb.Util.Out("ScheduleStore.LoopScan Closed");
            });
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

                if (schedule.NextDateTime == null)
                {
                    await schedule.CurrentJob.SetProgress((decimal)0.5, "ScheduleStore.Tick: Enable but All-Weekday Disabled.");
                }
                else if (schedule.NextDateTime <= now)
                {
                    // 次回起動時間を過ぎたとき
                    try
                    {
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
                else if (now < schedule.NextDateTime)
                {
                    await schedule.CurrentJob.SetProgress((decimal)0.5, "ScheduleStore.Tick: Waiting...");
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
                    var sceneStore = serviceScope.ServiceProvider.GetService<SceneStore>();
                    await sceneStore.Exec(schedule.Scene);
                    return errors.ToArray();
                }
                else if (schedule.Control != null && schedule.ControlSet != null)
                {
                    var controlSetStore = serviceScope.ServiceProvider.GetService<ControlSetStore>();
                    return await controlSetStore.Exec(schedule.Control);
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
    }
}
