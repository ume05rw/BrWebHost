using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace InstallerCustomAction
{
    [System.ComponentModel.RunInstaller(true)]
    public class Installer : System.Configuration.Install.Installer
    {
        public override void Install(System.Collections.IDictionary stateSaver)
        {
            base.Install(stateSaver);

            string name = this.Context.Parameters["name"];
            string targetdir = this.Context.Parameters["dir"];

            MessageBox.Show($"On Install: name = {name}, targetDir = {targetdir}");
        }

        public override void Commit(System.Collections.IDictionary savedState)
        {
            base.Commit(savedState);

            string name = this.Context.Parameters["name"];
            string targetdir = this.Context.Parameters["dir"];

            MessageBox.Show($"On Commit: name = {name}, targetDir = {targetdir}");

            var zipPath = Path.Combine(targetdir, "win-x64.zip");
            if (!File.Exists(zipPath))
            {
                MessageBox.Show($"NOT found zip: {zipPath}");
            }

            try
            {
                ZipFile.ExtractToDirectory(zipPath, targetdir);
            }
            catch (Exception)
            {
                MessageBox.Show($"FAIL to extract zip: {zipPath}");
            }
            
        }

        public override void Rollback(System.Collections.IDictionary savedState)
        {
            base.Rollback(savedState);

            MessageBox.Show("Rollback");
        }

        public override void Uninstall(System.Collections.IDictionary savedState)
        {
            base.Uninstall(savedState);

            MessageBox.Show("Uninstall");
        }

    }
}
