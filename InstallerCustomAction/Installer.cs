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
using Ionic.Zip;

namespace InstallerCustomAction
{
    [System.ComponentModel.RunInstaller(true)]
    public class Installer : System.Configuration.Install.Installer
    {
        // C:\ProgramData
        private static string ProgramDataPath
            = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);

        // C:\ProgramData\BrWebHost
        private static string InstallPath
            = Path.Combine(Installer.ProgramDataPath, "BrWebHost");

        // スタートメニューのプログラムフォルダ
        private static string StartMenuPath
            = Environment.GetFolderPath(Environment.SpecialFolder.CommonPrograms);

        // スタートメニュー上のショートカット保持フォルダ
        private static string ProgramMenuPath
            = Path.Combine(Installer.StartMenuPath, "BrWebHost");

        // デスクトップフォルダ
        private static string DesktopPath
            = Environment.GetFolderPath(Environment.SpecialFolder.CommonDesktopDirectory);

        private static string LinkBrWebHost = "Start BrWebHost.lnk";

        private static string LinkScriptAgent = "Start ScriptAgent.lnk";

        //// デスクトップ上のショートカット
        //private static string DesktopLinkPath
        //    = Path.Combine(Installer.DesktopPath, "BrWebHost.lnk");

        //// スタートメニュー上のショートカット
        //private static string ProramMenuLinkPath
        //    = Path.Combine(Installer.ProgramMenuPath, "BrWebHost.lnk");

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
                var message = $"Install Folder NOT Found: {targetdir}";
                this.ShowMessage(message);
                throw new InstallException(message);
            }

            // BrWebHostのzipファイルパスを取得
            var zipPath = Path.Combine(targetdir, "win-x64.zip");
            if (!File.Exists(zipPath))
            {
                var message = $"Zip NOT Found: {zipPath}";
                this.ShowMessage(message);
                throw new InstallException(message);
            }

            // BrWebHostの展開先フォルダを取得or生成
            if (!Directory.Exists(Installer.InstallPath))
            {
                Directory.CreateDirectory(Installer.InstallPath);

                if (!Directory.Exists(Installer.InstallPath))
                {
                    var message = $"Cannot Access Expansion Folder: {Installer.InstallPath}";
                    this.ShowMessage(message);
                    throw new InstallException(message);
                }

                // 展開先フォルダのアクセス権を、everyoneに与える。
                var allowEveryone = new FileSystemAccessRule(
                    new NTAccount("everyone"),
                    FileSystemRights.FullControl,
                    InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit,
                    PropagationFlags.None,
                    AccessControlType.Allow
                );
                var security = Directory.GetAccessControl(Installer.InstallPath);
                security.AddAccessRule(allowEveryone);
                Directory.SetAccessControl(Installer.InstallPath, security);
            }

            // BrWebHostショートカットフォルダを取得or生成
            if (!Directory.Exists(Installer.ProgramMenuPath))
            {
                Directory.CreateDirectory(Installer.ProgramMenuPath);

                if (!Directory.Exists(Installer.ProgramMenuPath))
                {
                    var message = $"Cannot Access Program-Menu Folder: {Installer.ProgramMenuPath}";
                    this.ShowMessage(message);
                    throw new InstallException(message);
                }
            }

            // インストール済みのファイルがあれば、全て削除。
            this.Cleanup(Installer.InstallPath, true)
                .GetAwaiter()
                .GetResult();

            // モニタプログラムを展開先フォルダにコピー
            var monitorPath = Path.Combine(targetdir, "Tools\\Monitor");
            var tree = Xb.File.FileTree.GetTreeRecursiveAsync(monitorPath)
                .GetAwaiter()
                .GetResult();

            foreach (var node in tree.RootNode.Children)
            {
                if (node.Type != Xb.File.Tree.NodeBase.NodeType.File)
                    continue;

                var copyPath = Path.Combine(Installer.InstallPath, node.Name);

                try
                {
                    if (!File.Exists(copyPath))
                        File.Copy(node.FullPath, copyPath);
                }
                catch (Exception)
                {
                    // Delete All
                    this.Cleanup(Installer.InstallPath, true)
                        .GetAwaiter()
                        .GetResult();

                    var message = $"Monitor Copy Failure: {copyPath}";
                    this.ShowMessage(message);
                    throw new InstallException(message);
                }
            }

            // BrWebHost本体を展開先フォルダにコピー
            try
            {
                using (ZipFile zip = ZipFile.Read(zipPath))
                {
                    zip.ExtractExistingFile = ExtractExistingFileAction.OverwriteSilently;
                    zip.ExtractAll(Installer.InstallPath);
                }
            }
            catch (Exception)
            {
                var message = $"FAIL to extract zip: {zipPath} to {Installer.InstallPath}";
                this.ShowMessage(message);
                throw new InstallException(message);
            }

            // ショートカットを作成
            try
            {
                // ショートカット作成の参考
                // https://dobon.net/vb/dotnet/file/createshortcut.html

                var brwExePath = Path.Combine(Installer.InstallPath, "BrWebHost.exe");
                var saExePath = Path.Combine(Installer.InstallPath, "ScriptAgent.exe");
                var desktopLinkPath = "";
                var programMenuLinkPath = "";
                if (File.Exists(brwExePath))
                {
                    desktopLinkPath
                        = Path.Combine(Installer.DesktopPath, Installer.LinkBrWebHost);
                    programMenuLinkPath
                        = Path.Combine(Installer.ProgramMenuPath, Installer.LinkBrWebHost);
                }
                else if (File.Exists(saExePath))
                {
                    desktopLinkPath
                        = Path.Combine(Installer.DesktopPath, Installer.LinkScriptAgent);
                    programMenuLinkPath
                        = Path.Combine(Installer.ProgramMenuPath, Installer.LinkScriptAgent);
                }
                else
                {
                    var message = $"Exec-File Not Found.";
                    this.ShowMessage(message);
                    throw new InstallException(message);
                }

                var monitorExePath = Path.Combine(Installer.InstallPath, "Monitor.exe");
                var monitorIconPath = Path.Combine(targetdir, "Tools\\Monitor\\normal.ico"); ;

                //WshShellを作成
                Type t = Type.GetTypeFromCLSID(new Guid("72C24DD5-D70A-438B-8A42-98424B88AFB8"));
                dynamic shell = Activator.CreateInstance(t);

                //WshShortcutを作成
                if (!File.Exists(desktopLinkPath))
                {
                    var desktopLink = shell.CreateShortcut(desktopLinkPath);
                    desktopLink.TargetPath = monitorExePath;
                    desktopLink.IconLocation = monitorIconPath;
                    desktopLink.WorkingDirectory = Installer.InstallPath;
                    desktopLink.Description = "Start BrWebHost";
                    desktopLink.Save();
                    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(desktopLink);
                }

                if (!File.Exists(programMenuLinkPath))
                {
                    var programMenuLink = shell.CreateShortcut(programMenuLinkPath);
                    programMenuLink.TargetPath = monitorExePath;
                    programMenuLink.IconLocation = monitorIconPath;
                    programMenuLink.WorkingDirectory = Installer.InstallPath;
                    programMenuLink.Description = "Start BrWebHost";
                    programMenuLink.Save();
                    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(programMenuLink);
                }

                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(shell);
            }
            catch (Exception)
            {
                var message = $"FAIL to create shortcut.";
                this.ShowMessage(message);
                throw new InstallException(message);
            }

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

            //this.ShowMessage("Uninstall");

            // ProgramFiles上のインストール先パスを取得
            var targetdir = this.Context.Parameters["targetdir"];

            if (string.IsNullOrEmpty(targetdir))
            {
                var message = $"Installed Folder NOT Found: {targetdir}";
                this.ShowMessage(message);
                throw new InstallException(message);
            }

            // BrWebHost展開先フォルダ上の全ファイル・フォルダを削除
            if (Directory.Exists(Installer.InstallPath))
            {
                this.Cleanup(Installer.InstallPath, true)
                    .GetAwaiter()
                    .GetResult();
            }

            // ショートカットを削除
            try
            {
                var path = Path.Combine(Installer.DesktopPath, Installer.LinkBrWebHost);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception)
            {
            }
            try
            {
                var path = Path.Combine(Installer.DesktopPath, Installer.LinkScriptAgent);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception)
            {
            }
            try
            {
                var path = Path.Combine(Installer.ProgramMenuPath, Installer.LinkBrWebHost);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception)
            {
            }
            try
            {
                var path = Path.Combine(Installer.ProgramMenuPath, Installer.LinkScriptAgent);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception)
            {
            }
        }

        private void ShowMessage(string message)
        {
            MessageBox.Show(
                message,
                "BrWebHost Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Exclamation,
                MessageBoxDefaultButton.Button1,
                MessageBoxOptions.DefaultDesktopOnly
            );
        }


        private static string[] Excluded = new string[] 
        {
            "Tools",
            "appIcon.jpg",
            "indicator.gif",
            "Monitor.exe",
            "Monitor.exe.config",
            "Monitor.pdb",
            "normal.ico",
            "ok.ico",
            "warn.ico",
            "Xb.App.Job.dll",
            "Xb.Core.dll",
            "win-x64.zip"
        };

        private async Task<bool> Cleanup(string targetDir, bool force = false)
        {
            var tree = await Xb.File.FileTree.GetTreeRecursiveAsync(targetDir);

            foreach (var node in tree.RootNode.Children)
            {
                if (
                    (force == true)
                    || (force == false && !Installer.Excluded.Contains(node.Name))
                )
                {
                    try
                    {
                        node.Delete();
                    }
                    catch (Exception)
                    {
                    }
                }
            }

            return true;
        }
    }
}
