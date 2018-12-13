using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink;
using SharpBroadlink.Devices;

namespace BroadlinkWeb.Models.Stores
{
    public class JobStore : IDisposable
    {
        public JobStore()
        {
            Xb.Util.Out("JobStore.Constructor");
        }

        public async Task<Job> CreateJob(string name, string json = null)
        {
            var result = new Job();
            result.Name = name;
            if (json != null)
                result.Json = json;

            // DBに保存する。
            await result.SetProgress(0);

            return result;
        }

        public async Task<Job> CreateJob(string name, object jsonValues)
        {
            var result = new Job();
            result.Name = name;
            if (jsonValues != null)
                result.SetJson(jsonValues);

            // DBに保存する。
            await result.SetProgress(0);

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
