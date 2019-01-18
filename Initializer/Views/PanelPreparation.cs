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
    public partial class PanelPreparation : PanelBase
    {
        public PanelPreparation(): base()
        {
            this.InitializeComponent();

            if (LicenseManager.UsageMode != LicenseUsageMode.Designtime)
            {
                this.label1.Font = new System.Drawing.Font(Lang.Instance.FontName, 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                this.label2.Font = new System.Drawing.Font(Lang.Instance.FontName, 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                this.label3.Font = new System.Drawing.Font(Lang.Instance.FontName, 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));

                this.lblPanelTitle.Text = Lang.Instance.DevicePreparation;
                this.label1.Text = Lang.Instance.PreparationStep1;
                this.label2.Text = Lang.Instance.PreparationStep2;
                this.label3.Text = Lang.Instance.PreparationStep3;
            }
        }
    }
}
