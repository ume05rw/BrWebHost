using System;
using System.Collections.Generic;
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

            var target = TaskTrayForm.Target.BroadlinkWeb;

            if (args.Contains("--main"))
                target = TaskTrayForm.Target.BroadlinkWeb;
            else if (args.Contains("--agent"))
                target = TaskTrayForm.Target.ScriptAgent;
            else if (args.Contains("--test"))
                target = TaskTrayForm.Target.Test;

            Program._form = new TaskTrayForm(target);
            Application.Run();
        }
    }
}
