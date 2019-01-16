namespace Initializer
{
    partial class Main
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

        #region Windows フォーム デザイナーで生成されたコード

        /// <summary>
        /// デザイナー サポートに必要なメソッドです。このメソッドの内容を
        /// コード エディターで変更しないでください。
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Main));
            this.btnNext = new System.Windows.Forms.Button();
            this.btnPrev = new System.Windows.Forms.Button();
            this.btnExec = new System.Windows.Forms.Button();
            this.pnlWifi = new Initializer.Views.PanelWifi();
            this.pnlPreparation = new Initializer.Views.PanelPreparation();
            this.pnlExec = new Initializer.Views.PanelExec();
            this.pnlSucceeded = new Initializer.Views.PanelSucceeded();
            this.pnlFailure = new Initializer.Views.PanelFailure();
            this.btnClose = new System.Windows.Forms.Button();
            this.btnRetry = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnNext
            // 
            this.btnNext.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnNext.Location = new System.Drawing.Point(511, 253);
            this.btnNext.Name = "btnNext";
            this.btnNext.Size = new System.Drawing.Size(101, 34);
            this.btnNext.TabIndex = 6;
            this.btnNext.Text = "Next >>";
            this.btnNext.UseVisualStyleBackColor = true;
            this.btnNext.Click += new System.EventHandler(this.btnNext_Click);
            // 
            // btnPrev
            // 
            this.btnPrev.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnPrev.Location = new System.Drawing.Point(12, 253);
            this.btnPrev.Name = "btnPrev";
            this.btnPrev.Size = new System.Drawing.Size(101, 34);
            this.btnPrev.TabIndex = 15;
            this.btnPrev.Text = "<< Prev";
            this.btnPrev.UseVisualStyleBackColor = true;
            // 
            // btnExec
            // 
            this.btnExec.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnExec.Location = new System.Drawing.Point(295, 253);
            this.btnExec.Name = "btnExec";
            this.btnExec.Size = new System.Drawing.Size(101, 34);
            this.btnExec.TabIndex = 17;
            this.btnExec.Text = "Exec";
            this.btnExec.UseVisualStyleBackColor = true;
            this.btnExec.Click += new System.EventHandler(this.btnExec_Click);
            // 
            // pnlWifi
            // 
            this.pnlWifi.BackColor = System.Drawing.Color.Transparent;
            this.pnlWifi.Font = new System.Drawing.Font("MS UI Gothic", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.pnlWifi.Location = new System.Drawing.Point(12, 321);
            this.pnlWifi.Margin = new System.Windows.Forms.Padding(5);
            this.pnlWifi.Name = "pnlWifi";
            this.pnlWifi.Size = new System.Drawing.Size(118, 104);
            this.pnlWifi.TabIndex = 18;
            // 
            // pnlPreparation
            // 
            this.pnlPreparation.BackColor = System.Drawing.Color.Transparent;
            this.pnlPreparation.Font = new System.Drawing.Font("MS UI Gothic", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.pnlPreparation.Location = new System.Drawing.Point(131, 321);
            this.pnlPreparation.Margin = new System.Windows.Forms.Padding(5);
            this.pnlPreparation.Name = "pnlPreparation";
            this.pnlPreparation.Size = new System.Drawing.Size(118, 104);
            this.pnlPreparation.TabIndex = 19;
            // 
            // pnlExec
            // 
            this.pnlExec.BackColor = System.Drawing.Color.Transparent;
            this.pnlExec.Font = new System.Drawing.Font("MS UI Gothic", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.pnlExec.Location = new System.Drawing.Point(250, 321);
            this.pnlExec.Margin = new System.Windows.Forms.Padding(5);
            this.pnlExec.Name = "pnlExec";
            this.pnlExec.Size = new System.Drawing.Size(118, 104);
            this.pnlExec.TabIndex = 20;
            // 
            // pnlSucceeded
            // 
            this.pnlSucceeded.BackColor = System.Drawing.Color.Transparent;
            this.pnlSucceeded.Font = new System.Drawing.Font("MS UI Gothic", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.pnlSucceeded.Location = new System.Drawing.Point(369, 321);
            this.pnlSucceeded.Margin = new System.Windows.Forms.Padding(5);
            this.pnlSucceeded.Name = "pnlSucceeded";
            this.pnlSucceeded.Size = new System.Drawing.Size(118, 104);
            this.pnlSucceeded.TabIndex = 21;
            // 
            // pnlFailure
            // 
            this.pnlFailure.BackColor = System.Drawing.Color.Transparent;
            this.pnlFailure.Font = new System.Drawing.Font("MS UI Gothic", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.pnlFailure.Location = new System.Drawing.Point(488, 321);
            this.pnlFailure.Margin = new System.Windows.Forms.Padding(5);
            this.pnlFailure.Name = "pnlFailure";
            this.pnlFailure.Size = new System.Drawing.Size(118, 104);
            this.pnlFailure.TabIndex = 22;
            // 
            // btnClose
            // 
            this.btnClose.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnClose.Location = new System.Drawing.Point(402, 253);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(101, 34);
            this.btnClose.TabIndex = 23;
            this.btnClose.Text = "Close";
            this.btnClose.UseVisualStyleBackColor = true;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // btnRetry
            // 
            this.btnRetry.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.btnRetry.Location = new System.Drawing.Point(122, 253);
            this.btnRetry.Name = "btnRetry";
            this.btnRetry.Size = new System.Drawing.Size(101, 34);
            this.btnRetry.TabIndex = 24;
            this.btnRetry.Text = "Retry";
            this.btnRetry.UseVisualStyleBackColor = true;
            this.btnRetry.Click += new System.EventHandler(this.btnRetry_Click);
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(10F, 25F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(624, 462);
            this.Controls.Add(this.btnRetry);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.pnlFailure);
            this.Controls.Add(this.pnlSucceeded);
            this.Controls.Add(this.pnlExec);
            this.Controls.Add(this.pnlPreparation);
            this.Controls.Add(this.pnlWifi);
            this.Controls.Add(this.btnExec);
            this.Controls.Add(this.btnPrev);
            this.Controls.Add(this.btnNext);
            this.Font = new System.Drawing.Font("Yu Gothic UI", 13.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(5, 6, 5, 6);
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(640, 1400);
            this.MinimizeBox = false;
            this.MinimumSize = new System.Drawing.Size(640, 307);
            this.Name = "Main";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Br-Device Initializer";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Main_FormClosing);
            this.Load += new System.EventHandler(this.Main_Load);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Button btnNext;
        private System.Windows.Forms.Button btnPrev;
        private System.Windows.Forms.Button btnExec;
        private Views.PanelWifi pnlWifi;
        private Views.PanelPreparation pnlPreparation;
        private Views.PanelExec pnlExec;
        private Views.PanelSucceeded pnlSucceeded;
        private Views.PanelFailure pnlFailure;
        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Button btnRetry;
    }
}

