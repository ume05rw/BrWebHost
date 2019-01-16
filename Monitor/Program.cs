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
            //Mutex名を決める（必ずアプリケーション固有の文字列に変更すること！）
            string mutexName = "MyApplicationName";
            //Mutexオブジェクトを作成する
            System.Threading.Mutex mutex = new System.Threading.Mutex(false, mutexName);

            bool hasHandle = false;
            try
            {
                try
                {
                    //ミューテックスの所有権を要求する
                    hasHandle = mutex.WaitOne(0, false);
                }
                //.NET Framework 2.0以降の場合
                catch (System.Threading.AbandonedMutexException)
                {
                    //別のアプリケーションがミューテックスを解放しないで終了した時
                    hasHandle = true;
                }
                //ミューテックスを得られたか調べる
                if (hasHandle == false)
                {
                    //得られなかった場合は、すでに起動していると判断して終了
                    MessageBox.Show("Already Running Br-Starter now.");
                    return;
                }

                //はじめからMainメソッドにあったコードを実行
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
            finally
            {
                if (hasHandle)
                {
                    //ミューテックスを解放する
                    mutex.ReleaseMutex();
                }
                mutex.Close();
            }
        }
    }
}
