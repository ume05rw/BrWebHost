using Initializer.Models.Langs;

namespace Initializer.Views
{
    partial class PanelExec
    {
        /// <summary> 
        /// 必要なデザイナー変数です。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// 使用中のリソースをすべてクリーンアップします。
        /// </summary>
        /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region コンポーネント デザイナーで生成されたコード

        /// <summary> 
        /// デザイナー サポートに必要なメソッドです。このメソッドの内容を 
        /// コード エディターで変更しないでください。
        /// </summary>
        private void InitializeComponent()
        {
            this.progressBar = new System.Windows.Forms.ProgressBar();
            this.pctWait = new System.Windows.Forms.PictureBox();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pctWait)).BeginInit();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.progressBar);
            this.panel1.Controls.Add(this.pctWait);
            this.panel1.Controls.SetChildIndex(this.lblPanelTitle, 0);
            this.panel1.Controls.SetChildIndex(this.pctWait, 0);
            this.panel1.Controls.SetChildIndex(this.progressBar, 0);
            // 
            // lblPanelTitle
            // 
            this.lblPanelTitle.Text = "Now Setting...";
            // 
            // progressBar
            // 
            this.progressBar.Location = new System.Drawing.Point(75, 171);
            this.progressBar.Name = "progressBar";
            this.progressBar.Size = new System.Drawing.Size(450, 17);
            this.progressBar.TabIndex = 13;
            // 
            // pctWait
            // 
            this.pctWait.Image = global::Initializer.Properties.Resources.indicator;
            this.pctWait.Location = new System.Drawing.Point(250, 45);
            this.pctWait.Name = "pctWait";
            this.pctWait.Size = new System.Drawing.Size(100, 100);
            this.pctWait.TabIndex = 12;
            this.pctWait.TabStop = false;
            // 
            // PanelExec
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(10F, 19F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Name = "PanelExec";
            this.panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.pctWait)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ProgressBar progressBar;
        private System.Windows.Forms.PictureBox pctWait;
    }
}
