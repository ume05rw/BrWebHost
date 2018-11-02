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
    /// <summary>
    /// 起動プログラム
    /// </summary>
    /// <remarks>
    /// **publish(発行)時の注意**
    /// VSでは、一度発行操作を行うと、宣言重複エラーなどで以降のビルドが出来なくなる。
    /// bin, obj下のファイルを削除するとビルドが通るようになる。
    /// </remarks>
    public class Program
    {
        public const int Port = 5004;

        public static string _currentPath = "";
        public static string CurrentPath
        {
            get
            {
                return Program._currentPath;
            }
        }

        public static string _execPath = "";
        public static string ExecPath
        {
            get
            {
                return Program._execPath;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="args"></param>
        /// <remarks>
        /// Asp.NetCoreをWindowsサービスとして起動する。
        /// https://takachan.hatenablog.com/entry/2017/12/31/044400
        /// </remarks>
        public static void Main(string[] args)
        {
            // サービスとして起動するかどうかのフラグ
            // デバッグ実行時にサービスとして実行しないようにする
            bool isService = !(Debugger.IsAttached || args.Contains("--console"));

            foreach (var arg in args)
            {
                Console.WriteLine("Arg: " + arg);
            }

            // サービス実行時のルートディレクトリの指定
            Program._currentPath = Directory.GetCurrentDirectory();
            Program._execPath = Directory.GetCurrentDirectory();
            if (isService)
            {
                string pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                Program._execPath = Path.GetDirectoryName(pathToExe);
            }

            Console.WriteLine("Current Path : " + Program._currentPath);
            Console.WriteLine("Exec Path    : " + Program._execPath);

            // コマンドライン引数のパースでエラーになるので、引数を渡さず握りつぶす。
            // 1) .NetCoreコマンドライン引数は、常に キーと値のペアである必要がある。
            // 2) "dotnet run" で起動する場合と、実行ファイル型(exe)で起動する場合とで、
            //    コマンドライン引数の認識が変わってしまう。
            //    2-1) dotnet run ./XXX.dll --console true
            //         --> args = [ "./XXX.dll", "--console", "true" ]
            //    2-2) XXX.exe --console true
            //         --> args = [ "--console", "true" ]
            //IWebHost host = WebHost.CreateDefaultBuilder(args)
            IWebHost host = WebHost.CreateDefaultBuilder(new string[] { })
                .UseKestrel()
                .UseContentRoot(Program._execPath)
                .UseUrls($"http://*:{Program.Port}")
                //.UseUrls("http://0.0.0.0:5004")
                //.UseUrls("http://localhost:5004") //<-ホスト名をlocalhostに限定するとき
                .UseStartup<Startup>()
                .Build();

            // サービスかどうかで起動方法を分ける
            if (isService)
            {
                host.RunAsCustomService();
            }
            else
            {
                host.Run();
            }
        }
    }
}
