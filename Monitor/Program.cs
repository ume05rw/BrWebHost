using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace Monitor
{
    static class Program
    {
        private static TaskTrayForm _form;

        /// <summary>
        /// アプリケーションのメイン エントリ ポイントです。
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            var target = TaskTrayForm.Target.BrWebHost;

            if (args.Contains("--main"))
                target = TaskTrayForm.Target.BrWebHost;
            else if (args.Contains("--agent"))
                target = TaskTrayForm.Target.ScriptAgent;
            else if (args.Contains("--test"))
                target = TaskTrayForm.Target.Test;
            else
            {
                // 引数が無い場合、実行ファイルパス上のexe有無で判定する。
                var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
                var dirPath = Path.GetDirectoryName(pathToExe);
                
                if (File.Exists(Path.Combine(dirPath, TaskTrayForm.FileNameMain)))
                    target = TaskTrayForm.Target.BrWebHost;
                else if (File.Exists(Path.Combine(dirPath, TaskTrayForm.FileNameAgent)))
                    target = TaskTrayForm.Target.ScriptAgent;
                else
                    target = TaskTrayForm.Target.Test;
            }

            Program._form = new TaskTrayForm(target);
            Application.Run();
        }
    }
}
