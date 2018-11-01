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

namespace BroadlinkWeb.Models.Stores
{
    public class RemoteHostStore
    {
        private const string CallString = "hello?";
        private const string ResponseString = "here!";

        // VS停止時に正常に破棄されないため、ローカルで保持しない。
        //private static Xb.Net.Udp Socket = null;
        private static Xb.App.Process Replyer = null;
        private static IServiceProvider Provider = null;
        private static Task LoopRunner = null;
        private static Job _loopRunnerJob = null;

        public static void SetLoopRunnerAndReciever(IServiceProvider provider)
        {
            RemoteHostStore.Provider = provider;
            RemoteHostStore.SetReciever();
            RemoteHostStore.SetLoopRunner();
        }

        private static void SetReciever()
        {
            try
            {
                // Asp.NetCore上でサービスを書くと、VSで停止したときに破棄されず、
                // socketが保持され続ける現象が発生する。
                // 対策として、UDP応答を返すプログラムを別途起動するようにした。
                // VS中断時などはプロセスが残るので、必要に応じてdotnetプロセスを殺す。
                var dir = System.IO.Path.Combine(Environment.CurrentDirectory, "lib/UdpReplyer");
                var arg = $"lib/UdpReplyer/UdpReplyer.dll";
                RemoteHostStore.Replyer
                    = Xb.App.Process.Create("dotnet", $"UdpReplyer.dll {Program.Port}", false, dir);
            }
            catch (Exception ex)
            {
                Xb.Util.Out("Process Failed.");
                Xb.Util.Out(ex);
            }
        }

        private static void SetLoopRunner()
        {
            using (var serviceScope = RemoteHostStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                // ジョブを取得する。
                var jobStore = serviceScope.ServiceProvider.GetService<JobStore>();
                RemoteHostStore._loopRunnerJob = jobStore.CreateJob("RemoteHost LoopScanner")
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();

                // 最初の一回目スキャンは同期的に行う。
                Xb.Util.Out("First Remote Host Scan");
                var rhStore = serviceScope.ServiceProvider.GetService<RemoteHostStore>();
                rhStore.Refresh();
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
                            var store = serviceScope.ServiceProvider.GetService<RemoteHostStore>();
                            store.Refresh();

                            status.Count++;
                            var json = JsonConvert.SerializeObject(status);
                            await RemoteHostStore._loopRunnerJob.SetProgress((decimal)0.5, json);
                        }
                    }
                    catch (Exception ex)
                    {
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

                RemoteHostStore.DisposeScannerAndReciever();

                Xb.Util.Out("RemoteHostStore.LoopScan Closed");
            });
        }

        public static void DisposeScannerAndReciever()
        {
            RemoteHostStore.Provider = null;
            if (RemoteHostStore.Replyer != null)
                RemoteHostStore.Replyer.Dispose();
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
            {
                var dbc = serviceScope.ServiceProvider.GetService<Dbc>();
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
                catch (Exception ex)
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
            catch (Exception ex)
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
    }
}
