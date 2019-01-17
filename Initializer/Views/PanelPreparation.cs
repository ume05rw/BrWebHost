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

            this.lblPanelTitle.Text = Lang.Instance.DevicePreparation;
            this.label1.Text = Lang.Instance.PreparationStep1;
            this.label2.Text = Lang.Instance.PreparationStep2;
            this.label3.Text = Lang.Instance.PreparationStep3;
        }
    }
}
