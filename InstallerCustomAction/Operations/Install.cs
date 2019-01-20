using Ionic.Zip;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace InstallerCustomAction.Operations
{
    public class Install : OperationBase
    {
        private string _zipPath = "";
        private string _monitorInstalledPath = "";

        /// <summary>
        /// インストールを実行する。
        /// </summary>
        /// <param name="programFilesPath"></param>
        public override void Exec(string programFilesPath)
        {
            this.SetProgramFilesPath(programFilesPath);

            // フォルダ／ファイル類のパスを取得・検証する。
            this.EnsurePaths();

            // 展開先フォルダの既存ファイルを削除する。
            this.DeleteExists();

            // モニタプログラムを展開先フォルダにコピーする。
            this.InstallMonitor();

            // 実行ファイル本体を展開先フォルダにコピーする。
            this.InstallExecFiles();

            // ショートカットを作成する。
            this.CreateShortcuts();
        }

        /// <summary>
        /// フォルダ／ファイル類のパスを取得・検証する。
        /// </summary>
        private void EnsurePaths()
        {
            // BrWebHost/ScriptAgentのzipファイルパスを取得
            // ※どちらも同じファイル名
            this._zipPath = Path.Combine(this.ProgramFilesPath, "win-x64.zip");
            if (!File.Exists(this._zipPath))
            {
                this.Fail($"Zip NOT Found: {this._zipPath}");
                return;
            }

            // モニタプログラムのインストール先パスを取得
            this._monitorInstalledPath = Path.Combine(this.ProgramFilesPath, "Tools\\Monitor");
            if (!Directory.Exists(this._monitorInstalledPath))
            {
                this.Fail($"Monitor NOT Found: {this._monitorInstalledPath}");
                return;
            }

            // 実行ファイル展開先フォルダを取得or生成
            if (!Directory.Exists(OperationBase.InstallPath))
            {
                Directory.CreateDirectory(OperationBase.InstallPath);

                if (!Directory.Exists(OperationBase.InstallPath))
                {
                    this.Fail($"Cannot Access Expansion Folder: {OperationBase.InstallPath}");
                    return;
                }
            }

            // 実行ファイル展開先フォルダのアクセス権を修正
            try
            {
                // 展開先フォルダのアクセス権を、everyoneに与える。
                var allowEveryone = new FileSystemAccessRule(
                    new NTAccount("everyone"),
                    FileSystemRights.FullControl,
                    InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit,
                    PropagationFlags.None,
                    AccessControlType.Allow
                );
                var security = Directory.GetAccessControl(OperationBase.InstallPath);
                security.AddAccessRule(allowEveryone);
                Directory.SetAccessControl(OperationBase.InstallPath, security);
            }
            catch (Exception)
            {
                this.Fail($"Cannot Set Access-Rights to Expansion Folder: {OperationBase.ProgramMenuPath}");
                return;
            }

            // ショートカットフォルダを取得or生成
            if (!Directory.Exists(OperationBase.ProgramMenuPath))
            {
                Directory.CreateDirectory(OperationBase.ProgramMenuPath);

                if (!Directory.Exists(OperationBase.ProgramMenuPath))
                {
                    this.Fail($"Cannot Access Program-Menu Folder: {OperationBase.ProgramMenuPath}");
                    return;
                }
            }
        }

        /// <summary>
        /// モニタプログラムを展開先フォルダにコピーする。
        /// </summary>
        private void InstallMonitor()
        {
            var tree = Xb.File.FileTree.GetTreeRecursiveAsync(this._monitorInstalledPath)
                .GetAwaiter()
                .GetResult();

            foreach (var node in tree.RootNode.Children)
            {
                if (node.Type != Xb.File.Tree.NodeBase.NodeType.File)
                    continue;

                var copyPath = Path.Combine(OperationBase.InstallPath, node.Name);

                try
                {
                    if (!File.Exists(copyPath))
                        File.Copy(node.FullPath, copyPath);
                }
                catch (Exception)
                {
                    // Delete All
                    this.Cleanup(OperationBase.InstallPath, true)
                        .GetAwaiter()
                        .GetResult();

                    this.Fail($"Monitor Copy Failure: {copyPath}");
                    return;
                }
            }
        }

        /// <summary>
        /// 実行ファイル本体を展開先フォルダにコピーする。
        /// </summary>
        private void InstallExecFiles()
        {
            try
            {
                using (ZipFile zip = ZipFile.Read(this._zipPath))
                {
                    zip.ExtractExistingFile = ExtractExistingFileAction.OverwriteSilently;
                    zip.ExtractAll(OperationBase.InstallPath);
                }
            }
            catch (Exception)
            {
                this.Fail($"FAIL to extract zip: {this._zipPath} to {OperationBase.InstallPath}");
                return;
            }
        }

        /// <summary>
        /// ショートカットを作成する。
        /// </summary>
        private void CreateShortcuts()
        {
            // ショートカット作成の参考
            // https://dobon.net/vb/dotnet/file/createshortcut.html

            var brwExePath = Path.Combine(OperationBase.InstallPath, "BrWebHost.exe");
            var saExePath = Path.Combine(OperationBase.InstallPath, "ScriptAgent.exe");

            var description = "";
            var desktopLinkPath = "";
            var programMenuLinkPath = "";

            if (File.Exists(brwExePath))
            {
                desktopLinkPath
                    = Path.Combine(OperationBase.DesktopPath, OperationBase.LinkBrWebHost);
                programMenuLinkPath
                    = Path.Combine(OperationBase.ProgramMenuPath, OperationBase.LinkBrWebHost);
                description = "Start BrWebHost";
            }
            else if (File.Exists(saExePath))
            {
                desktopLinkPath
                    = Path.Combine(OperationBase.DesktopPath, OperationBase.LinkScriptAgent);
                programMenuLinkPath
                    = Path.Combine(OperationBase.ProgramMenuPath, OperationBase.LinkScriptAgent);
                description = "Start BWH Script Agent";
            }
            else
            {
                this.Fail($"Exec-File Not Found.");
                return;
            }

            var monitorExePath = Path.Combine(OperationBase.InstallPath, "Monitor.exe");
            var monitorIconPath = Path.Combine(this.ProgramFilesPath, "Tools\\Monitor\\normal.ico"); ;

            //WshShellを作成
            Type t = Type.GetTypeFromCLSID(new Guid("72C24DD5-D70A-438B-8A42-98424B88AFB8"));
            dynamic shell = Activator.CreateInstance(t);

            //WshShortcutを作成
            if (!File.Exists(desktopLinkPath))
            {
                var desktopLink = shell.CreateShortcut(desktopLinkPath);
                desktopLink.TargetPath = monitorExePath;
                desktopLink.IconLocation = monitorIconPath;
                desktopLink.WorkingDirectory = OperationBase.InstallPath;
                desktopLink.Description = description;
                desktopLink.Save();
                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(desktopLink);
            }

            if (!File.Exists(programMenuLinkPath))
            {
                var programMenuLink = shell.CreateShortcut(programMenuLinkPath);
                programMenuLink.TargetPath = monitorExePath;
                programMenuLink.IconLocation = monitorIconPath;
                programMenuLink.WorkingDirectory = OperationBase.InstallPath;
                programMenuLink.Description = description;
                programMenuLink.Save();
                System.Runtime.InteropServices.Marshal.FinalReleaseComObject(programMenuLink);
            }

            System.Runtime.InteropServices.Marshal.FinalReleaseComObject(shell);
        }
    }
}
