using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BroadlinkWeb
{
    public class Program
    {
        public const int Port = 5004;

        public static void Main(string[] args)
        {
            Program.BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls($"http://*:{Program.Port}")
                //.UseUrls("http://0.0.0.0:5004")
                //.UseUrls("http://localhost:5004") //<-ホスト名をlocalhostに限定するとき
                .Build();
    }
}
