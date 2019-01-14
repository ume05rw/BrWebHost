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
        public Main()
        {
            this.InitializeComponent();
        }

#region "Events"

        private void Main_Load(object sender, EventArgs e)
        {
            this.LoadSettings();
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
            var wTest = new WifiTest();
            var wifiInterface = wTest.GetInterface();
            var prof = wTest.GetCurrentProfile(wifiInterface);
            var brProf = new BroadlinkProfile();
            var a = 1;
        }

        #endregion

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
    }
}
