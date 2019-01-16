using Initializer.Models;
using Initializer.Views;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
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
            Xb.App.Job.Init();

            this.InitializeComponent();
            this.Height = 332;

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

            this.btnExec.Left = this.btnNext.Left;
            this.btnClose.Left = this.btnNext.Left;
            this.btnRetry.Left = this.btnPrev.Left;
        }

#region "Events"

        private void Main_Load(object sender, EventArgs e)
        {
            this.Init();
        }

        private void btnNext_Click(object sender, EventArgs e)
        {
            this.SetPanel(this.pnlPreparation);
        }

        private void btnPrev_Click(object sender, EventArgs e)
        {
            this.SetPanel(this.pnlWifi);
        }

        private void btnExec_Click(object sender, EventArgs e)
        {
            this.ExecSettings();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void btnRetry_Click(object sender, EventArgs e)
        {
            this.Init();
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
            this.pnlExec.lblPanelTitle.Text = "Now Booting...";
            this.SetPanel(this.pnlExec);

            this.pnlExec.SetProgress(10);
            await Task.Delay(1000);

            var settings = this.pnlWifi.GetSettings();

            this.pnlExec.SetProgress(20);
            await Task.Delay(1000);

            await Task.Run(async () =>
            {
                // PC上のWiFiインタフェースを取得する。
                this._wifiInterface = WifiInterface.GetInterface();

                this.pnlExec.SetProgress(40);
                await Task.Delay(1000);

                // PC上にWiFiインタフェースが無い場合
                if (this._wifiInterface == null)
                {
                    // メッセージ表示して終了。
                    this.pnlFailure.SetMessage("WiFi-Interfaces NOT Found on your PC.\r\nAdd WiFi-Device, and Retry.");
                    this.SetPanel(this.pnlFailure);
                    return;
                }

                // 以降、WiFiインタフェースが存在するとする。

                // 現在接続中のWiFi情報を取得する。
                this._currentProfile = this._wifiInterface.GetCurrentProfile();

                this.pnlExec.SetProgress(70);
                await Task.Delay(1000);

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

                // 現在稼働中のBroadlinkデバイスを取得する。
                // 保持しておき、処理終了後の新規デバイス検出に利用する。
                var devs = Device.Discover();

                this.pnlExec.SetProgress(100);
                await Task.Delay(500);

                this.SetPanel(this.pnlWifi);
            });

            return true;
        }

        private async Task<bool> ExecSettings()
        {
            this.pnlExec.lblPanelTitle.Text = "Now Setting...";
            this.SetPanel(this.pnlExec);

            this.pnlExec.SetProgress(10);
            await Task.Delay(1000);

            var settings = this.pnlWifi.GetSettings();

            var brProf = new BroadlinkProfile();
            var connected = await this._wifiInterface.Connect(brProf);

            this.pnlExec.SetProgress(30);
            await Task.Delay(1000);

            if (!connected)
            {
                // BroadlinkProvに接続できなかった。
                // メッセージ表示して終了。
                var message = "Broadlink Device NOT Found.\r\nCheck your Device Preparation, and Retry.";

                if (!await this.RestoreWifi())
                {
                    message += "\r\n\r\n\r\n";
                    message += "PC's WiFi restoring Failure, Please set it manually.";
                }

                this.pnlFailure.SetMessage(message);
                this.SetPanel(this.pnlFailure);

                return false;
            }

            var setted = await SharpBroadlink.Broadlink.Setup(
                settings.Ssid,
                settings.Password,
                settings.Security
            );

            this.pnlExec.SetProgress(60);
            await Task.Delay(1000);

            if (!setted)
            {
                // デバイスのWiFi設定に失敗した。
                // メッセージ表示して終了。
                var message = "Broadlink Device initialize Failure.\r\nCheck your Device Preparation, and Retry.";

                if (!await this.RestoreWifi())
                {
                    message += "\r\n\r\n\r\n";
                    message += "PC's WiFi restoring Failure, Please set it manually.";
                }

                this.pnlFailure.SetMessage(message);
                this.SetPanel(this.pnlFailure);

                return false;
            }

            await this.RestoreWifi();

            this.pnlExec.SetProgress(80);
            await Task.Delay(1000);

            var devs = await Device.Discover();

            this.pnlExec.SetProgress(90);
            await Task.Delay(1000);

            var message2 = (devs.Length > 0)
                ? $"New Device IP is...\r\n\r\n    {devs[0].GetIpAddressString()}"
                : "New Device is Ready!";
            this.pnlSucceeded.SetMessage(message2);

            this.pnlExec.SetProgress(100);
            await Task.Delay(500);

            this.SetPanel(this.pnlSucceeded);

            return true;
        }

        private async Task<bool> RestoreWifi()
        {
            if (this._currentProfile == null)
            {
                return true;
            }
            else
            {
                return await this._wifiInterface.Connect(this._currentProfile);
            }
        }
    }
}
