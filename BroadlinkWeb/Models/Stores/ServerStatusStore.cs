using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Stores
{
    public class ServerStatusStore : IDisposable
    {
        private static IServiceProvider Provider = null;
        private static ILogger Logger = null;
        private static Task LoopRunner = null;
        private static Job _loopRunnerJob = null;
        private static Process Process = null;

        public static void SetLoopRunner(IServiceProvider provider)
        {
            ServerStatusStore.Provider = provider;
            ServerStatusStore.Logger = ServerStatusStore.Provider.GetService<ILogger<ServerStatusStore>>();
            ServerStatusStore.Process = Process.GetCurrentProcess();

            using (var serviceScope = ServerStatusStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var jobStore = serviceScope.ServiceProvider.GetService<JobStore>())
            {
                // ジョブを取得する。
                ServerStatusStore._loopRunnerJob = jobStore.CreateJob("Server Status Recorder")
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();
            }

            // なんか違和感がある実装。
            // 代替案はあるか？
            ServerStatusStore.LoopRunner = Task.Run(async () =>
            {
                var jobStatus = new LoopJobStatus();
                var tenMinute = (int)(DateTime.Now.Minute / 10);
                var srvStatus = new ServerStatus();
                
                // 1分に1回、アプリケーション状態を取得して記録する。
                while (true)
                {
                    try
                    {
                        try
                        {
                            if (ServerStatusStore.Provider == null)
                                break;
                        }
                        catch (Exception)
                        {
                            break;
                        }

                        using (var serviceScope = ServerStatusStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
                        {
                            Xb.Util.Out("Regularly Server Status Record");

                            // 現在の値を取得する。
                            var proc = ServerStatusStore.Process;

                            srvStatus.WorkingSetSize = (int)(proc.WorkingSet64 / 1024 / 1024);
                            srvStatus.VirtualMemorySize = (int)(proc.VirtualMemorySize64 / 1024 / 1024);
                            srvStatus.PrivateMemorySize = (int)(proc.PrivateMemorySize64 / 1024 / 1024);
                            srvStatus.PagedMemorySize = (int)(proc.PagedMemorySize64 / 1024 / 1024);
                            srvStatus.NonpagedSystemMemorySize = (int)(proc.NonpagedSystemMemorySize64 / 1024 / 1024);
                            srvStatus.PagedSystemMemorySize = (int)(proc.PagedSystemMemorySize64 / 1024 / 1024);

                            var availableWTs = 0;
                            var availableCPTs = 0;
                            var maxWTs = 0;
                            var maxCPTs = 0;
                            ThreadPool.GetAvailableThreads(out availableWTs, out availableCPTs);
                            ThreadPool.GetMaxThreads(out maxWTs, out maxCPTs);

                            srvStatus.AvailableWTs = availableWTs;
                            srvStatus.AvailableCPTs = availableCPTs;
                            srvStatus.MaxWTs = maxWTs;
                            srvStatus.MaxCPTs = maxCPTs;
                            srvStatus.ActiveWTs = (maxWTs - availableWTs);
                            srvStatus.ActiveCPTs = (maxCPTs - availableCPTs);

                            srvStatus.Recorded = DateTime.Now;

                            ServerStatusStore.Logger.Log(
                                LogLevel.Debug,
                                "Server Status: " + JsonConvert.SerializeObject(srvStatus)
                            );

                            // 平均値をDBに記録する。
                            if (srvStatus.Id == default(int))
                                dbc.ServerStatuses.Add(srvStatus);
                            else
                                dbc.Entry(srvStatus).State = EntityState.Modified;

                            await dbc.SaveChangesAsync();


                            // 10分ごとにレコードを一つ作る。
                            var currentTm = (int)(DateTime.Now.Minute / 10);
                            if (tenMinute != currentTm)
                            {
                                tenMinute = currentTm;
                                srvStatus = new ServerStatus();

                                // 10分に一回、ガベコレ実行。
                                GC.Collect();
                            }

                            // ジョブ状態を記録
                            jobStatus.Count++;
                            var json = JsonConvert.SerializeObject(jobStatus);
                            await ServerStatusStore._loopRunnerJob.SetProgress((decimal)0.5, json);

                            // 1分待機
                            await Task.Delay(1000 * 60 * 1);
                        }
                    }
                    catch (Exception ex)
                    {
                        ServerStatusStore.Logger.LogError(ex, "ServerStatusStore.LoopRunner Failure.");

                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");
                        //throw;

                        srvStatus = new ServerStatus();

                        jobStatus.Count++;
                        jobStatus.ErrorCount++;
                        jobStatus.LatestError = string.Join(" ", Xb.Util.GetErrorString(ex));
                        var json = JsonConvert.SerializeObject(jobStatus);
                        await ServerStatusStore._loopRunnerJob.SetProgress((decimal)0.5, json);
                    }
                }

                ServerStatusStore.ReleaseServiceProvider();

                Xb.Util.Out("ServerStatusStore.LoopScan Closed");
            });
        }

        public static void ReleaseServiceProvider()
        {
            ServerStatusStore.Provider = null;
        }


        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!IsDisposed)
            {
                if (disposing)
                {
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
