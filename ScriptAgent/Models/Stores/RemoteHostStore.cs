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

        public static void SetReciever()
        {
            try
            {
                // Asp.NetCore上でサービスを書くと、VSで停止したときに破棄されず、
                // socketが保持され続ける現象が発生する。
                // 対策として、UDP応答を返すプログラムを別途起動するようにした。
                // VS中断時などはプロセスが残るので、必要に応じてdotnetプロセスを殺す。
                var execPath = System.IO.Path.Combine(Program.CurrentPath, "lib/UdpReplyer");
                var dllPath = System.IO.Path.Combine(Program.CurrentPath, "lib/UdpReplyer/UdpReplyer.dll");
                RemoteHostStore.Replyer
                    = Xb.App.Process.Create("dotnet", $"\"{dllPath}\" {Program.Port}", false, execPath);
            }
            catch (Exception ex)
            {
                Xb.Util.Out("Process Failed.");
                Xb.Util.Out(ex);
            }
        }
    }
}
