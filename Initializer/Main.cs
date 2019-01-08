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

        private void Main_FormClosing(object sender, FormClosingEventArgs e)
        {
            this.SaveSettings();
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
    }
}
