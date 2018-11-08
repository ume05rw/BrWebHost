using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Xb.App;
using System.Threading;

namespace Monitor
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// http://pineplanter.moo.jp/non-it-salaryman/2017/06/01/c-sharp-tasktray/
    /// </remarks>
    public partial class TaskTrayForm : Form
    {
        private IContainer _components;
        private NotifyIcon _icon;
        private ToolStripMenuItem _menuItemStart;
        private ToolStripMenuItem _menuItemStop;

        private string _currentPath;
        private readonly string _fileName = "BroadlinkWeb.exe";
        private Process _brProcess;

        private Task _monitor;
        private CancellationTokenSource _monitorCanceller;

        public TaskTrayForm()
        {
            this.Init();
            this.InitTasktray();
        }

        private void Init()
        {
            this.ShowInTaskbar = false;

            Job.Init();

            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            this._currentPath = Path.GetDirectoryName(pathToExe);
        }

        private void InitTasktray()
        {
            this._components = new Container();
            this._icon = new NotifyIcon(this._components);
            this._icon.Icon = new Icon("TaskTrayForm.ico");
            this._icon.Visible = true;
            this._icon.Text = "Br-Web Host";

            var menu = new ContextMenuStrip();
            this._icon.ContextMenuStrip = menu;

            this._menuItemStart = new ToolStripMenuItem();
            this._menuItemStart.Text = "&Start Br-Web Host";
            this._menuItemStart.Click += this.OnStart;
            menu.Items.Add(this._menuItemStart);

            this._menuItemStop = new ToolStripMenuItem();
            this._menuItemStop.Text = "&Stop Br-Web Host";
            this._menuItemStop.Click += this.OnStop;
            menu.Items.Add(this._menuItemStop);

            var menuItem = new ToolStripMenuItem();
            menuItem.Text = "&Exit Monitor";
            menuItem.Click += (sender, e) => {
                Application.Exit();
            };
            menu.Items.Add(menuItem);

            this.OnStart(this, new EventArgs());
            this.StartMonitor();
        }

        private void StartMonitor()
        {
            this._monitorCanceller = new CancellationTokenSource();
            var token = this._monitorCanceller.Token;

            this._monitor = Task.Run(async () => {

                while (true)
                {
                    if (token.IsCancellationRequested)
                        break;

                    try
                    {
                        if (this._brProcess == null)
                        {
                            Xb.Util.Out("Process Null");
                            // プロセスがnull = 開始前
                            Job.RunUI(() => {
                                // TODO: アイコンを無効状態に差し替え

                                this._menuItemStart.Enabled = true;
                                this._menuItemStop.Enabled = false;
                            });
                        }
                        else if (this._brProcess.HasExited)
                        {
                            Xb.Util.Out("Process Exited");
                            // プロセスが終了状態で保持中 = 終了処理中のはず
                            Job.RunUI(() => {
                                // TODO: アイコンを無効状態に差し替え

                                this._menuItemStart.Enabled = false;
                                this._menuItemStop.Enabled = false;
                            });
                        }
                        else
                        {
                            Xb.Util.Out("Process Working");
                            // プロセスが存在し、HasExitedでもない = 稼働中
                            Job.RunUI(() => {
                                // TODO: アイコンを有効状態に差し替え

                                this._menuItemStart.Enabled = false;
                                this._menuItemStop.Enabled = true;
                            });
                        }

                        await Task.Delay(1000 * 1);
                    }
                    catch (Exception ex)
                    {
                        Xb.Util.Out(ex);
                    }
                }
            }, this._monitorCanceller.Token);

            this._monitor.ConfigureAwait(false);
        }

        

        private void OnStart(object sender, EventArgs e)
        {
            try
            {
                if (this._brProcess != null)
                    throw new InvalidOperationException("Now On Working");

                this._brProcess = new Process();

                this._brProcess.StartInfo.UseShellExecute = false;
                this._brProcess.StartInfo.RedirectStandardOutput = true;
                this._brProcess.StartInfo.RedirectStandardError = true;
                this._brProcess.StartInfo.RedirectStandardInput = false;
                //this._brProcess.StartInfo.StandardOutputEncoding = this.Encoding;

                this._brProcess.StartInfo.CreateNoWindow = true;
                this._brProcess.StartInfo.WorkingDirectory = this._currentPath;
                this._brProcess.StartInfo.FileName = Path.Combine(this._currentPath, this._fileName);
                //this._brProcess.StartInfo.FileName = "notepad.exe";
                //this._brProcess.StartInfo.Arguments = "--console";

                var result = this._brProcess.Start();
                if (!result)
                {
                    this._brProcess.Dispose();
                    this._brProcess = null;
                    MessageBox.Show("Br-Web Host Start Failure.", "Br-Web Host", MessageBoxButtons.OK);
                    return;
                }
                this._brProcess.Exited += this.OnStop;

                // 一旦、開始／停止どちらも無効化
                Job.RunUI(() => {
                    this._menuItemStart.Enabled = false;
                    this._menuItemStop.Enabled = false;
                });
            }
            catch (Exception ex)
            {
                Xb.Util.Out(ex);
            }
        }

        private void OnStop(object sender, EventArgs e)
        {
            try
            {
                if (this._brProcess != null)
                {
                    if (!this._brProcess.HasExited)
                    {
                        try
                        {
                            this._brProcess.Kill();
                        }
                        catch (Exception)
                        {
                        }
                    }

                    try
                    {
                        this._brProcess.Exited -= this.OnStop;
                        this._brProcess.Dispose();
                    }
                    catch (Exception)
                    {
                    }

                    this._brProcess = null;
                }

                // 一旦、開始／停止どちらも無効化
                Job.RunUI(() => {
                    this._menuItemStart.Enabled = false;
                    this._menuItemStop.Enabled = false;
                });
            }
            catch (Exception ex)
            {
                Xb.Util.Out(ex);
            }
        }
    }
}
