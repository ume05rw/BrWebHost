using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BrWebHost.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;

namespace BrWebHost.Models.Stores
{
    public class RemoteScriptStore : IDisposable
    {
        private Dbc _dbc;

        public RemoteScriptStore(
            [FromServices] Dbc dbc
        )
        {
            Xb.Util.Out("RemoteScriptStore.Constructor");
            this._dbc = dbc;
        }

        public async Task<IEnumerable<RemoteScript>> Refresh()
        {
            Xb.Util.Out("RemoteScriptStore.Refresh");

            var localAddrs = new List<byte[]>();
            var locals = Xb.Net.Util.GetLocalAddresses();
            foreach (var addr in locals)
                localAddrs.Add(addr.GetAddressBytes());

            var remotes = this._dbc.RemoteHosts.ToArray();

            foreach (var remote in remotes)
            {
                // ローカルIPのとき、スキップ。
                var addrBytes = IPAddress.Parse(remote.IpAddressString).GetAddressBytes();
                if (localAddrs.Any(la => la.SequenceEqual(addrBytes)))
                    continue;

                // リモートにHttp-Getクエリする。
                var url = $"http://{remote.IpAddressString}:{BrWebHost.Program.Port}/api/Scripts/";
                var client = new HttpClient();
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json")
                );
                client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");
                // タイムアウトを3秒に。デフォルトは30秒くらい？待ってしまう。
                client.Timeout = TimeSpan.FromMilliseconds(3000);

                HttpResponseMessage resMsg;
                try
                {
                    resMsg = await client.GetAsync(url);
                }
                catch (Exception)
                {
                    // リモートから応答が無いとき、スキップする。
                    Xb.Util.Out($"Remote Host No-Response: {remote.Name} - {remote.IpAddressString}");
                    continue;
                }

                var json = await resMsg.Content.ReadAsStringAsync();
                var resResult = JsonConvert.DeserializeObject<XhrResult.Items>(json);

                if (!resResult.Succeeded)
                {
                    // 応答がエラーのとき、スキップする。
                    var errorMsg = string.Join(" ", resResult.Errors.Select(e => $"{e.Name}: {e.Message}").ToArray());
                    Xb.Util.Out($"Remote Host Response Failure: {remote.Name} - {remote.IpAddressString}, {errorMsg}");
                    continue;
                }

                // リモートからのScript応答を取得
                var hasDbChanged = false;
                var jarray = (JArray)resResult.Values;
                var scripts = jarray
                    .Select(o => new RemoteScript
                    {
                        ControlId = (int)o["ControlId"],
                        RemoteHostId = remote.Id,
                        Name = $"{remote.Name}[{remote.IpAddressString}] - {(string)o["Name"]}"
                    })
                    .ToArray();

                // 保存済みのリモートスクリプトを取得
                var entities = this._dbc.RemoteScripts
                    .Where(e => e.RemoteHostId == remote.Id)
                    .ToArray();

                // 応答に存在し、保存済みに無いもの = 新規
                var newScripts = scripts
                    .Where(s => entities.FirstOrDefault(e => e.RemoteHostId == s.RemoteHostId && e.ControlId == s.ControlId) == null)
                    .ToArray();

                // 新規があればEFに追加する。
                if (newScripts.Length > 0)
                {
                    this._dbc.AddRange(newScripts);
                    hasDbChanged = true;
                }

                // 保存済みに存在し、応答に無いもの = 削除された
                var removed = entities
                    .Where(e => scripts.FirstOrDefault(s => s.RemoteHostId == e.RemoteHostId && s.ControlId == e.ControlId) == null)
                    .ToArray();

                // 削除されたものがあれば、EFからも削除。
                if (removed.Length > 0)
                {
                    this._dbc.RemoteScripts.RemoveRange(removed);
                    hasDbChanged = true;
                }

                // DB変更があれば、適用する。
                if (hasDbChanged)
                    this._dbc.SaveChanges();
            }

            return this._dbc.RemoteScripts.ToArray();
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
