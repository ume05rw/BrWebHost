using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Initializer.Models;
using SharpBroadlink;

namespace Initializer.Views
{
    public partial class PanelWifi : PanelBase
    {
        public PanelWifi() : base()
        {
            this.InitializeComponent();
            this.Init();
        }

        #region "Events"

        private void chkPassword_CheckedChanged(object sender, EventArgs e)
        {
            this.SetPasswordVisible();
        }

        #endregion


        private void Init()
        {
            this.InitCboSecurity();
            this.SetPasswordVisible();

            var settings = new Settings();

            if (settings.Exists)
            {
                this.SetSettings(settings);
                this.txtPassword.Focus();
            }
            else
            {
                this.cboSecurity.Focus();
            }
        }

        private void InitCboSecurity()
        {
            //this.cboSecurity.Items
            var dt = new DataTable();
            dt.Columns.Add("Id", typeof(Broadlink.WifiSecurityMode));
            dt.Columns.Add("Name", typeof(string));
            dt.Rows.Add(new object[]
            {
                Broadlink.WifiSecurityMode.None,
                "None"
            });
            dt.Rows.Add(new object[]
            {
                Broadlink.WifiSecurityMode.Wep,
                "Wep"
            });
            dt.Rows.Add(new object[]
            {
                Broadlink.WifiSecurityMode.WPA1,
                "WPA1"
            });
            dt.Rows.Add(new object[]
            {
                Broadlink.WifiSecurityMode.WPA2,
                "WPA2"
            });
            dt.Rows.Add(new object[]
            {
                Broadlink.WifiSecurityMode.WPA12,
                "WPA12"
            });

            this.cboSecurity.ValueMember = "Id";
            this.cboSecurity.DisplayMember = "Name";
            this.cboSecurity.DataSource = dt;
            this.cboSecurity.SelectedValue = Broadlink.WifiSecurityMode.None;
        }

        public void SetSettings(Settings settings)
        {
            Xb.App.Job.RunUI(() =>
            {
                this.txtSsid.Text = settings.Ssid;
                this.txtPassword.Text = settings.Password;
                this.cboSecurity.SelectedValue = settings.Security;
            });
        }

        private void SetPasswordVisible()
        {
            Xb.App.Job.RunUI(() =>
            {
                this.txtPassword.PasswordChar = (this.chkPassword.Checked)
                    ? '\0'
                    : '*';
            });
        }

        public void SetProfile(Profile profile)
        {
            Xb.App.Job.RunUI(() =>
            {
                this.cboSecurity.SelectedValue = profile.SecurityType;
                this.txtSsid.Text = profile.Ssid;
                this.txtPassword.Text = "";
                this.txtPassword.Focus();
            });
        }

        public Settings GetSettings()
        {
            Settings result = null;

            Xb.App.Job.RunUISynced(() =>
            {
                result = new Settings(
                    (Broadlink.WifiSecurityMode)this.cboSecurity.SelectedValue,
                    this.txtSsid.Text,
                    this.txtPassword.Text
                );
            });

            return result;
        }
    }
}
