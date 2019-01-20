using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InstallerCustomAction.Operations
{
    public class UnInstall : OperationBase
    {
        /// <summary>
        /// アンインストールを実行する。
        /// </summary>
        /// <param name="programFilesPath"></param>
        public override void Exec(string programFilesPath)
        {
            this.SetProgramFilesPath(programFilesPath);

            // ショートカットを削除する。
            this.DeleteShortcuts();

            // 展開先フォルダの既存ファイルを削除する。
            this.DeleteExists();
        }

        /// <summary>
        /// ショートカットを削除する。
        /// </summary>
        private void DeleteShortcuts()
        {
            try
            {
                var path = Path.Combine(OperationBase.DesktopPath, OperationBase.LinkBrWebHost);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception) { }
            try
            {
                var path = Path.Combine(OperationBase.DesktopPath, OperationBase.LinkScriptAgent);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception) { }
            try
            {
                var path = Path.Combine(OperationBase.ProgramMenuPath, OperationBase.LinkBrWebHost);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception) { }
            try
            {
                var path = Path.Combine(OperationBase.ProgramMenuPath, OperationBase.LinkScriptAgent);
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception) { }
        }
    }
}
