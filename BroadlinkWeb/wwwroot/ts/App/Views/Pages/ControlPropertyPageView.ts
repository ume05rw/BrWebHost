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

    export class ControlPropertyPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public DeleteButton: Controls.ButtonView;
        public InputPanel: Views.StuckerBoxView;
        public TxtName: Views.TextBoxInputView;
        public SboIcon: Views.SelectBoxInputView;
        public SboColor: Views.SelectBoxInputView;
        public TarCode: Views.TextAreaInputView;
        public BtnLearn: Controls.ButtonView;

        constructor() {
            super($(""));

            this.HeaderBar = new Controls.HeaderBarView();
            this.DeleteButton = new Controls.ButtonView();
            this.InputPanel = new Views.StuckerBoxView();
            this.TxtName = new Views.TextBoxInputView();
            this.SboIcon = new Views.SelectBoxInputView();
            this.SboColor = new Views.SelectBoxInputView();
            this.TarCode = new Views.TextAreaInputView();
            this.BtnLearn = new Controls.ButtonView();


            this.SetClassName('ControlPropertyPageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlProperty/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = 'Control';
            this.HeaderBar.LeftButton.Hide(0);
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            this.InputPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.InputPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.InputPanel.Size.Width = 280;
            this.InputPanel.SetAnchor(70, 10, null, 10);
            this.Add(this.InputPanel);

            const lbl1 = new Views.LabelView();
            lbl1.Text = 'Name';
            lbl1.TextAlign = Property.TextAlign.Left;
            lbl1.AutoSize = false;
            lbl1.SetAnchor(null, 5, 15, null);
            lbl1.Size.Height = 21;
            this.InputPanel.Add(lbl1);

            this.TxtName.SetAnchor(null, 5, 15, null);
            this.TxtName.Size.Height = 30;
            this.TxtName.Name = 'Name';
            this.InputPanel.Add(this.TxtName);

            const lbl2 = new Views.LabelView();
            lbl2.Text = 'Icon';
            lbl2.TextAlign = Property.TextAlign.Left;
            lbl2.AutoSize = false;
            lbl2.SetAnchor(null, 5, 15, null);
            lbl2.Size.Height = 21;
            this.InputPanel.Add(lbl2);

            this.SboIcon.SetAnchor(null, 5, 15, null);
            this.SboIcon.Size.Height = 30;
            this.SboIcon.Name = 'Icon';
            this.InputPanel.Add(this.SboIcon);

            const lbl3 = new Views.LabelView();
            lbl3.Text = 'Color';
            lbl3.TextAlign = Property.TextAlign.Left;
            lbl3.AutoSize = false;
            lbl3.SetAnchor(null, 5, 15, null);
            lbl3.Size.Height = 21;
            this.InputPanel.Add(lbl3);

            this.SboColor.SetAnchor(null, 5, 15, null);
            this.SboColor.Size.Height = 30;
            this.SboColor.Name = 'Color';
            this.InputPanel.Add(this.SboColor);

            const lbl4 = new Views.LabelView();
            lbl4.Text = 'Code';
            lbl4.TextAlign = Property.TextAlign.Left;
            lbl4.AutoSize = false;
            lbl4.SetAnchor(null, 5, 15, null);
            lbl4.Size.Height = 21;
            this.InputPanel.Add(lbl4);

            this.TarCode.SetAnchor(null, 5, 15, null);
            this.TarCode.Size.Height = 90;
            this.TarCode.Name = 'Code';
            this.InputPanel.Add(this.TarCode);

            this.BtnLearn.SetAnchor(null, 5, 15, null);
            this.BtnLearn.Size.Height = 30;
            this.BtnLearn.Text = 'Learn Signal';
            this.InputPanel.Add(this.BtnLearn);

            this.DeleteButton.SetAnchor(null, 5, 15, null);
            this.DeleteButton.Size.Height = 30;
            this.DeleteButton.Text = '*Delete*';
            this.InputPanel.Add(this.DeleteButton);
        }
    }
}