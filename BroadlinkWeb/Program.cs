using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ScriptAgent.Extensions;

namespace BroadlinkWeb
{
    public class Program
    {
        public static int Port = 5004;

        public static string _currentPath = "";
        public static string CurrentPath
        {
            get
            {
                return Program._currentPath;
            }
        }

        public static void Main(string[] args)
        {
            // サービスとして起動するかどうかのフラグ
            // デバッグ実行時にサービスとして実行しないようにする
            // 引数'--console'のときは「サービスでない」。
            // Linux実行時は '--console'を付与する。
            bool isService = !(Debugger.IsAttached || args.Contains("--console"));

            // VSから起動したとき、ポートを変更。
            if (Debugger.IsAttached)
                Program.Port = 5005;

            // 1.サービスとして起動する場合
            //   1) WebRoot = 実行ファイルパス
            //   2) DBパス  = 実行ファイルパス/scriptagent.db
            //   3) Replyer = 実行ファイルパス/lib/UdpReplyer/UdpReplyer.dll

            // 2.publishしたexeを起動する場合
            //   1) WebRoot = 実行ファイルパス
            //   2) DBパス  = 実行ファイルパス/scriptagent.db
            //   3) Replyer = 実行ファイルパス/lib/UdpReplyer/UdpReplyer.dll


            // 3.コマンドラインから、dotnetコマンドで起動する場合
            //   1) WebRoot = カレントパス/
            //   2) DBパス  = カレントパス/scriptagent.db
            //   3) Replyer = カレントパス/lib/UdpReplyer/UdpReplyer.dll

            // 4.Visual Studioで起動する場合
            //   1) WebRoot = カレントパス/
            //   2) DBパス  = カレントパス/scriptagent.db
            //   3) Replyer = カレントパス/lib/UdpReplyer/UdpReplyer.dll

            string pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            if (pathToExe.EndsWith("dotnet") || pathToExe.EndsWith("dotnet.exe"))
            {
                // dotnetコマンドから起動している。
                // VisualStudio、コマンドライン等から実行している。
                Program._currentPath = Directory.GetCurrentDirectory();
            }
            else
            {
                // dotnetコマンド以外から起動している。
                // 実行ファイルのパスを取得してルートとする。
                Program._currentPath = Path.GetDirectoryName(pathToExe);
            }

            // コマンドライン引数のパースでエラーになるので、引数を渡さず握りつぶす。
            // 1) .NetCoreコマンドライン引数は、常に キーと値のペアである必要がある。
            // 2) "dotnet run" で起動する場合と、実行ファイル型(exe)で起動する場合とで、
            //    コマンドライン引数の認識が変わってしまう。
            //    2-1) dotnet run ./XXX.dll --console true
            //         --> args = [ "./XXX.dll", "--console", "true" ]
            //    2-2) XXX.exe --console true
            //         --> args = [ "--console", "true" ]

            // サービスかどうかで起動方法を分ける
            if (isService)
            {
                Program.BuildWebHost(new string[] { }).RunAsCustomService();
            }
            else
            {
                Program.BuildWebHost(new string[] { }).Run();
            }
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseKestrel()
                .UseContentRoot(Program._currentPath)
                .UseStartup<Startup>()
                .UseUrls($"http://*:{Program.Port}")
                //.UseUrls("http://0.0.0.0:5004")
                //.UseUrls("http://localhost:5004") //<-ホスト名をlocalhostに限定するとき
                .Build();
    }
}
