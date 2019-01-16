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
            this.panel1.Controls.Add(this.chkPassword);
            this.panel1.Controls.Add(this.txtSsid);
            this.panel1.Controls.Add(this.txtPassword);
            this.panel1.Controls.Add(this.lblPassword);
            this.panel1.Controls.SetChildIndex(this.lblPanelTitle, 0);
            this.panel1.Controls.SetChildIndex(this.lblPassword, 0);
            this.panel1.Controls.SetChildIndex(this.txtPassword, 0);
            this.panel1.Controls.SetChildIndex(this.txtSsid, 0);
            this.panel1.Controls.SetChildIndex(this.chkPassword, 0);
            this.panel1.Controls.SetChildIndex(this.lblSsid, 0);
            this.panel1.Controls.SetChildIndex(this.cboSecurity, 0);
            this.panel1.Controls.SetChildIndex(this.lblSecurity, 0);
            // 
            // lblPanelTitle
            // 
            this.lblPanelTitle.Text = "Set your Wi-Fi";
            // 
            // lblSecurity
            // 
            this.lblSecurity.AutoSize = true;
            this.lblSecurity.Location = new System.Drawing.Point(22, 55);
            this.lblSecurity.Margin = new System.Windows.Forms.Padding(5, 0, 5, 0);
            this.lblSecurity.Name = "lblSecurity";
            this.lblSecurity.Size = new System.Drawing.Size(79, 25);
            this.lblSecurity.TabIndex = 14;
            this.lblSecurity.Text = "Security";
            // 
            // cboSecurity
            // 
            this.cboSecurity.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboSecurity.FormattingEnabled = true;
            this.cboSecurity.Location = new System.Drawing.Point(109, 52);
            this.cboSecurity.Name = "cboSecurity";
            this.cboSecurity.Size = new System.Drawing.Size(469, 33);
            this.cboSecurity.TabIndex = 0;
            // 
            // lblSsid
            // 
            this.lblSsid.AutoSize = true;
            this.lblSsid.Location = new System.Drawing.Point(51, 97);
            this.lblSsid.Margin = new System.Windows.Forms.Padding(5, 0, 5, 0);
            this.lblSsid.Name = "lblSsid";
            this.lblSsid.Size = new System.Drawing.Size(50, 25);
            this.lblSsid.TabIndex = 9;
            this.lblSsid.Text = "SSID";
            // 
            // chkPassword
            // 
            this.chkPassword.AutoSize = true;
            this.chkPassword.Location = new System.Drawing.Point(109, 174);
            this.chkPassword.Name = "chkPassword";
            this.chkPassword.Size = new System.Drawing.Size(162, 29);
            this.chkPassword.TabIndex = 3;
            this.chkPassword.TabStop = false;
            this.chkPassword.Text = "Show Password";
            this.chkPassword.UseVisualStyleBackColor = true;
            this.chkPassword.CheckedChanged += new System.EventHandler(this.chkPassword_CheckedChanged);
            // 
            // txtSsid
            // 
            this.txtSsid.BackColor = System.Drawing.Color.LightCyan;
            this.txtSsid.Location = new System.Drawing.Point(109, 94);
            this.txtSsid.Margin = new System.Windows.Forms.Padding(5, 6, 5, 6);
            this.txtSsid.Name = "txtSsid";
            this.txtSsid.Size = new System.Drawing.Size(469, 32);
            this.txtSsid.TabIndex = 1;
            // 
            // txtPassword
            // 
            this.txtPassword.BackColor = System.Drawing.Color.MistyRose;
            this.txtPassword.Location = new System.Drawing.Point(109, 138);
            this.txtPassword.Margin = new System.Windows.Forms.Padding(5, 6, 5, 6);
            this.txtPassword.Name = "txtPassword";
            this.txtPassword.PasswordChar = '*';
            this.txtPassword.Size = new System.Drawing.Size(469, 32);
            this.txtPassword.TabIndex = 2;
            // 
            // lblPassword
            // 
            this.lblPassword.AutoSize = true;
            this.lblPassword.Location = new System.Drawing.Point(9, 141);
            this.lblPassword.Margin = new System.Windows.Forms.Padding(5, 0, 5, 0);
            this.lblPassword.Name = "lblPassword";
            this.lblPassword.Size = new System.Drawing.Size(92, 25);
            this.lblPassword.TabIndex = 12;
            this.lblPassword.Text = "Password";
            // 
            // PanelWifi
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(10F, 19F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
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
