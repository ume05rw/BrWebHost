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
    public partial class PanelExec : PanelBase
    {
        public PanelExec(): base()
        {
            this.InitializeComponent();
        }

        public void SetProgress(int progress)
        {
            Xb.App.Job.RunUI(() =>
            {
                this.progressBar.Value = progress;
                this.Refresh();
            });
        }

        public override void ShowPanel()
        {
            Xb.App.Job.RunUI(() =>
            {
                this.progressBar.Value = 0;
            });
            base.ShowPanel();
        }
    }
}
