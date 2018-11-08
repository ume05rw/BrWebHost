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
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            Program._form = new TaskTrayForm();
            Application.Run();
        }
    }
}
