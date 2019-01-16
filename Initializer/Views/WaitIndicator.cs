using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Monitor
{
    public partial class WaitIndicator : Form
    {
        public WaitIndicator()
        {
            InitializeComponent();
        }

        private void WaitIndicator_Load(object sender, EventArgs e)
        {
            this.Width = 200;
            this.Height = 200;

            this.pictureBox1.Width = 100;
            this.pictureBox1.Height = 100;
            this.pictureBox1.Left = 41;
            this.pictureBox1.Top = 41;

            //this.pictureBox1.Left = (this.Width - this.pictureBox1.Width) / 2;
            //this.pictureBox1.Top = (this.Height - this.pictureBox1.Height) / 2;
        }
    }
}
