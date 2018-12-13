using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;

namespace BroadlinkWeb.Models.Stores
{
    public class RemoteHostStore : IDisposable
    {
        private const string CallString = "hello?";
        private const string ResponseString = "here!";

        private static Xb.Net.Udp _socket = null;
        private static List<byte[]> _localAddresses;

        // 一応、維持。
        private static Xb.App.Process Replyer = null;


        private static IServiceProvider Provider = null;
        private static ILogger Logger = null;
        private static Task LoopRunner = null;
        private static Job _loopRunnerJob = null;

        public static void SetLoopRunnerAndReciever(IServiceProvider provider)
        {
            RemoteHostStore.Provider = provider;
            RemoteHostStore.Logger = RemoteHostStore.Provider.GetService<ILogger<RemoteHostStore>>();

            RemoteHostStore.SetReciever();
            RemoteHostStore.SetLoopRunner();
        }

        private static void SetReciever()
        {
            try
            {
                //
                // 再度、Xb.Net.Udp実装。
                // ソケットが破棄されない現象が直っていた。
                // bidasknakayamaさまに大変感謝！！！！！
                //
                //// Asp.NetCore上でサービスを書くと、VSで停止したときに破棄されず、
                //// socketが保持され続ける現象が発生する。
                //// 対策として、UDP応答を返すプログラムを別途起動するようにした。
                //// VS中断時などはプロセスが残るので、必要に応じてdotnetプロセスを殺す。
                //var execPath = System.IO.Path.Combine(Program.CurrentPath, "lib/UdpReplyer");
                //var dllPath = System.IO.Path.Combine(Program.CurrentPath, "lib/UdpReplyer/UdpReplyer.dll");
                //RemoteHostStore.Replyer
                //    = Xb.App.Process.Create("dotnet", $"\"{dllPath}\" {Program.Port}", false, execPath);

                if (RemoteHostStore._socket != null)
                    RemoteHostStore._socket.Dispose();

                RemoteHostStore._localAddresses = new List<byte[]>();
                var locals = Xb.Net.Util.GetLocalAddresses();
                foreach (var addr in locals)
                    RemoteHostStore._localAddresses.Add(addr.GetAddressBytes());

                RemoteHostStore._socket = new Xb.Net.Udp(Program.Port);
                RemoteHostStore._socket.OnRecieved += RemoteHostStore.OnRecieverRecieved;
            }
            catch (Exception ex)
            {
                Xb.Util.Out("Process Failed.");
                Xb.Util.Out(ex);
            }
        }

        private static void OnRecieverRecieved(object sender, Xb.Net.RemoteData rdata)
        {
            try
            {
                // 受信文字列が仕様外のとき、なにもしない。
                var call = Encoding.UTF8.GetString(rdata.Bytes);
                if (call != RemoteHostStore.CallString)
                    return;

                var addr = rdata.RemoteEndPoint.Address.GetAddressBytes();

                // IPv4射影アドレスのとき、v4アドレスに変換。
                if (
                    // 長さが16バイト
                    addr.Length == 16
                    // 先頭10バイトが全て0
                    && addr.Take(10).All(b => b == 0)
                    // 11, 12バイトが FF
                    && addr.Skip(10).Take(2).All(b => b == 255)
                )
                {
                    addr = addr.Skip(12).Take(4).ToArray();
                }

                // ローカルアドレスからの呼びかけのとき、なにもしない。
                if (RemoteHostStore._localAddresses.Any(b => b.SequenceEqual(addr)))
                    return;

                // 応答を返す。
                var resStr = RemoteHostStore.ResponseString + System.Environment.MachineName;
                var response = Encoding.UTF8.GetBytes(resStr);
                //RemoteHostStore._socket.SendTo(response, rdata.RemoteEndPoint);
                Xb.Net.Udp.SendOnce(response, rdata.RemoteEndPoint);
            }
            catch (Exception ex)
            {
                RemoteHostStore.Logger.LogError(ex, "RemoteHostStore.OnRecieverRecieved Failure.");
            }
        }

