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
    public partial class PanelFailure : PanelBase
    {
        public PanelFailure(): base()
        {
            this.InitializeComponent();
        }

        public void SetMessage(string message)
        {
            Xb.App.Job.RunUI(() =>
            {
                this.txtMessage.Text = message;
                this.Refresh();
            });
        }
    }
}
