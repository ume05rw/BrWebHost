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
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using NetFwTypeLib;

namespace Monitor
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// http://pineplanter.moo.jp/non-it-salaryman/2017/06/01/c-sharp-tasktray/
    /// </remarks>
    public class TaskTrayForm : Form
    {
        public const string FileNameMain = "BroadlinkWeb.exe";
        public const string FileNameAgent = "ScriptAgent.exe";

        public enum Target
        {
            BroadlinkWeb = 1,
            ScriptAgent = 2,
            Test = 3
        }


        private IContainer _components;
        private NotifyIcon _icon;
        private Icon _warnIcon;
        private Icon _okIcon;
        private ToolStripMenuItem _menuItemStart;
        private ToolStripMenuItem _menuItemStop;
        private WaitIndicator _waitIndicator;

        private Target _target;
        private string _currentPath;
        private readonly string _fileName;
        private Process _brProcess;

        private Task _monitor;
        private CancellationTokenSource _monitorCanceller;

        public TaskTrayForm(Target target)
        {
            this._target = target;
            this.ShowInTaskbar = false;
            this._waitIndicator = new WaitIndicator();

            Job.IsMonitorEnabled = false;
            Job.IsDumpStatus = false;
            Job.Init();


            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            this._currentPath = Path.GetDirectoryName(pathToExe);

            int startDelaySec = 0;
            switch (this._target)
            {
                case Target.BroadlinkWeb:
                    this._fileName = Path.Combine(this._currentPath, TaskTrayForm.FileNameMain);
                    startDelaySec = 25;
                    break;
                case Target.ScriptAgent:
                    this._fileName = Path.Combine(this._currentPath, TaskTrayForm.FileNameAgent);
                    startDelaySec = 8;
                    break;
                case Target.Test:
                    this._fileName = "notepad.exe";
                    startDelaySec = 10;
                    break;
                default:
                    throw new ArgumentException($"Unexpected target: {target}");
            }

            this.SetFirewall();
            this.InitTasktray();
            this.OnStart(this, new EventArgs());
            this.StartMonitor();

            Job.RunUI(() => {
                this._waitIndicator.Show();
            });

            Task.Delay(startDelaySec * 1000)
                .ContinueWith((p) => 
                {
                    this.StartBrowser();

                    Job.RunUI(() => {
                        this._waitIndicator.Hide();
                    });
                })
                .ConfigureAwait(false);
        }

        private void InitTasktray()
        {
            this._components = new Container();
            this._icon = new NotifyIcon(this._components);

            this._warnIcon = new Icon("warn.ico");
            this._okIcon = new Icon("ok.ico");

            this._icon.Icon = this._warnIcon;
            this._icon.Visible = true;
            this._icon.Text = "Br-Web Host";

            var menu = new ContextMenuStrip();
            this._icon.ContextMenuStrip = menu;

            var menuItem1 = new ToolStripMenuItem();
            menuItem1.Text = "&Show Browser";
            menuItem1.Click += (sender, e) => {
                this.StartBrowser();
            };
            menu.Items.Add(menuItem1);

            this._menuItemStart = new ToolStripMenuItem();
            
            this._menuItemStart.Click += this.OnStart;
            menu.Items.Add(this._menuItemStart);

            this._menuItemStop = new ToolStripMenuItem();
            
            this._menuItemStop.Click += this.OnStop;
            menu.Items.Add(this._menuItemStop);

            var menuItem2 = new ToolStripMenuItem();
            menuItem2.Text = "&Exit Monitor";
            menuItem2.Click += (sender, e) => {
                Application.Exit();
            };
            menu.Items.Add(menuItem2);

            switch (this._target)
            {
                case Target.BroadlinkWeb:
                    this._menuItemStart.Text = "&Start BrWebHost";
                    this._menuItemStop.Text = "&Stop BrWebHost";
                    break;
                case Target.ScriptAgent:
                    this._menuItemStart.Text = "&Start BrScriptAgent";
                    this._menuItemStop.Text = "&Stop BrScriptAgent";
                    break;
                case Target.Test:
                    this._menuItemStart.Text = "&Start TestApp";
                    this._menuItemStop.Text = "&Stop TestApp";
                    break;
                default:
                    throw new ArgumentException($"Unexpected target: {this._target}");
            }
        }

        private void OnStart(object sender, EventArgs e)
        {
            try
            {
                if (this._brProcess != null)
                    throw new InvalidOperationException("Now On Working");

                this._brProcess = new Process();

                this._brProcess.StartInfo.UseShellExecute = false;

                // リリース用 ※Redirect** はtrueにしないこと。Kestrelが起動しない。
                this._brProcess.StartInfo.CreateNoWindow = true;
                this._brProcess.StartInfo.RedirectStandardOutput = false;
                this._brProcess.StartInfo.RedirectStandardError = false;
                this._brProcess.StartInfo.RedirectStandardInput = false;
                //this._brProcess.StartInfo.StandardOutputEncoding = this.Encoding;

                //// デバッグ用 - コンソール上で実行状況を表示する。
                //this._brProcess.StartInfo.CreateNoWindow = false;
                //this._brProcess.StartInfo.RedirectStandardOutput = false;
                //this._brProcess.StartInfo.RedirectStandardError = false;
                //this._brProcess.StartInfo.RedirectStandardInput = false;
                ////this._brProcess.StartInfo.StandardOutputEncoding = this.Encoding;


                this._brProcess.StartInfo.WorkingDirectory = this._currentPath;
                this._brProcess.StartInfo.FileName = this._fileName;
                //this._brProcess.StartInfo.Arguments = "--console";

                var result = this._brProcess.Start();
                if (!result)
                {
                    this._brProcess.Dispose();
                    this._brProcess = null;
                    MessageBox.Show("BrWebHost Start Failure.", "BrWebHost", MessageBoxButtons.OK);
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
                                this._icon.Icon = this._warnIcon;
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
                                this._icon.Icon = this._warnIcon;
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
                                this._icon.Icon = this._okIcon;
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

        private async Task<bool> StartBrowser()
        {
            var addr = this.GetLocalPrimaryAddress();
            var browser = new Process();

            browser.StartInfo.UseShellExecute = false;
            browser.StartInfo.RedirectStandardOutput = true;
            browser.StartInfo.RedirectStandardError = true;
            browser.StartInfo.RedirectStandardInput = false;

            browser.StartInfo.CreateNoWindow = true;
            browser.StartInfo.WorkingDirectory = this._currentPath;
            browser.StartInfo.FileName = "cmd.exe";
            browser.StartInfo.Arguments = $"/c start http://{addr.ToString()}:5004";

            browser.Start();

            return true;
        }

        /// <summary>
        /// Get the local IPv4 address of the same segment as the default gateway.
        /// </summary>
        /// <returns></returns>
        private IPAddress GetLocalPrimaryAddress()
        {
            var prop = NetworkInterface
                .GetAllNetworkInterfaces()
                .Select(i => i.GetIPProperties())
                .FirstOrDefault(p => p.GatewayAddresses.Count > 0);

            if (prop == null)
                return null;

            var v4Addr = prop.UnicastAddresses
                .Select(ua => ua.Address)
                .Where(addr => addr.AddressFamily == AddressFamily.InterNetwork
                                && !IPAddress.IsLoopback(addr))
                .FirstOrDefault();

            return (v4Addr != null)
                ? v4Addr
                : null;
        }

        private void SetFirewall()
        {
            try
            {
                // Create the FwPolicy2 object.
                var netFwPolicy2Type = Type.GetTypeFromProgID("HNetCfg.FwPolicy2", false);
                var fwPolicy2 = (INetFwPolicy2)Activator.CreateInstance(netFwPolicy2Type);

                var pathToExe = Process.GetCurrentProcess().MainModule.FileName;

                // Get the Rules object
                INetFwRules rulesObject = fwPolicy2.Rules;

                int CurrentProfiles = fwPolicy2.CurrentProfileTypes;

                // Create a Rule Object.
                var netFwRuleType = Type.GetTypeFromProgID("HNetCfg.FWRule", false);

                var rule1 = (INetFwRule)Activator.CreateInstance(netFwRuleType);
                rule1.Name = "BrWebHost_TCP_OUT_5004";
                rule1.Description = "Allow BrWebHost TCP OUT port 5004";
                rule1.ApplicationName = pathToExe;
                rule1.Protocol = (int)NET_FW_IP_PROTOCOL_.NET_FW_IP_PROTOCOL_TCP;
                rule1.LocalPorts = "5004";
                rule1.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_OUT;
                rule1.Enabled = true;
                rule1.Grouping = "@firewallapi.dll,-23255";
                rule1.Profiles = CurrentProfiles;
                rule1.Action = NET_FW_ACTION_.NET_FW_ACTION_ALLOW;
                rulesObject.Add(rule1);

                var rule2 = (INetFwRule)Activator.CreateInstance(netFwRuleType);
                rule2.Name = "BrWebHost_TCP_IN_5004";
                rule2.Description = "Allow BrWebHost TCP IN port 5004";
                rule2.ApplicationName = pathToExe;
                rule2.Protocol = (int)NET_FW_IP_PROTOCOL_.NET_FW_IP_PROTOCOL_TCP;
                rule2.LocalPorts = "5004";
                rule2.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_IN;
                rule2.Enabled = true;
                rule2.Grouping = "@firewallapi.dll,-23255";
                rule2.Profiles = CurrentProfiles;
                rule2.Action = NET_FW_ACTION_.NET_FW_ACTION_ALLOW;
                rulesObject.Add(rule2);


                var rule3 = (INetFwRule)Activator.CreateInstance(netFwRuleType);
                rule3.Name = "BrWebHost_UDP_OUT_5004";
                rule3.Description = "Allow BrWebHost UDP OUT port 5004";
                rule3.ApplicationName = pathToExe;
                rule3.Protocol = (int)NET_FW_IP_PROTOCOL_.NET_FW_IP_PROTOCOL_UDP;
                rule3.LocalPorts = "5004";
                rule3.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_OUT;
                rule3.Enabled = true;
                rule3.Grouping = "@firewallapi.dll,-23255";
                rule3.Profiles = CurrentProfiles;
                rule3.Action = NET_FW_ACTION_.NET_FW_ACTION_ALLOW;
                rulesObject.Add(rule3);

                var rule4 = (INetFwRule)Activator.CreateInstance(netFwRuleType);
                rule4.Name = "BrWebHost_UDP_IN_5004";
                rule4.Description = "Allow BrWebHost UDP IN port 5004";
                rule4.ApplicationName = pathToExe;
                rule4.Protocol = (int)NET_FW_IP_PROTOCOL_.NET_FW_IP_PROTOCOL_UDP;
                rule4.LocalPorts = "5004";
                rule4.Direction = NET_FW_RULE_DIRECTION_.NET_FW_RULE_DIR_IN;
                rule4.Enabled = true;
                rule4.Grouping = "@firewallapi.dll,-23255";
                rule4.Profiles = CurrentProfiles;
                rule4.Action = NET_FW_ACTION_.NET_FW_ACTION_ALLOW;
                rulesObject.Add(rule4);
            }
            catch (Exception ex)
            {
                Xb.Util.Out(ex);
            }
        }
    }
}