        private static void SetLoopRunner()
        {
            using (var serviceScope = RemoteHostStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var jobStore = serviceScope.ServiceProvider.GetService<JobStore>())
            {
                // ジョブを取得する。
                RemoteHostStore._loopRunnerJob = jobStore.CreateJob("RemoteHost LoopScanner")
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();

                // 最初の一回目スキャンは同期的に行う。
                Xb.Util.Out("First Remote Host Scan");
                using (var hostStore = serviceScope.ServiceProvider.GetService<RemoteHostStore>())
                    hostStore.Refresh();

                using (var scriptStore = serviceScope.ServiceProvider.GetService<RemoteScriptStore>())
                {
                    scriptStore.Refresh()
                        .GetAwaiter()
                        .GetResult();
                }
            }

            // なんか違和感がある実装。
            // 代替案はあるか？
            RemoteHostStore.LoopRunner = Task.Run(async () =>
            {
                var status = new LoopJobStatus();

                // 5分に1回、LAN上のBroadlink-Webホストをスキャンする。
                while (true)
                {
                    try
                    {
                        try
                        {
                            if (RemoteHostStore.Provider == null)
                                break;
                        }
                        catch (Exception)
                        {
                            break;
                        }

                        using (var serviceScope = RemoteHostStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        {
                            await Task.Delay(1000 * 60 * 5);

                            Xb.Util.Out("Regularly Remote Host Scan");
                            using (var hostStore = serviceScope.ServiceProvider.GetService<RemoteHostStore>())
                            using (var scriptStore = serviceScope.ServiceProvider.GetService<RemoteScriptStore>())
                            {
                                var hosts = hostStore.Refresh();

                                var scripts = scriptStore.Refresh()
                                    .ConfigureAwait(false)
                                    .GetAwaiter()
                                    .GetResult();

                                status.Count++;
                                status.StatusMessage = $"Remote Hosts Count: {hosts.Count()}";
                                var json = JsonConvert.SerializeObject(status);
                                await RemoteHostStore._loopRunnerJob.SetProgress((decimal)0.5, json);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        RemoteHostStore.Logger.LogError(ex, "RemoteHostStore.LoopRunner Failure.");

                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");

                        status.Count++;
                        status.ErrorCount++;
                        status.LatestError = string.Join(" ", Xb.Util.GetErrorString(ex));
                        var json = JsonConvert.SerializeObject(status);
                        await RemoteHostStore._loopRunnerJob.SetProgress((decimal)0.5, json);
                    }
                }

                RemoteHostStore.ReleaseServiceProvider();

                Xb.Util.Out("RemoteHostStore.LoopScan Closed");
            });
        }

        public static void ReleaseServiceProvider()
        {
            RemoteHostStore.Provider = null;
            if (RemoteHostStore.Replyer != null)
                RemoteHostStore.Replyer.Dispose();

            if (RemoteHostStore._socket != null)
                RemoteHostStore._socket.Dispose();

            if (RemoteHostStore._localAddresses != null)
            {
                RemoteHostStore._localAddresses.Clear();
                RemoteHostStore._localAddresses = null;
            }
        }


        private Dbc _dbc;

        public RemoteHostStore([FromServices] Dbc dbc)
        {
            Xb.Util.Out("RemoteHostStore.Constructor");
            this._dbc = dbc;
        }

        public IEnumerable<RemoteHost> Refresh()
        {
            using (var cs = new Xb.Net.Udp())
            {
                var packet = Encoding.UTF8.GetBytes(RemoteHostStore.CallString);

                cs.OnRecieved += this.OnResponseRecieved;

                cs.SendTo(packet, IPAddress.Broadcast, Program.Port);

                var startTime = DateTime.Now;
                var timeout = 3;
                Task.Run(() =>
                {
                    while (true)
                    {
                        if ((DateTime.Now - startTime).TotalSeconds > timeout)
                            break;

                        Task.Delay(500)
                            .ConfigureAwait(false)
                            .GetAwaiter()
                            .GetResult();
                    }
                }).ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();

                cs.OnRecieved -= this.OnResponseRecieved;
            }

            return this._dbc.RemoteHosts.ToArray();
        }

        private void OnResponseRecieved(object sender, Xb.Net.RemoteData rdata)
        {
            if (rdata.Bytes.Length <= 5)
                return;

            var resHeader = Encoding.UTF8.GetString(rdata.Bytes.Take(5).ToArray());
            if (resHeader != RemoteHostStore.ResponseString)
                return;

            // 既存登録と合致照会、新規なら追加登録。
            var addrBytes = rdata.RemoteEndPoint.Address.GetAddressBytes();

            // IPv4射影アドレスのとき、v4アドレスに変換。
            if (
                // 長さが16バイト
                addrBytes.Length == 16
                // 先頭10バイトが全て0
                && addrBytes.Take(10).All(b => b == 0)
                // 11, 12バイトが FF
                && addrBytes.Skip(10).Take(2).All(b => b == 255)
            )
            {
                addrBytes = addrBytes.Skip(12).Take(4).ToArray();
            }
            var ipStr = (new IPAddress(addrBytes)).ToString();

            using (var serviceScope = RemoteHostStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            {
                var exists = dbc.RemoteHosts
                    .FirstOrDefault(r => r.IpAddressString == ipStr);

                // DB上に既に登録があるとき、何もしない。
                if (exists != null)
                    return;

                var hostName = "";
                try
                {
                    hostName = Encoding.UTF8.GetString(rdata.Bytes.Skip(5).Take(int.MaxValue).ToArray());
                }
                catch (Exception)
                {
                }
                if (string.IsNullOrEmpty(hostName))
                    hostName = "Remote Broadlink-Web";

                // DB上に無いとき、新規レコードを追加。
                var entity = new RemoteHost()
                {
                    Name = hostName,
                    IpAddressString = ipStr
                };

                dbc.Add(entity);
                dbc.SaveChanges();
            }
        }

        public async Task<(bool IsSucceeded, string Result)> Exec(Script script)
        {
            if (script == null)
                return (false, "Entity Not Found");
            else if (script.RemoteHostId == null)
                return (false, "Remote Host Not Specified");

            var remote = await this._dbc.RemoteHosts
                .SingleOrDefaultAsync(r => r.Id == (int)script.RemoteHostId);

            if (remote == null)
                return (false, "Remote Host Not Found");

            var url = $"http://{remote.IpAddressString}:{BroadlinkWeb.Program.Port}/api/Scripts/{script.ControlId}";
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json")
            );
            client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

            // POSTのとき
            var content = new StringContent("");
            HttpResponseMessage response;
            try
            {
                response = await client.PostAsync(url, content);
            }
            catch (Exception)
            {
                return (false, "Remote Host No-Response");
            }

            var json = await response.Content.ReadAsStringAsync();
            var remoteResult = JsonConvert.DeserializeObject<XhrResult.Items>(json);

            if (remoteResult.Succeeded)
                return (true, remoteResult.Values.ToString());
            else
                return (false, JsonConvert.SerializeObject(remoteResult.Errors));
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
