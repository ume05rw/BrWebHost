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
    public class WolStore : IDisposable
    {
        public async Task<bool> Exec(string macString)
        {
            if (Program.IsDemoMode)
                return true;

            var mac = macString
                .Replace("\r\n", "\n")
                .Replace("\r", "\n")
                .Replace("::", "-")
                .Replace(":", "-")
                .Split('\n')[0].Trim();

            var bStrs = mac.Split("-");
            var macBytes = new List<byte>();
            try
            {
                foreach (var str in bStrs)
                    macBytes.Add(Convert.ToByte(str, 16));
            }
            catch (Exception)
            {
                throw new Exception("Invalid Hex String");
            }

            if (macBytes.Count != 6)
                throw new Exception("Invalid Mac-Address Format");

            var bytes = new List<byte>();

            // 先頭6バイトをFFに
            for (var i = 0; i < 6; i++)
                bytes.Add((byte)255);

            // 以降、MACアドレスを16回繰り返す。
            for (var i = 0; i < 16; i++)
            {
                foreach (var b in macBytes)
                    bytes.Add(b);
            }

            // UDP7番ポート
            await Xb.Net.Udp.SendOnceAsync(bytes.ToArray(), IPAddress.Broadcast, 7);

            // UDP9番ポート
            await Xb.Net.Udp.SendOnceAsync(bytes.ToArray(), IPAddress.Broadcast, 9);

            return true;
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
