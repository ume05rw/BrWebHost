/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />

namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Controls = App.Views.Controls;
    import Color = App.Items.Color;
    import Lang = App.Items.Lang.Lang;

    export class ControlPropertyPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public InputPanel: Views.StuckerBoxView;
        public TxtName: Views.TextBoxInputView;
        public BtnIcon: Controls.ItemSelectButtonView;
        public BtnColor: Controls.ItemSelectButtonView;
        public LblCode: Views.LabelView;
        public TarCode: Views.TextAreaInputView;
        public TxtMac: Views.TextBoxInputView;
        public SboRemote: Views.SelectBoxInputView;
        public BtnLearn: Controls.PropertyButtonView;
        public BtnSend: Controls.PropertyButtonView;
        public ChkToggleOn: Views.CheckBoxInputView;
        public ChkToggleOff: Views.CheckBoxInputView;
        public DeleteButton: Controls.PropertyButtonView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.InputPanel = new Views.StuckerBoxView();
            this.TxtName = new Views.TextBoxInputView();
            this.BtnIcon = new Controls.ItemSelectButtonView();
            this.BtnColor = new Controls.ItemSelectButtonView();
            this.LblCode = new Views.LabelView();
            this.TarCode = new Views.TextAreaInputView();
            this.TxtMac = new Views.TextBoxInputView();
            this.SboRemote = new Views.SelectBoxInputView();
            this.BtnLearn = new Controls.PropertyButtonView();
            this.BtnSend = new Controls.PropertyButtonView();
            this.ChkToggleOn = new Views.CheckBoxInputView();
            this.ChkToggleOff = new Views.CheckBoxInputView();
            this.DeleteButton = new Controls.PropertyButtonView();

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
            label.Text = Lang.Property;
            this.HeaderBar.Add(label);

            this.InputPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.InputPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.InputPanel.Size.Width = 280;
            this.InputPanel.SetAnchor(70, 10, null, 10);
            this.InputPanel.Color = Color.MainBackground;
            this.InputPanel.IsChildRelocatable = false;
            this.Add(this.InputPanel);

            const lbl1 = new Views.LabelView();
            lbl1.Text = Lang.Name;
            lbl1.TextAlign = Property.TextAlign.Left;
            lbl1.AutoSize = true;
            lbl1.SetAnchor(null, 5, null, null);
            lbl1.Size.Height = 21;
            this.InputPanel.Add(lbl1);

            this.TxtName.SetAnchor(null, 5, 15, null);
            this.TxtName.Size.Height = 30;
            this.InputPanel.Add(this.TxtName);

            const lbl2 = new Views.LabelView();
            lbl2.Text = Lang.IconColor;
            lbl2.TextAlign = Property.TextAlign.Left;
            lbl2.AutoSize = true;
            lbl2.SetAnchor(null, 5, null, null);
            lbl2.Size.Height = 21;
            this.InputPanel.Add(lbl2);
            this.InputPanel.AddSpacer();

            this.InputPanel.Add(this.BtnIcon);
            this.InputPanel.Add(this.BtnColor);
            this.InputPanel.AddSpacer();

            this.LblCode = new Views.LabelView();
            this.LblCode.Text = Lang.Code;
            this.LblCode.TextAlign = Property.TextAlign.Left;
            this.LblCode.AutoSize = true;
            this.LblCode.SetAnchor(null, 5, null, null);
            this.LblCode.Size.Height = 21;
            this.InputPanel.Add(this.LblCode);

            this.TarCode.SetAnchor(null, 5, 15, null);
            this.TarCode.Size.Height = 90;
            this.InputPanel.Add(this.TarCode);

            this.TxtMac.SetAnchor(null, 5, 15, null);
            this.TxtMac.Size.Height = 30;
            this.InputPanel.Add(this.TxtMac);

            this.SboRemote.SetAnchor(null, 5, 15, null);
            this.SboRemote.Size.Height = 30;
            this.InputPanel.Add(this.SboRemote);

            this.BtnLearn.SetAnchor(null, 5, 15, null);
            this.BtnLearn.Size.Height = 30;
            this.BtnLearn.Text = Lang.Learn;
            this.InputPanel.Add(this.BtnLearn);

            this.BtnSend.SetAnchor(null, 5, 15, null);
            this.BtnSend.Size.Height = 30;
            this.BtnSend.Text = Lang.Test;
            this.InputPanel.Add(this.BtnSend);

            const lbl5 = new Views.LabelView();
            lbl5.Text = Lang.ToggleAssigns;
            lbl5.TextAlign = Property.TextAlign.Left;
            lbl5.AutoSize = true;
            lbl5.SetAnchor(null, 5, null, null);
            lbl5.Size.Height = 21;
            this.InputPanel.Add(lbl5);

            this.ChkToggleOn.SetAnchor(null, 5, 15, null);
            this.ChkToggleOn.Size.Height = 30;
            this.ChkToggleOn.Text = Lang.MainPanelToggleOn;
            this.InputPanel.Add(this.ChkToggleOn);

            this.ChkToggleOff.SetAnchor(null, 5, 15, null);
            this.ChkToggleOff.Size.Height = 30;
            this.ChkToggleOff.Text = Lang.MainPanelToggleOff;
            this.InputPanel.Add(this.ChkToggleOff);

            this.DeleteButton.SetAnchor(null, 5, 15, null);
            this.DeleteButton.Size.Height = 30;
            this.DeleteButton.Text = Lang.Delete;
            this.InputPanel.Add(this.DeleteButton);
        }
    }
}
