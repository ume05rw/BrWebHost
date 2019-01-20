using System;
using System.Collections.Generic;
using System.Configuration.Install;
using System.IO;
//using System.IO.Compression;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using InstallerCustomAction.Operations;
using Ionic.Zip;

namespace InstallerCustomAction
{
    [System.ComponentModel.RunInstaller(true)]
    public class Installer : System.Configuration.Install.Installer
    {
        /// <summary>
        /// インストール処理
        /// </summary>
        /// <param name="stateSaver"></param>
        public override void Install(System.Collections.IDictionary stateSaver)
        {
            base.Install(stateSaver);

            // ProgramFiles上のインストール先パスを取得
            var targetdir = this.Context.Parameters["targetdir"];

            if (string.IsNullOrEmpty(targetdir))
            {
                OperationBase.OperationFailure($"Install Folder NOT Found: {targetdir}");
                return;
            }

            var installer = new Install();
            installer.Exec(targetdir);
        }

        //public override void Commit(System.Collections.IDictionary savedState)
        //{
        //    //this.ShowMessage("Commit");

        //    base.Commit(savedState);
        //}

        //public override void Rollback(System.Collections.IDictionary savedState)
        //{
        //    base.Rollback(savedState);

        //    //this.ShowMessage("Rollback");
        //}


        /// <summary>
        /// アンインストール処理
        /// </summary>
        /// <param name="savedState"></param>
        public override void Uninstall(System.Collections.IDictionary savedState)
        {
            base.Uninstall(savedState);

            // ProgramFiles上のインストール先パスを取得
            var targetdir = this.Context.Parameters["targetdir"];

            if (string.IsNullOrEmpty(targetdir))
            {
                OperationBase.OperationFailure($"Install Folder NOT Found: {targetdir}");
                return;
            }

            var uninstaller = new UnInstall();
            uninstaller.Exec(targetdir);
        }
    }
}
