using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;

namespace Starter
{
    class Program
    {
        public static string _currentPath = "";
        public static string CurrntPath
        {
            get
            {
                return Program._currentPath;
            }
        }

        static void Main(string[] preArgs)
        {
            var args = new List<string>();
            foreach (var arg in preArgs)
            {
                if (arg.EndsWith("dotnet") || arg.EndsWith("dotnet.exe"))
                    continue;
                args.Add(arg);
            }

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

            var dllPath = System.IO.Path.Combine(Program.CurrntPath, "ScriptAgent.dll");

            Xb.App.Process.Create("dotnet", $"\"{dllPath}\" --console true", false, Program.CurrntPath);

            Console.WriteLine("Started!");
        }
    }
}
