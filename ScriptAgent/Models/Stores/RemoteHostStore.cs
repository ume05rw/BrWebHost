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

        private static Xb.Net.Udp _socket = null;
        private static List<byte[]> _localAddresses;

        // 一応、維持。
        private static Xb.App.Process Replyer = null;

        public static void SetReciever()
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

        public static void DisposeReciever()
        {
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
    }
}
