using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Initializer.Views
{
    public partial class PanelBase : UserControl
    {
        public PanelBase()
        {
            this.InitializeComponent();
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
                this.Left = 12;
                this.Top = 8;
                this.Width = 600;
                this.Height = 236;
                this.Show();
            });
        }
    }
}
