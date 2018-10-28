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

namespace BroadlinkWeb.Models.Stores
{
    public class RemoteHostStore
    {
        private const int AckUdpPort = 52891;
        private const string CallString = "hello?";
        private const string ResponseString = "here!";

        private static IServiceProvider Provider = null;
        private static Xb.Net.Udp Socket = null;
        private static List<byte[]> LocalAddresses = null;
        private static Task LoopScan = null;

        public static void SetScannerAndReciever(IServiceProvider provider)
        {
            RemoteHostStore.Provider = provider;
            RemoteHostStore.SetReciever();
            RemoteHostStore.SetScanner();
        }

        private static void SetReciever()
        {
            try
            {
                RemoteHostStore.LocalAddresses = new List<byte[]>();
                var locals = Xb.Net.Util.GetLocalAddresses();
                foreach (var addr in locals)
                    RemoteHostStore.LocalAddresses.Add(addr.GetAddressBytes());

                var socket = new Xb.Net.Udp(RemoteHostStore.AckUdpPort);

                socket.OnRecieved += (object sender, Xb.Net.RemoteData rdata) =>
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
                    if (RemoteHostStore.LocalAddresses.Any(b => b.SequenceEqual(addr)))
                        return;

                    // 応答を返す。
                    var response = Encoding.UTF8.GetBytes(RemoteHostStore.ResponseString);
                    RemoteHostStore.Socket.SendTo(response, rdata.RemoteEndPoint);
                };

                RemoteHostStore.Socket = socket;
            }
            catch (Exception ex)
            {
                Xb.Util.Out(ex);
                Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                Xb.Util.Out("UDP Reciever FAIL!!!!!!!!!!!!");

                // 時間を置いて再起動。
                Task.Delay(5000).GetAwaiter().GetResult();
                RemoteHostStore.SetReciever();
            }
        }

        private static void SetScanner()
        {
            // なんか違和感がある実装。
            // 代替案はあるか？
            RemoteHostStore.LoopScan = Task.Run(async () =>
            {
                // 5分に1回、LAN上のBroadlinkデバイスをスキャンする。
                while (true)
                {
                    try
                    {
                        using (var serviceScope = RemoteHostStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        {
                            await Task.Delay(1000 * 15); // 60 * 5);

                            Xb.Util.Out("Regularly Remote Host Scan");
                            var store = serviceScope.ServiceProvider.GetService<RemoteHostStore>();

                            store.Refresh();
                        }
                    }
                    catch (Exception ex)
                    {
                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");
                        //throw;
                    }
                }
            });
        }


        private Dbc _dbc;

        public RemoteHostStore([FromServices] Dbc dbc)
        {
            Xb.Util.Out("RemoteHostStore.Constructor");
            this._dbc = dbc;
        }



        public async Task<IEnumerable<RemoteHost>> Refresh()
        {
            using (var cs = new Xb.Net.Udp())
            {
                var packet = Encoding.UTF8.GetBytes(RemoteHostStore.CallString);

                cs.OnRecieved += async (object sender, Xb.Net.RemoteData rdata) =>
                {
                    var response = Encoding.UTF8.GetString(rdata.Bytes);
                    if (response != RemoteHostStore.ResponseString)
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

                    var exists = await this._dbc.RemoteHosts
                        .FirstOrDefaultAsync(r => r.IpAddressString == ipStr);

                    // DB上に既に登録があるとき、何もしない。
                    if (exists != null)
                        return;

                    // DB上に無いとき、新規レコードを追加。
                    var entity = new RemoteHost()
                    {
                        Name = "Remote Broadlink-Web",
                        IpAddressString = ipStr
                    };

                    this._dbc.Add(entity);
                    await this._dbc.SaveChangesAsync();
                };

                await cs.SendToAsync(packet, IPAddress.Broadcast, RemoteHostStore.AckUdpPort);

                var startTime = DateTime.Now;
                var timeout = 3;
                await Task.Run(async () =>
                {
                    while (true)
                    {
                        if ((DateTime.Now - startTime).TotalSeconds > timeout)
                            break;

                        await Task.Delay(500).ConfigureAwait(false);
                    }
                }).ConfigureAwait(false);
            }

            return null;
        }
    }
}
