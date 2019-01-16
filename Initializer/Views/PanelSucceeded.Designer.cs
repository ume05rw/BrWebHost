namespace Initializer.Views
{
    partial class PanelSucceeded
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
            this.txtMessage = new System.Windows.Forms.TextBox();
            this.pictureBox4 = new System.Windows.Forms.PictureBox();
            this.linkLicense = new System.Windows.Forms.LinkLabel();
            this.linkFlatIcon = new System.Windows.Forms.LinkLabel();
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
            this.lblPanelTitle.Text = "Setting Succeeded!";
            // 
            // txtMessage
            // 
            this.txtMessage.BackColor = System.Drawing.Color.White;
            this.txtMessage.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtMessage.Location = new System.Drawing.Point(169, 43);
            this.txtMessage.Multiline = true;
            this.txtMessage.Name = "txtMessage";
            this.txtMessage.ReadOnly = true;
            this.txtMessage.Size = new System.Drawing.Size(412, 155);
            this.txtMessage.TabIndex = 14;
            // 
            // pictureBox4
            // 
            this.pictureBox4.Image = global::Initializer.Properties.Resources.succeeded;
            this.pictureBox4.Location = new System.Drawing.Point(40, 79);
            this.pictureBox4.Name = "pictureBox4";
            this.pictureBox4.Size = new System.Drawing.Size(100, 100);
            this.pictureBox4.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox4.TabIndex = 13;
            this.pictureBox4.TabStop = false;
            // 
            // linkLicense
            // 
            this.linkLicense.AutoSize = true;
            this.linkLicense.Font = new System.Drawing.Font("Yu Gothic UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.linkLicense.LinkColor = System.Drawing.Color.Gray;
            this.linkLicense.Location = new System.Drawing.Point(460, 207);
            this.linkLicense.Name = "linkLicense";
            this.linkLicense.Size = new System.Drawing.Size(121, 15);
            this.linkLicense.TabIndex = 16;
            this.linkLicense.TabStop = true;
            this.linkLicense.Text = "licensed by  CC 3.0 BY";
            this.linkLicense.VisitedLinkColor = System.Drawing.Color.Silver;
            this.linkLicense.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkLicense_LinkClicked);
            // 
            // linkFlatIcon
            // 
            this.linkFlatIcon.AutoSize = true;
            this.linkFlatIcon.Font = new System.Drawing.Font("Yu Gothic UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.linkFlatIcon.LinkColor = System.Drawing.Color.Gray;
            this.linkFlatIcon.Location = new System.Drawing.Point(216, 207);
            this.linkFlatIcon.Name = "linkFlatIcon";
            this.linkFlatIcon.Size = new System.Drawing.Size(247, 15);
            this.linkFlatIcon.TabIndex = 15;
            this.linkFlatIcon.TabStop = true;
            this.linkFlatIcon.Text = "Icon made by Freepik from www.flaticon.com,";
            this.linkFlatIcon.VisitedLinkColor = System.Drawing.Color.Silver;
            this.linkFlatIcon.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkFlatIcon_LinkClicked);
            // 
            // PanelSucceeded
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(10F, 19F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Name = "PanelSucceeded";
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox4)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TextBox txtMessage;
        private System.Windows.Forms.PictureBox pictureBox4;
        private System.Windows.Forms.LinkLabel linkLicense;
        private System.Windows.Forms.LinkLabel linkFlatIcon;
    }
}
