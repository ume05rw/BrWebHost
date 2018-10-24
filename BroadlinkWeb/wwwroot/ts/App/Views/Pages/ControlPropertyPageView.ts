/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Controls = App.Views.Controls;
    import Color = App.Items.Color;

    export class ControlPropertyPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public InputPanel: Views.StuckerBoxView;
        public TxtName: Views.TextBoxInputView;
        public BtnIcon: Controls.ItemSelectButtonView;
        public BtnColor: Controls.ItemSelectButtonView;
        public TarCode: Views.TextAreaInputView;
        public BtnLearn: Controls.ButtonView;
        public BtnSend: Controls.ButtonView;
        public ChkToggleOn: Views.CheckBoxInputView;
        public ChkToggleOff: Views.CheckBoxInputView;
        public DeleteButton: Controls.ButtonView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.InputPanel = new Views.StuckerBoxView();
            this.TxtName = new Views.TextBoxInputView();
            this.BtnIcon = new Controls.ItemSelectButtonView();
            this.BtnColor = new Controls.ItemSelectButtonView();
            this.TarCode = new Views.TextAreaInputView();
            this.BtnLearn = new Controls.ButtonView();
            this.BtnSend = new Controls.ButtonView();
            this.ChkToggleOn = new Views.CheckBoxInputView();
            this.ChkToggleOff = new Views.CheckBoxInputView();
            this.DeleteButton = new Controls.ButtonView();

            this.SetClassName('ControlPropertyPageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlProperty/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = '';
            this.HeaderBar.LeftButton.Hide(0);
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            const label = new Views.LabelView();
            label.FontSize = Property.FontSize.Large;
            label.Color = Color.Main;
            label.SetAnchor(null, 5, null, null);
            label.Text = 'Property';
            this.HeaderBar.Add(label);

            this.InputPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.InputPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.InputPanel.Size.Width = 280;
            this.InputPanel.SetAnchor(70, 10, null, 10);
            this.InputPanel.Color = Color.MainBackground;
            this.Add(this.InputPanel);

            const lbl1 = new Views.LabelView();
            lbl1.Text = 'Name';
            lbl1.TextAlign = Property.TextAlign.Left;
            lbl1.AutoSize = true;
            lbl1.SetAnchor(null, 5, null, null);
            lbl1.Size.Height = 21;
            this.InputPanel.Add(lbl1);

            this.TxtName.SetAnchor(null, 5, 15, null);
            this.TxtName.Size.Height = 30;
            this.TxtName.Name = 'Name';
            this.InputPanel.Add(this.TxtName);

            const lbl2 = new Views.LabelView();
            lbl2.Text = 'Icon / Color';
            lbl2.TextAlign = Property.TextAlign.Left;
            lbl2.AutoSize = true;
            lbl2.SetAnchor(null, 5, null, null);
            lbl2.Size.Height = 21;
            this.InputPanel.Add(lbl2);
            this.InputPanel.AddSpacer();

            this.InputPanel.Add(this.BtnIcon);
            this.InputPanel.Add(this.BtnColor);
            this.InputPanel.AddSpacer();

            const lbl4 = new Views.LabelView();
            lbl4.Text = 'Code';
            lbl4.TextAlign = Property.TextAlign.Left;
            lbl4.AutoSize = true;
            lbl4.SetAnchor(null, 5, null, null);
            lbl4.Size.Height = 21;
            this.InputPanel.Add(lbl4);

            this.TarCode.SetAnchor(null, 5, 15, null);
            this.TarCode.Size.Height = 90;
            this.TarCode.Name = 'Code';
            this.InputPanel.Add(this.TarCode);

            this.BtnLearn.SetAnchor(null, 5, 15, null);
            this.BtnLearn.Size.Height = 30;
            this.BtnLearn.Text = 'Learn Code';
            this.InputPanel.Add(this.BtnLearn);

            this.BtnSend.SetAnchor(null, 5, 15, null);
            this.BtnSend.Size.Height = 30;
            this.BtnSend.Text = 'Test Code';
            this.InputPanel.Add(this.BtnSend);

            const lbl5 = new Views.LabelView();
            lbl5.Text = 'Toggle Assigns';
            lbl5.TextAlign = Property.TextAlign.Left;
            lbl5.AutoSize = true;
            lbl5.SetAnchor(null, 5, null, null);
            lbl5.Size.Height = 21;
            this.InputPanel.Add(lbl5);

            this.ChkToggleOn.SetAnchor(null, 5, 15, null);
            this.ChkToggleOn.Size.Height = 30;
            this.ChkToggleOn.Name = 'AssignToggleOn';
            this.ChkToggleOn.Text = 'Main-Panel Toggle ON';
            this.InputPanel.Add(this.ChkToggleOn);

            this.ChkToggleOff.SetAnchor(null, 5, 15, null);
            this.ChkToggleOff.Size.Height = 30;
            this.ChkToggleOff.Name = 'AssignToggleOff';
            this.ChkToggleOff.Text = 'Main-Panel Toggle OFF';
            this.InputPanel.Add(this.ChkToggleOff);

            this.DeleteButton.SetAnchor(null, 5, 15, null);
            this.DeleteButton.Size.Height = 30;
            this.DeleteButton.Text = '*Delete*';
            this.InputPanel.Add(this.DeleteButton);
        }
    }
}
