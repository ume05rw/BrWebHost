using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using BroadlinkWeb.Models.Entities;
using Newtonsoft.Json;

namespace BroadlinkWeb.Models.Stores
{
    public class Timer : IDisposable
    {
        private static Timer _instance = null;
        public static void CreateInstance(IServiceProvider provider)
        {
            if (Timer._instance == null)
                Timer._instance = new Timer(provider);

            // 初回実行が終了するまで待つ。
            while(true)
            {
                if (Timer._instance._firstRunCompleted)
                    break;

                Task.Delay(1000)
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();
            }
        }

        public static void DisposeInstance()
        {
            Timer._instance?.Dispose();
        }


        private class TimerJob
        {
            public string Name { get; private set; }
            public int IntervalSecond { get; private set; }
            public DateTime LastExecTime { get; private set; }

            private Action _action;

            public TimerJob(string name, Action action, int intervalSecond)
            {
                this.Name = name;
                this._action = action;
                this.IntervalSecond = intervalSecond;
                this.LastExecTime = DateTime.MinValue;
            }

            public void Tick()
            {
                var interval = (DateTime.Now - this.LastExecTime).TotalSeconds;
                if (interval > this.IntervalSecond)
                {
                    this._action?.Invoke();
                    this.LastExecTime = DateTime.Now;
                }
            }
        }

        private class Locker
        {
            public bool IsLocked { get; set; } = false;
        }


        private IServiceProvider _provider = null;
        private ILogger _logger = null;
        private Task _loopRunner = null;
        private CancellationTokenSource _canceller;
        private bool _cancelCompleted = false;
        private Job _loopJob = null;
        private LoopJobStatus _loopJobStatus;
        private List<TimerJob> _timerJobs = new List<TimerJob>();
        private Locker _locker = new Locker();
        private bool _firstRunCompleted = false;

        private Timer(IServiceProvider provider)
        {
            this._provider = provider;
            this._logger = this._provider.GetService<ILogger<Timer>>();

            using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var jobStore = serviceScope.ServiceProvider.GetService<JobStore>())
            {
                // ジョブを取得する。
                this._loopJob = jobStore.CreateJob("Timer Job Recorder")
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();
            }

            this._loopJobStatus = new LoopJobStatus();

            this.InitTimerJobs();

            this.InitLoopRunner();
        }

        private void InitLoopRunner()
        {
            this._canceller = new CancellationTokenSource();

            this._loopRunner = Task.Run(async () =>
            {
                while(true)
                {
                    // キャンセル要求検知時、ループから出る。
                    if (this._canceller.IsCancellationRequested)
                    {
                        this._logger.LogDebug("Timer._loopRunner Canceled(1)");
                        break;
                    }

                    try
                    {
                        lock(this._locker)
                        {
                            this._locker.IsLocked = true;

                            foreach (var timerJob in this._timerJobs)
                            {
                                try
                                {
                                    timerJob.Tick();
                                }
                                catch (Exception ex)
                                {
                                    this._logger.LogError(ex, $"Timer._loopRunner TimerJob[{timerJob.Name}] Exception");
                                }
                            }

                            this._locker.IsLocked = false;
                        }

                        this._firstRunCompleted = true;

                        if (this._loopJobStatus.Count >= long.MaxValue)
                        {
                            this._logger.LogDebug("Timer._loopRunner Count Reset.");
                            this._loopJobStatus.Count = 0;
                        }                            

                        this._loopJobStatus.Count++;
                        var json = JsonConvert.SerializeObject(this._loopJobStatus);
                        await this._loopJob.SetProgress((decimal)0.5, json);

                        await Task.Delay(1000);
                    }
                    catch (OperationCanceledException)
                    {
                        this._logger.LogDebug("Timer._loopRunner Canceled(2)");
                        break;
                    }
                    catch (Exception ex)
                    {
                        this._logger.LogError(ex, "Timer._loopRunner Unexcepted Exception");

                        // 1秒待機。DBアクセスを連続させない。
                        await Task.Delay(1000);
                    }
                }

                this._cancelCompleted = true;
                this._logger.LogDebug("Timer._loopRunner Cancel Completed.");

            }, this._canceller.Token);
        }

