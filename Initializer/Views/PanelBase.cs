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
    public partial class PanelBase : UserControl
    {
        public PanelBase()
        {
            this.InitializeComponent();

            if (LicenseManager.UsageMode != LicenseUsageMode.Designtime)
            {
                this.panel1.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F);
                this.lblPanelTitle.Font = new System.Drawing.Font(Lang.Instance.FontName, 13.8F);
                this.Font = new System.Drawing.Font(Lang.Instance.FontName, 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            }
        }

        public void SetAlignRight(int right, Control[] controls)
        {
            Xb.App.Job.RunUI(() =>
            {
                foreach (var control in controls)
                    control.Left = right - control.Width;
            });
        }

        public virtual void ShowPanel()
        {
            Xb.App.Job.RunUI(() =>
            {
                var hMargin = 12;
                var vMargin = 8;

                this.Left = hMargin;
                this.Top = vMargin;
                this.Width = 600;
                this.Height = 236;

                this.Show();
            });
        }
    }
}
