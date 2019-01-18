namespace Initializer.Views
{
    partial class PanelWifi
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
            this.lblSecurity = new System.Windows.Forms.Label();
            this.cboSecurity = new System.Windows.Forms.ComboBox();
            this.lblSsid = new System.Windows.Forms.Label();
            this.chkPassword = new System.Windows.Forms.CheckBox();
            this.txtSsid = new System.Windows.Forms.TextBox();
            this.txtPassword = new System.Windows.Forms.TextBox();
            this.lblPassword = new System.Windows.Forms.Label();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.lblSecurity);
            this.panel1.Controls.Add(this.cboSecurity);
            this.panel1.Controls.Add(this.lblSsid);
            this.panel1.Controls.Add(this.txtSsid);
            this.panel1.Controls.Add(this.txtPassword);
            this.panel1.Controls.Add(this.lblPassword);
            this.panel1.Controls.Add(this.chkPassword);
            this.panel1.Controls.SetChildIndex(this.chkPassword, 0);
            this.panel1.Controls.SetChildIndex(this.lblPassword, 0);
            this.panel1.Controls.SetChildIndex(this.txtPassword, 0);
            this.panel1.Controls.SetChildIndex(this.txtSsid, 0);
            this.panel1.Controls.SetChildIndex(this.lblSsid, 0);
            this.panel1.Controls.SetChildIndex(this.cboSecurity, 0);
            this.panel1.Controls.SetChildIndex(this.lblSecurity, 0);
            this.panel1.Controls.SetChildIndex(this.lblPanelTitle, 0);
            // 
            // lblPanelTitle
            // 
            this.lblPanelTitle.Margin = new System.Windows.Forms.Padding(9, 0, 9, 0);
            this.lblPanelTitle.Size = new System.Drawing.Size(596, 32);
            this.lblPanelTitle.Text = "Set your Wi-Fi";
            // 
            // lblSecurity
            // 
            this.lblSecurity.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lblSecurity.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSecurity.Location = new System.Drawing.Point(5, 58);
            this.lblSecurity.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblSecurity.Name = "lblSecurity";
            this.lblSecurity.Size = new System.Drawing.Size(119, 24);
            this.lblSecurity.TabIndex = 14;
            this.lblSecurity.Text = "Security";
            this.lblSecurity.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // cboSecurity
            // 
            this.cboSecurity.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.cboSecurity.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboSecurity.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cboSecurity.FormattingEnabled = true;
            this.cboSecurity.Location = new System.Drawing.Point(133, 56);
            this.cboSecurity.Margin = new System.Windows.Forms.Padding(3, 4, 3, 4);
            this.cboSecurity.Name = "cboSecurity";
            this.cboSecurity.Size = new System.Drawing.Size(413, 28);
            this.cboSecurity.TabIndex = 0;
            // 
            // lblSsid
            // 
            this.lblSsid.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lblSsid.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSsid.Location = new System.Drawing.Point(5, 96);
            this.lblSsid.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblSsid.Name = "lblSsid";
            this.lblSsid.Size = new System.Drawing.Size(119, 24);
            this.lblSsid.TabIndex = 9;
            this.lblSsid.Text = "SSID";
            this.lblSsid.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // chkPassword
            // 
            this.chkPassword.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.chkPassword.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.chkPassword.Location = new System.Drawing.Point(133, 164);
            this.chkPassword.Margin = new System.Windows.Forms.Padding(3, 4, 3, 4);
            this.chkPassword.Name = "chkPassword";
            this.chkPassword.Size = new System.Drawing.Size(413, 28);
            this.chkPassword.TabIndex = 3;
            this.chkPassword.TabStop = false;
            this.chkPassword.Text = "Show Password";
            this.chkPassword.UseVisualStyleBackColor = true;
            this.chkPassword.CheckedChanged += new System.EventHandler(this.chkPassword_CheckedChanged);
            // 
            // txtSsid
            // 
            this.txtSsid.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtSsid.BackColor = System.Drawing.Color.LightCyan;
            this.txtSsid.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtSsid.Location = new System.Drawing.Point(133, 95);
            this.txtSsid.Margin = new System.Windows.Forms.Padding(6, 8, 6, 8);
            this.txtSsid.Name = "txtSsid";
            this.txtSsid.Size = new System.Drawing.Size(413, 26);
            this.txtSsid.TabIndex = 1;
            // 
            // txtPassword
            // 
            this.txtPassword.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtPassword.BackColor = System.Drawing.Color.MistyRose;
            this.txtPassword.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtPassword.Location = new System.Drawing.Point(133, 133);
            this.txtPassword.Margin = new System.Windows.Forms.Padding(6, 8, 6, 8);
            this.txtPassword.Name = "txtPassword";
            this.txtPassword.PasswordChar = '*';
            this.txtPassword.Size = new System.Drawing.Size(413, 26);
            this.txtPassword.TabIndex = 2;
            // 
            // lblPassword
            // 
            this.lblPassword.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lblPassword.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPassword.Location = new System.Drawing.Point(5, 134);
            this.lblPassword.Margin = new System.Windows.Forms.Padding(6, 0, 6, 0);
            this.lblPassword.Name = "lblPassword";
            this.lblPassword.Size = new System.Drawing.Size(119, 24);
            this.lblPassword.TabIndex = 12;
            this.lblPassword.Text = "Password";
            this.lblPassword.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // PanelWifi
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.Margin = new System.Windows.Forms.Padding(6);
            this.Name = "PanelWifi";
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        public System.Windows.Forms.Label lblSecurity;
        public System.Windows.Forms.ComboBox cboSecurity;
        public System.Windows.Forms.Label lblSsid;
        public System.Windows.Forms.CheckBox chkPassword;
        public System.Windows.Forms.TextBox txtSsid;
        public System.Windows.Forms.TextBox txtPassword;
        public System.Windows.Forms.Label lblPassword;
    }
}