        private void Add(TimerJob timerJob)
        {
            lock (this._locker)
            {
                this._locker.IsLocked = true;

                this._timerJobs.Add(timerJob);

                this._locker.IsLocked = false;
            }
        }

        private void InitTimerJobs()
        {
            // 10分に1回: ガベコレ実行。
            this.Add(new TimerJob("GcCollect", new Action(() =>
            {
                GC.Collect();
            }), 60 * 10));

            // 10分に1回: サーバのメモリ使用量／スレッド消費量を記録する。
            this.Add(new TimerJob("ServerStatusRecorder", new Action(() =>
            {
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<ServerStatusStore>())
                {
                    store.ExecTimerJob();
                }
            }), 60 * 10));

            // 5分に1回: LAN上のBroadlinkデバイスをスキャンする。
            this.Add(new TimerJob("BroadlinkDeviceScanner", new Action(() =>
            { 
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<BrDeviceStore>())
                {
                    store.Refresh();
                }
            }), 60 * 5));


            // 5分に1回: LAN上のBroadlinkデバイスに対応するControlSetを整合する。
            this.Add(new TimerJob("ControlSetEnsurerer", new Action(() =>
            {
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<ControlSetStore>())
                using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
                {
                    var entities = dbc.BrDevices.ToList();
                    store.EnsureBrControlSets(entities)
                        .ConfigureAwait(false)
                        .GetAwaiter()
                        .GetResult();
                }
            }), 60 * 5));

            // 5分に1回: LAN上のリモートホストをスキャンする。
            this.Add(new TimerJob("RemoteHostScanner", new Action(() =>
            {
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<RemoteHostStore>())
                {
                    store.Refresh();
                }
            }), 60 * 5));

            // 5分に1回: LAN上のリモートホスト上のスクリプトを取得する。
            this.Add(new TimerJob("RemoteScriptScanner", new Action(() =>
            {
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<RemoteScriptStore>())
                {
                    store.Refresh()
                        .ConfigureAwait(false)
                        .GetAwaiter()
                        .GetResult();
                }
            }), 60 * 5));

            // 60分に1回: A1センサーの値を記録する。
            this.Add(new TimerJob("A1SensorRecorder", new Action(() =>
            {
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<A1Store>())
                {
                    store.ExecTimerJob()
                        .ConfigureAwait(false)
                        .GetAwaiter()
                        .GetResult();
                }
            }), 60 * 60));

            // 20秒に1回: スケジュールの検証、予定時間が来たら実行する。
            this.Add(new TimerJob("ScheduleExecuter", new Action(() =>
            {
                using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var store = serviceScope.ServiceProvider.GetService<ScheduleStore>())
                {
                    store.Tick()
                        .ConfigureAwait(false)
                        .GetAwaiter()
                        .GetResult();
                }
            }), 20));
        }


        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!IsDisposed)
            {
                if (disposing)
                {
                    this._canceller.Cancel();

                    Task.Run(async () =>
                    {
                        while(true)
                        {
                            await Task.Delay(1000);

                            if (this._cancelCompleted)
                            {
                                this._logger.LogDebug("Timer.Dispose Cancel Completion Detected.");
                                break;
                            }
                            else
                            {
                                this._logger.LogDebug("Timer.Dispose Waiting Cancel Completion.");
                            }
                        }
                    }).ConfigureAwait(false)
                        .GetAwaiter()
                        .GetResult();

                    this._loopRunner.Dispose();
                    this._loopRunner = null;

                    this._timerJobs.Clear();
                    this._timerJobs = null;

                    this._provider = null;

                    this._logger = null;
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
