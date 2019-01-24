using BrWebHost.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
namespace BrWebHost.Models.Stores
{
    public class ScriptStore : IDisposable
    {
        public async Task<(bool IsSucceeded, string Result)> Exec(string script)
        {
            // デモモードのときは実行せず正常終了する。
            if (Program.IsDemoMode)
                return (true, string.Empty);

            var rows = script
                .Replace("\r\n", "\n")
                .Replace("\r", "\n")
                .Split('\n');

            // タイムアウトを設定し、1秒以上は結果を待たないことにした。
            //// 一行ずつ実行、結果取得はしない。
            //// UI付きプログラムの場合、プログラム終了まで応答を返さないため。
            //foreach (var row in rows)
            //    Xb.App.Process.GetConsoleResultAsync(row)
            //        .ConfigureAwait(false);

            var results = new List<string>();
            var isSucceeded = true;

            foreach (var row in rows)
            {
                results.Add(row);
                var res = await Xb.App.Process.GetConsoleResultAsync(row, null, 1);
                results.Add(res.Message);

                if (!res.Succeeded && res.Message != "No Response")
                {
                    isSucceeded = false;
                    break;
                }
            }

            var result = string.Join("\n", results.ToArray());

            return (isSucceeded, result);
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
