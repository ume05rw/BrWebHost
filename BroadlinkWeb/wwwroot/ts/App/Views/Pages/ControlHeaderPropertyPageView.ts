/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />


namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Controls = App.Views.Controls;

    export class ControlHeaderPropertyPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public InputPanel: Views.StuckerBoxView;
        public TxtName: Views.TextBoxInputView;
        public LabelColor: Views.LabelView;
        public BtnColor: Controls.ItemSelectButtonView;
        public LabelRm: Views.LabelView;
        public SboRm: Views.SelectBoxInputView;
        public DeleteButton: Controls.PropertyButtonView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.InputPanel = new Views.StuckerBoxView();
            this.TxtName = new Views.TextBoxInputView();
            this.LabelColor = new Views.LabelView();
            this.BtnColor = new Controls.ItemSelectButtonView();
            this.LabelRm = new Views.LabelView();
            this.SboRm = new Views.SelectBoxInputView();
            this.DeleteButton = new Controls.PropertyButtonView();

            this.SetClassName('ControlHeaderPropertyPageView');

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
            label.Color = App.Items.Color.Main;
            label.SetAnchor(null, 5, null, null);
            label.Text = 'Remote Control';
            this.HeaderBar.Add(label);

            this.InputPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.InputPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.InputPanel.Size.Width = 280;
            this.InputPanel.SetAnchor(70, 10, null, 10);
            this.InputPanel.Color = App.Items.Color.MainBackground;
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


            this.LabelColor = new Views.LabelView();
            this.LabelColor.Text = 'Color';
            this.LabelColor.TextAlign = Property.TextAlign.Left;
            this.LabelColor.AutoSize = true;
            this.LabelColor.SetAnchor(null, 5, null, null);
            this.LabelColor.Size.Height = 21;
            this.InputPanel.Add(this.LabelColor);
            this.InputPanel.AddSpacer();

            this.InputPanel.Add(this.BtnColor);
            this.InputPanel.AddSpacer();

            this.LabelRm = new Views.LabelView();
            this.LabelRm.Text = 'Target';
            this.LabelRm.TextAlign = Property.TextAlign.Left;
            this.LabelRm.AutoSize = true;
            this.LabelRm.SetAnchor(null, 5, null, null);
            this.LabelRm.Size.Height = 21;
            this.InputPanel.Add(this.LabelRm);

            this.SboRm.SetAnchor(null, 5, 15, null);
            this.SboRm.Size.Height = 30;
            this.SboRm.Name = 'Rm';
            _.each(App.Items.Icon.Names, (iconName) => {
                const dispName = iconName.substr(0, iconName.indexOf('.')).replace('_', ' ');
                this.SboRm.AddItem(dispName, `images/icons/${iconName}`);
            });
            this.InputPanel.Add(this.SboRm);

            this.DeleteButton.SetAnchor(null, 5, 15, null);
            this.DeleteButton.Size.Height = 30;
            this.DeleteButton.Text = '*Delete*';
            this.InputPanel.Add(this.DeleteButton);
        }
    }
}
