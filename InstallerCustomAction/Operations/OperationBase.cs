using System;
using System.Collections.Generic;
using System.Configuration.Install;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace InstallerCustomAction.Operations
{
    public abstract class OperationBase
    {
        /// <summary>
        /// C:\ProgramData
        /// </summary>
        protected static readonly string ProgramDataPath
            = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);

        /// <summary>
        /// C:\ProgramData\BrWebHost
        /// </summary>
        protected static readonly string InstallPath
            = Path.Combine(OperationBase.ProgramDataPath, "BrWebHost");

        /// <summary>
        /// スタートメニューのプログラムフォルダ
        /// </summary>
        protected static readonly string StartMenuPath
            = Environment.GetFolderPath(Environment.SpecialFolder.CommonPrograms);

        /// <summary>
        /// スタートメニュー上のショートカット保持フォルダ
        /// </summary>
        protected static readonly string ProgramMenuPath
            = Path.Combine(OperationBase.StartMenuPath, "BrWebHost");

        /// <summary>
        /// デスクトップフォルダ
        /// </summary>
        protected static readonly string DesktopPath
            = Environment.GetFolderPath(Environment.SpecialFolder.CommonDesktopDirectory);

        /// <summary>
        /// BrWebHostのショートカットファイル名
        /// </summary>
        protected static readonly string LinkBrWebHost
            = "Start BrWebHost.lnk";

        /// <summary>
        /// ScriptAgentのショートカットファイル名
        /// </summary>
        protected static readonly string LinkScriptAgent
            = "Start ScriptAgent.lnk";

        /// <summary>
        /// 処理失敗
        /// </summary>
        /// <param name="message"></param>
        public static void OperationFailure(string message)
        {
            MessageBox.Show(
                message,
                "BrWebHost Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Exclamation,
                MessageBoxDefaultButton.Button1,
                MessageBoxOptions.DefaultDesktopOnly
            );

            throw new InstallException(message);
        }

        /// <summary>
        /// 警告表示
        /// </summary>
        /// <param name="message"></param>
        public static void OperationAlert(string message)
        {
            MessageBox.Show(
                message,
                "BrWebHost Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning,
                MessageBoxDefaultButton.Button1,
                MessageBoxOptions.DefaultDesktopOnly
            );
        }

        protected string ProgramFilesPath { get; private set; } = "";

        protected void SetProgramFilesPath(string programFilesPath)
        {
            this.ProgramFilesPath = programFilesPath;
        }

        /// <summary>
        /// 処理失敗
        /// </summary>
        /// <param name="message"></param>
        protected void Fail(string message)
        {
            OperationBase.OperationFailure(message);
        }

        /// <summary>
        /// 警告表示
        /// </summary>
        /// <param name="message"></param>
        protected void Alert(string message)
        {
            OperationBase.OperationAlert(message);
        }

        /// <summary>
        /// インストール／アンインストールを実行する。
        /// </summary>
        public abstract void Exec(string programFilesPath);

        /// <summary>
        /// クリーンアップ時の除外対象。Monitor関係のファイル。
        /// </summary>
        private static readonly string[] Excluded = new string[]
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

        /// <summary>
        /// ProgramDataフォルダ上のファイルを削除する。
        /// DotNetCore実行ファイル、Monitorが対象。
        /// </summary>
        /// <param name="targetDir"></param>
        /// <param name="force"></param>
        /// <returns></returns>
        protected async Task<bool> Cleanup(string targetDir, bool force = false)
        {
            var tree = await Xb.File.FileTree.GetTreeRecursiveAsync(targetDir);

            foreach (var node in tree.RootNode.Children)
            {
                if (
                    (force == true)
                    || (force == false && !OperationBase.Excluded.Contains(node.Name))
                )
                {
                    try
                    {
                        node.Delete();
                    }
                    catch (Exception) {}
                }
            }

            return true;
        }

        /// <summary>
        /// 展開先フォルダの既存ファイルを削除する。
        /// </summary>
        protected void DeleteExists()
        {
            // 実行ファイル展開先フォルダ上の全ファイル・フォルダを削除
            if (Directory.Exists(OperationBase.InstallPath))
            {
                this.Cleanup(OperationBase.InstallPath, true)
                    .GetAwaiter()
                    .GetResult();
            }
        }
    }
}
