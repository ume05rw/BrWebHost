using Initializer.Models;
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
        }

#region "Events"

        private void Main_Load(object sender, EventArgs e)
        {
            this.Init();
        }

        private void chkPassword_CheckedChanged(object sender, EventArgs e)
        {
            this.txtPassword.PasswordChar = (this.chkPassword.Checked)
                ? '\0'
                : '*';
        }

        private void btnNext_Click(object sender, EventArgs e)
        {

        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            // TODO: 場合によって、メッセージボックスを表示する。
            this.Close();
        }

        private void Main_FormClosing(object sender, FormClosingEventArgs e)
        {
            this.SaveSettings();
        }

        private void btnTest_Click(object sender, EventArgs e)
        {
            this.ExecSettings();
        }

        #endregion

        private void Init()
        {
            this.LoadSettings();
            var loadedSsid = this.txtSsid.Text;

            Task.Run(() =>
            {
                // PC上のWiFiインタフェースを取得する。
                this._wifiInterface = WifiInterface.GetInterface();

                // PC上にWiFiインタフェースが無い場合
                if (this._wifiInterface == null)
                {
                    // メッセージ表示して終了。
                    Xb.App.Job.RunUI(() =>
                    {
                        MessageBox.Show(
                            "WiFi-Interfaces NOT Found on your PC.\r\nAdd WiFi-Device, and Retry.",
                            "BrDevice Initializer",
                            MessageBoxButtons.OK,
                            MessageBoxIcon.Exclamation
                        );

                        this.Close();
                    });

                    return;
                }

                // 以降、WiFiインタフェースが存在するとする。

                // 現在接続中のWiFi情報を取得する。
                this._currentProfile = this._wifiInterface.GetCurrentProfile();

                // 保存済SSIDが空で、現在接続中WiFi情報が取れていればセットする。
                if (this._currentProfile != null
                    && !string.IsNullOrEmpty(this._currentProfile.Ssid)
                    && string.IsNullOrEmpty(loadedSsid)
                )
                {
                    Xb.App.Job.RunUI(() =>
                    {
                        this.txtSsid.Text = this._currentProfile.Ssid;
                        this.txtPassword.Text = "";
                    });
                }
            });
        }

        private void LoadSettings()
        {
            this.txtSsid.Text = Properties.Settings.Default.Ssid;
            this.txtPassword.Text = Properties.Settings.Default.Password;
        }

        private void SaveSettings()
        {
            Properties.Settings.Default.Ssid = this.txtSsid.Text;
            Properties.Settings.Default.Password = this.txtPassword.Text;
            Properties.Settings.Default.Save();
        }

        private async Task<bool> ExecSettings()
        {
            var ssid = this.txtSsid.Text;
            var password = this.txtPassword.Text;

            var brProf = new BroadlinkProfile();
            var connected = await this._wifiInterface.Connect(brProf);

            if (!connected)
            {
                // BroadlinkProvに接続できなかった。
                // メッセージ表示して終了。
                Xb.App.Job.RunUI(() =>
                {
                    MessageBox.Show(
                        "Broadlink Device NOT Found.\r\nCheck your Device Preparation, and Retry.",
                        "BrDevice Initializer",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning
                    );
                });

                this.RestoreWifi();

                return false;
            }

            var setted = await SharpBroadlink.Broadlink.Setup(
                ssid, 
                password, 
                SharpBroadlink.Broadlink.WifiSecurityMode.WPA12
            );

            if (!setted)
            {
                // デバイスのWiFi設定に失敗した。
                // メッセージ表示して終了。
                Xb.App.Job.RunUI(() =>
                {
                    MessageBox.Show(
                        "Broadlink Device initialize Failure.\r\nCheck your Device Preparation, and Retry.",
                        "BrDevice Initializer",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning
                    );
                });

                this.RestoreWifi();

                return false;
            }

            await this.RestoreWifi();

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
                var restored = await this._wifiInterface.Connect(this._currentProfile);

                if (!restored)
                {
                    // 元の接続に戻せなかった。
                    // メッセージ表示して終了。
                    Xb.App.Job.RunUI(() =>
                    {
                        MessageBox.Show(
                            "WiFi-Restoring Failure, Please set it manually.",
                            "BrDevice Initializer",
                            MessageBoxButtons.OK,
                            MessageBoxIcon.Warning
                        );
                    });
                }

                return restored;
            }
        }
    }
}
