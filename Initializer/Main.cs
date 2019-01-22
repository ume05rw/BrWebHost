using Initializer.Models;
using Initializer.Models.Langs;
using Initializer.Views;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Initializer
{
    public partial class Main : Form
    {
        private WifiInterface _wifiInterface = null;
        private Profile _currentProfile = null;

        public Main()
        {
            Xb.App.Job.IsDumpStatus = false;
            Xb.App.Job.IsDumpTaskValidation = false;
            Xb.App.Job.IsMonitorEnabled = false;
            Xb.App.Job.Init();

            this.InitializeComponent();

            if (LicenseManager.UsageMode != LicenseUsageMode.Designtime)
            {
                // WindowsFormデザイナ時には通らない。
                this.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
                this.pnlWifi.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
                this.pnlPreparation.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
                this.pnlExec.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
                this.pnlSucceeded.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
                this.pnlFailure.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            }

            this.pnlWifi.Hide();
            this.pnlPreparation.Hide();
            this.pnlExec.Hide();
            this.pnlSucceeded.Hide();
            this.pnlFailure.Hide();

            this.btnPrev.Text = Lang.Instance.Prev;
            this.btnNext.Text = Lang.Instance.Next;
            this.btnExec.Text = Lang.Instance.Exec;
            this.btnClose.Text = Lang.Instance.Close;
            this.btnRetry.Text = Lang.Instance.Retry;

            this.btnPrev.Hide();
            this.btnNext.Hide();
            this.btnExec.Hide();
            this.btnClose.Hide();
            this.btnRetry.Hide();

            this.btnExec.Left = this.btnNext.Left;
            this.btnClose.Left = this.btnNext.Left;
            this.btnRetry.Left = this.btnPrev.Left;
        }

#region "Events"

        private void Main_Load(object sender, EventArgs e)
        {
#pragma warning disable 4014
            this.Init();
#pragma warning restore 4014
        }

        private void btnNext_Click(object sender, EventArgs e)
        {
            if (this.pnlWifi.Validate())
                this.SetPanel(this.pnlPreparation);
        }

        private void btnPrev_Click(object sender, EventArgs e)
        {
            this.SetPanel(this.pnlWifi);
        }

        private void btnExec_Click(object sender, EventArgs e)
        {
#pragma warning disable 4014
            this.ExecSettings();
#pragma warning restore 4014
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btnRetry_Click(object sender, EventArgs e)
        {
#pragma warning disable 4014
            this.Init();
#pragma warning restore 4014
        }

        private void Main_FormClosing(object sender, FormClosingEventArgs e)
        {
            this.pnlWifi.GetSettings().Save();
        }

        #endregion

        private void SetPanel(PanelBase panel)
        {
            Xb.App.Job.RunUI(() =>
            {
                this.pnlWifi.Hide();
                this.pnlPreparation.Hide();
                this.pnlExec.Hide();
                this.pnlSucceeded.Hide();
                this.pnlFailure.Hide();

                this.btnPrev.Hide();
                this.btnNext.Hide();
                this.btnExec.Hide();
                this.btnClose.Hide();
                this.btnRetry.Hide();

                panel.ShowPanel();

                if (panel == this.pnlWifi)
                {
                    this.btnNext.Show();
                }
                else if (panel == this.pnlPreparation)
                {
                    this.btnPrev.Show();
                    this.btnExec.Show();
                }
                else if (panel == this.pnlExec)
                {

                }
                else if (panel == this.pnlSucceeded)
                {
                    this.btnClose.Show();
                }
                else if (panel == this.pnlFailure)
                {
                    this.btnRetry.Show();
                    this.btnClose.Show();
                }
            });
        }

        private async Task<bool> Init()
        {
            //Xb.Util.Out("Init");
            this.pnlExec.lblPanelTitle.Text = Lang.Instance.NowBooting;
            this.SetPanel(this.pnlExec);

            this.pnlExec.SetProgress(10);
            await Task.Delay(500);

            //Xb.Util.Out("Get saved app-settings.");
            var settings = this.pnlWifi.GetSettings();

            this.pnlExec.SetProgress(15);
            await Task.Delay(500);

            await Task.Run(async () =>
            {
                try
                {
                    //Xb.Util.Out("Get All Nics.");
                    NetInterface.Init();
                    this.pnlExec.SetProgress(40);
                    await Task.Delay(500);

                    // PC上のWiFiインタフェースを取得する。
                    //Xb.Util.Out("Get current WiFi interface.");
                    try
                    {
                        this._wifiInterface = WifiInterface.GetInterface();
                    }
                    catch (Exception)
                    {
                        this._wifiInterface = null;
                    }

                    this.pnlExec.SetProgress(60);
                    await Task.Delay(500);

                    // PC上にWiFiインタフェースが無い場合
                    if (this._wifiInterface == null)
                    {
                        // メッセージ表示して終了。
                        //"WiFi-Interfaces NOT Found on your PC.\r\nAdd WiFi-Device, and Retry."
                        this.pnlFailure.SetMessage(Lang.Instance.WifiInterfacesNotFound);
                        this.SetPanel(this.pnlFailure);
                        return;
                    }

                    // 以降、WiFiインタフェースが存在するとする。

                    // 現在接続中のWiFi情報を取得する。
                    //Xb.Util.Out("Get current WiFi profile.");
                    try
                    {
                        this._currentProfile = this._wifiInterface.GetCurrentProfile();
                    }
                    catch (Exception)
                    {
                    }
                    

                    this.pnlExec.SetProgress(80);
                    await Task.Delay(500);

                    // 保存済SSIDが空で、現在接続中WiFi情報が取れていればセットする。
                    if (this._currentProfile != null
                        && !string.IsNullOrEmpty(this._currentProfile.Ssid)
                        && !settings.Exists
                    )
                    {
                        var newSettings = new Settings(
                            this._currentProfile.SecurityType,
                            this._currentProfile.Ssid,
                            string.Empty
                        );

                        this.pnlWifi.SetSettings(newSettings);
                    }

                    this.pnlExec.SetProgress(100);
                    await Task.Delay(500);

                    this.SetPanel(this.pnlWifi);
                }
                catch (Exception ex)
                {
                    Xb.Util.Out(ex);
                    throw;
                }

            });

            return true;
        }

        private async Task<bool> ExecSettings()
        {
            this.pnlExec.lblPanelTitle.Text = Lang.Instance.NowSetting;
            this.SetPanel(this.pnlExec);

            this.pnlExec.SetProgress(10);
            await Task.Delay(500);


            // 現在稼働中のBroadlinkデバイスを取得する。
            // 保持しておき、処理終了後の新規デバイス検出に利用する。
            //Xb.Util.Out("Get running Broadlink devices.");
            Device.DisposeAll();
            var devs = await Device.Discover();
            //Xb.Util.Out("  Already running Device count: " + devs.Length);

            this.pnlExec.SetProgress(20);
            await Task.Delay(500);

            //Xb.Util.Out("Disabling unuse interfaces.");
            var disabledNics = new List<NetInterface>();
            var nics = NetInterface.GetAll();
            foreach (var nic in nics)
            {
                var equals = this._wifiInterface.Equals(nic);
                var enabled = nic.IsEnabled;

                if (!this._wifiInterface.Equals(nic)
                    && nic.IsEnabled)
                {
                    nic.Disable();
                    disabledNics.Add(nic);
                }
            }

            this.pnlExec.SetProgress(30);
            await Task.Delay(2500);


            //Xb.Util.Out("Get inputed settings.");
            var settings = this.pnlWifi.GetSettings();

            this.pnlExec.SetProgress(40);
            await Task.Delay(500);

            //Xb.Util.Out("Connect to BroadlinkProv.");
            var brProf = new BroadlinkProfile();
            var connected = await this._wifiInterface.Connect(brProf);

            this.pnlExec.SetProgress(50);
            await Task.Delay(500);

            if (!connected)
            {
                // BroadlinkProvに接続できなかった。
                // メッセージ表示して終了。
                //"Broadlink Device NOT Found.\r\nCheck your Device Preparation, and Retry."
                var message = Lang.Instance.BroadlinkDeviceNotFound;

                if (!await this.RestoreNetworks(disabledNics.ToArray()))
                {
                    message += "\r\n\r\n\r\n";
                    // "PC's WiFi restoring Failure, Please set it manually."
                    message += Lang.Instance.PcWifiRestoringFailure;
                }

                this.pnlFailure.SetMessage(message);
                this.SetPanel(this.pnlFailure);

                return false;
            }

            //Xb.Util.Out("Wait for WiFi settings.");
            await Task.Delay(2500);

            //Xb.Util.Out("Set WiFi settings to Broadlink device.");
            var setted = false;
            for(var i = 0; i < 3; i++)
            {
                //Xb.Util.Out("  try - " + (i + 1));
                var settedOnce = await SharpBroadlink.Broadlink.Setup(
                    settings.Ssid,
                    settings.Password,
                    settings.Security
                );

                if (settedOnce && !setted)
                    setted = true;

                await Task.Delay(500);
            }


            this.pnlExec.SetProgress(65);
            await Task.Delay(500);

            if (!setted)
            {
                // デバイスのWiFi設定に失敗した。
                // メッセージ表示して終了。
                // "Broadlink Device initialize Failure.\r\nCheck your Device Preparation, and Retry."
                var message = Lang.Instance.BroadlinkDeviceInitializeFailure;

                if (!await this.RestoreNetworks(disabledNics.ToArray()))
                {
                    message += "\r\n\r\n\r\n";

                    // "PC's WiFi restoring Failure, Please set it manually."
                    message += Lang.Instance.PcWifiRestoringFailure;
                }

                this.pnlFailure.SetMessage(message);
                this.SetPanel(this.pnlFailure);

                return false;
            }

            //Xb.Util.Out("Restoring Nics.");
            var restored = await this.RestoreNetworks(disabledNics.ToArray());

            if (restored)
            {
                this.pnlExec.SetProgress(80);
                await Task.Delay(2500);

                //Xb.Util.Out("Search new Broadlink device.");
                var devs2 = await Device.Discover();
                //Xb.Util.Out("  new Device count: " + devs2.Length);

                this.pnlExec.SetProgress(90);
                await Task.Delay(500);

                // "New Device IP is..." or "New Device is Ready!"
                var message2 = (devs.Length > 0)
                    ? $"{Lang.Instance.NewDeviceIpIs}\r\n\r\n    {devs[0].GetIpAddressString()}"
                    : Lang.Instance.NewDeviceIsReady;
                this.pnlSucceeded.SetMessage(message2);
            }
            else
            {
                // "New Device is Ready!"
                var message2 = Lang.Instance.NewDeviceIsReady;
                this.pnlSucceeded.SetMessage(message2);
            }


            this.pnlExec.SetProgress(100);
            await Task.Delay(500);

            this.SetPanel(this.pnlSucceeded);

            return true;
        }

        private async Task<bool> RestoreNetworks(NetInterface[] disabledNics)
        {
            foreach (var nic in disabledNics)
            {
                nic.Enable();
            }

            if (this._currentProfile == null)
            {
                return true;
            }
            else
            {
                var restored = false;
                for(var i = 0; i < 3; i++)
                {
                    var restoredOnce = await this._wifiInterface.Connect(this._currentProfile);

                    if (restoredOnce && !restored)
                        restored = true;
                }
                return restored;
            }
        }
    }
}
