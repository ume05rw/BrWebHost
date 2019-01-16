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

        private List<PanelBase> _panels = new List<PanelBase>();

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

        private void btnExec_Click(object sender, EventArgs e)
        {
            this.SetPanel(this.pnlExec);
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

        private void Init()
        {
            this._panels.Clear();
            this._panels.AddRange(new PanelBase[] 
            {
                this.pnlWifi,
                this.pnlPreparation,
                this.pnlExec,
                this.pnlSucceeded,
                this.pnlFailure
            });

            var settings = this.pnlWifi.GetSettings();

            Task.Run(() =>
            {
                // PC上のWiFiインタフェースを取得する。
                this._wifiInterface = WifiInterface.GetInterface();

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

                this.SetPanel(this.pnlWifi);
            });
        }

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
                    this.btnClose.Hide();
                }
                else if (panel == this.pnlFailure)
                {
                    this.btnRetry.Hide();
                    this.btnClose.Hide();
                }
            });
        }


        private async Task<bool> ExecSettings()
        {
            this.pnlExec.SetProgress(10);

            var settings = this.pnlWifi.GetSettings();

            var brProf = new BroadlinkProfile();
            var connected = await this._wifiInterface.Connect(brProf);

            if (!connected)
            {
                // BroadlinkProvに接続できなかった。
                // メッセージ表示して終了。
                var message = "Broadlink Device NOT Found.\r\nCheck your Device Preparation, and Retry.";

                if (!await this.RestoreWifi())
                {
                    message += "\r\n\r\n\r\nWiFi-Restoring Failure, Please set it manually.";
                }

                this.pnlFailure.SetMessage(message);
                this.SetPanel(this.pnlFailure);

                return false;
            }

            this.pnlExec.SetProgress(40);

            var setted = await SharpBroadlink.Broadlink.Setup(
                settings.Ssid,
                settings.Password,
                settings.Security
            );

            if (!setted)
            {
                // デバイスのWiFi設定に失敗した。
                // メッセージ表示して終了。
                var message = "Broadlink Device initialize Failure.\r\nCheck your Device Preparation, and Retry.";

                if (!await this.RestoreWifi())
                {
                    message += "\r\n\r\n\r\nWiFi-Restoring Failure, Please set it manually.";
                }

                this.pnlFailure.SetMessage(message);
                this.SetPanel(this.pnlFailure);

                return false;
            }

            this.pnlExec.SetProgress(80);

            await this.RestoreWifi();

            this.pnlExec.SetProgress(100);

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
