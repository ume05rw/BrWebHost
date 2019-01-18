using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Initializer.Models.Langs;

namespace Initializer.Views
{
    public partial class PanelSucceeded : PanelBase
    {
        public PanelSucceeded(): base()
        {
            this.InitializeComponent();

            if (LicenseManager.UsageMode != LicenseUsageMode.Designtime)
            {
                this.txtMessage.Font = new System.Drawing.Font(Lang.Instance.FontName, 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                this.linkLicense.Font = new System.Drawing.Font(Lang.Instance.FontName, 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
                this.linkFlatIcon.Font = new System.Drawing.Font(Lang.Instance.FontName, 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));

                this.lblPanelTitle.Text = Lang.Instance.SettingSucceeded;
            }
        }

        public void SetMessage(string message)
        {
            Xb.App.Job.RunUI(() =>
            {
                this.txtMessage.Text = message;
                this.Refresh();
            });
        }

        private void linkFlatIcon_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            var url = "https://www.freepik.com/";
            System.Diagnostics.Process.Start(url);
        }

        private void linkLicense_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            var url = "http://creativecommons.org/licenses/by/3.0/";
            System.Diagnostics.Process.Start(url);
        }
    }
}
