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
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Stores
{
    public class ServerStatusStore : IDisposable
    {
        private static Process Process = Process.GetCurrentProcess();


        private Dbc _dbc;

        public ServerStatusStore([FromServices] Dbc dbc)
        {
            this._dbc = dbc;
        }

        public void ExecTimerJob()
        {
            var srvStatus = new ServerStatus();

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

            srvStatus.OpenedFiledCount = -1;
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                var bash = new System.Diagnostics.Process();
                bash.StartInfo.FileName = "/bin/bash";
                bash.StartInfo.Arguments = $"-c \"ls /proc/{proc.Id}/fd/ | wc -l\"";
                bash.StartInfo.UseShellExecute = false;
                bash.StartInfo.RedirectStandardOutput = true;
                bash.StartInfo.RedirectStandardError = true;
                bash.StartInfo.CreateNoWindow = false;

                bash.Start();

                var output = bash.StandardOutput.ReadToEnd();
                var error = bash.StandardError.ReadToEnd();

                bash.WaitForExit();
                bash.Close();
                bash.Dispose();

                int cnt;
                if (!string.IsNullOrEmpty(output)
                    && int.TryParse(output, out cnt))
                {
                    srvStatus.OpenedFiledCount = cnt;
                }
            }

            srvStatus.Recorded = DateTime.Now;

            this._dbc.ServerStatuses.Add(srvStatus);
            this._dbc.SaveChanges();
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
