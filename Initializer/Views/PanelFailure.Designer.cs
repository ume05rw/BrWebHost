namespace Initializer.Views
{
    partial class PanelFailure
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
            this.pictureBox4 = new System.Windows.Forms.PictureBox();
            this.txtMessage = new System.Windows.Forms.TextBox();
            this.linkFlatIcon = new System.Windows.Forms.LinkLabel();
            this.linkLicense = new System.Windows.Forms.LinkLabel();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox4)).BeginInit();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.linkLicense);
            this.panel1.Controls.Add(this.linkFlatIcon);
            this.panel1.Controls.Add(this.txtMessage);
            this.panel1.Controls.Add(this.pictureBox4);
            this.panel1.Controls.SetChildIndex(this.lblPanelTitle, 0);
            this.panel1.Controls.SetChildIndex(this.pictureBox4, 0);
            this.panel1.Controls.SetChildIndex(this.txtMessage, 0);
            this.panel1.Controls.SetChildIndex(this.linkFlatIcon, 0);
            this.panel1.Controls.SetChildIndex(this.linkLicense, 0);
            // 
            // lblPanelTitle
            // 
            this.lblPanelTitle.Margin = new System.Windows.Forms.Padding(9, 0, 9, 0);
            this.lblPanelTitle.Size = new System.Drawing.Size(596, 32);
            this.lblPanelTitle.Text = "Setting Failed...";
            // 
            // pictureBox4
            // 
            this.pictureBox4.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pictureBox4.Image = global::Initializer.Properties.Resources.failure;
            this.pictureBox4.Location = new System.Drawing.Point(20, 82);
            this.pictureBox4.Margin = new System.Windows.Forms.Padding(3, 4, 3, 4);
            this.pictureBox4.Name = "pictureBox4";
            this.pictureBox4.Size = new System.Drawing.Size(100, 100);
            this.pictureBox4.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox4.TabIndex = 11;
            this.pictureBox4.TabStop = false;
            // 
            // txtMessage
            // 
            this.txtMessage.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtMessage.BackColor = System.Drawing.Color.White;
            this.txtMessage.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtMessage.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtMessage.Location = new System.Drawing.Point(135, 51);
            this.txtMessage.Margin = new System.Windows.Forms.Padding(3, 4, 3, 4);
            this.txtMessage.Multiline = true;
            this.txtMessage.Name = "txtMessage";
            this.txtMessage.ReadOnly = true;
            this.txtMessage.Size = new System.Drawing.Size(456, 155);
            this.txtMessage.TabIndex = 12;
            // 
            // linkFlatIcon
            // 
            this.linkFlatIcon.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.linkFlatIcon.AutoSize = true;
            this.linkFlatIcon.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.linkFlatIcon.LinkColor = System.Drawing.Color.Gray;
            this.linkFlatIcon.Location = new System.Drawing.Point(203, 214);
            this.linkFlatIcon.Name = "linkFlatIcon";
            this.linkFlatIcon.Size = new System.Drawing.Size(254, 15);
            this.linkFlatIcon.TabIndex = 13;
            this.linkFlatIcon.TabStop = true;
            this.linkFlatIcon.Text = "Icon made by Freepik from www.flaticon.com,";
            this.linkFlatIcon.VisitedLinkColor = System.Drawing.Color.Silver;
            this.linkFlatIcon.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkFlatIcon_LinkClicked);
            // 
            // linkLicense
            // 
            this.linkLicense.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.linkLicense.AutoSize = true;
            this.linkLicense.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.linkLicense.LinkColor = System.Drawing.Color.Gray;
            this.linkLicense.Location = new System.Drawing.Point(455, 214);
            this.linkLicense.Name = "linkLicense";
            this.linkLicense.Size = new System.Drawing.Size(128, 15);
            this.linkLicense.TabIndex = 14;
            this.linkLicense.TabStop = true;
            this.linkLicense.Text = "licensed by  CC 3.0 BY";
            this.linkLicense.VisitedLinkColor = System.Drawing.Color.Silver;
            this.linkLicense.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkLicense_LinkClicked);
            // 
            // PanelFailure
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.Margin = new System.Windows.Forms.Padding(6);
            this.Name = "PanelFailure";
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox4)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBox4;
        private System.Windows.Forms.TextBox txtMessage;
        private System.Windows.Forms.LinkLabel linkFlatIcon;
        private System.Windows.Forms.LinkLabel linkLicense;
    }
}
