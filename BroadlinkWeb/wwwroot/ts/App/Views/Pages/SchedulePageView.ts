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

    export class SchedulePageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public EditButton: Controls.ButtonView;
        public HeaderLeftLabel: Views.LabelView;
        public InputPanel: Views.StuckerBoxView;
        public TxtName: Views.TextBoxInputView;
        public BtnColor: Controls.ItemSelectButtonView;
        public ChkEnabled: Views.CheckBoxInputView;
        public ChkWeekdaySunday: Views.CheckBoxInputView;
        public ChkWeekdayMonday: Views.CheckBoxInputView;
        public ChkWeekdayTuesday: Views.CheckBoxInputView;
        public ChkWeekdayWednesday: Views.CheckBoxInputView;
        public ChkWeekdayThursday: Views.CheckBoxInputView;
        public ChkWeekdayFriday: Views.CheckBoxInputView;
        public ChkWeekdaySaturday: Views.CheckBoxInputView;
        public SboHour: Views.SelectBoxInputView;
        public SboMinute: Views.SelectBoxInputView;
        public SdvControl: Controls.SceneDetailView;
        public DeleteButton: Controls.PropertyButtonView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.HeaderLeftLabel = new Views.LabelView();
            this.EditButton = new Controls.ButtonView();

            this.InputPanel = new Views.StuckerBoxView();
            this.TxtName = new Views.TextBoxInputView();
            this.BtnColor = new Controls.ItemSelectButtonView();
            this.ChkEnabled = new Views.CheckBoxInputView();
            this.ChkWeekdaySunday = new Views.CheckBoxInputView();
            this.ChkWeekdayMonday = new Views.CheckBoxInputView();
            this.ChkWeekdayTuesday = new Views.CheckBoxInputView();
            this.ChkWeekdayWednesday = new Views.CheckBoxInputView();
            this.ChkWeekdayThursday = new Views.CheckBoxInputView();
            this.ChkWeekdayFriday = new Views.CheckBoxInputView();
            this.ChkWeekdaySaturday = new Views.CheckBoxInputView();
            this.SboHour = new Views.SelectBoxInputView();
            this.SboMinute = new Views.SelectBoxInputView();
            this.SdvControl = new Controls.SceneDetailView();

            this.DeleteButton = new Controls.PropertyButtonView();

            this.SetClassName('SchedulePageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlSet/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = 'Scene';
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            this.EditButton.SetSize(40, 40);
            this.EditButton.BackgroundColor = Color.HeaderButtonBackground;
            this.EditButton.HoverColor = Color.HeaderButtonHover;
            this.EditButton.Color = Color.Main;
            this.EditButton.Text = '@';
            this.EditButton.SetAnchor(null, 255, null, null);
            this.HeaderBar.Add(this.EditButton);

            this.HeaderLeftLabel.FontSize = Property.FontSize.Large;
            this.HeaderLeftLabel.Color = Color.Main;
            this.HeaderLeftLabel.SetAnchor(null, 5, null, null);
            this.HeaderBar.Add(this.HeaderLeftLabel);

            this.InputPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.InputPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.InputPanel.Size.Width = 280;
            this.InputPanel.SetAnchor(70, null, null, 10);
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
            lbl2.Text = 'Color';
            lbl2.TextAlign = Property.TextAlign.Left;
            lbl2.AutoSize = true;
            lbl2.SetAnchor(null, 5, null, null);
            lbl2.Size.Height = 21;
            this.InputPanel.Add(lbl2);
            this.InputPanel.AddSpacer();

            this.InputPanel.Add(this.BtnColor);
            this.InputPanel.AddSpacer();

            const lbl6 = new Views.LabelView();
            lbl6.Text = 'Operation';
            lbl6.TextAlign = Property.TextAlign.Left;
            lbl6.AutoSize = true;
            lbl6.SetAnchor(null, 5, null, null);
            lbl6.Size.Height = 21;
            this.InputPanel.Add(lbl6);

            this.SdvControl.SetWaitable(false);
            this.InputPanel.Add(this.SdvControl);

            const lbl3 = new Views.LabelView();
            lbl3.Text = 'Timer Enable';
            lbl3.TextAlign = Property.TextAlign.Left;
            lbl3.AutoSize = true;
            lbl3.SetAnchor(null, 5, null, null);
            lbl3.Size.Height = 21;
            this.InputPanel.Add(lbl3);

            this.ChkEnabled.SetAnchor(null, 5, 15, null);
            this.ChkEnabled.Size.Height = 30;
            this.ChkEnabled.Name = 'Enabled';
            this.ChkEnabled.Text = 'Enable';
            this.InputPanel.Add(this.ChkEnabled);

            const lbl5 = new Views.LabelView();
            lbl5.Text = 'Start Time';
            lbl5.TextAlign = Property.TextAlign.Left;
            lbl5.AutoSize = true;
            lbl5.SetAnchor(null, 5, null, null);
            lbl5.Size.Height = 21;
            this.InputPanel.Add(lbl5);
            this.InputPanel.AddSpacer();

            this.SboHour.SetAnchor(null, 15, null, null);
            this.SboHour.SetSize(80, 30);
            this.InputPanel.Add(this.SboHour);

            const lblSep = new Views.LabelView();
            lblSep.Text = ':';
            lblSep.TextAlign = Property.TextAlign.Center;
            lblSep.SetSize(30, 30);
            lblSep.AutoSize = false;
            this.InputPanel.Add(lblSep);

            this.SboMinute.SetSize(80, 30);
            this.InputPanel.Add(this.SboMinute);

            const lbl4 = new Views.LabelView();
            lbl4.Text = 'Weekday Action';
            lbl4.TextAlign = Property.TextAlign.Left;
            lbl4.AutoSize = true;
            lbl4.SetAnchor(null, 5, null, null);
            lbl4.Size.Height = 21;
            this.InputPanel.Add(lbl4);

            this.ChkWeekdaySunday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdaySunday.Size.Height = 30;
            this.ChkWeekdaySunday.Name = 'Sunday';
            this.ChkWeekdaySunday.Text = 'Sunday';
            this.InputPanel.Add(this.ChkWeekdaySunday);

            this.ChkWeekdayMonday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayMonday.Size.Height = 30;
            this.ChkWeekdayMonday.Name = 'Monday';
            this.ChkWeekdayMonday.Text = 'Monday';
            this.InputPanel.Add(this.ChkWeekdayMonday);

            this.ChkWeekdayTuesday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayTuesday.Size.Height = 30;
            this.ChkWeekdayTuesday.Name = 'Tuesday';
            this.ChkWeekdayTuesday.Text = 'Tuesday';
            this.InputPanel.Add(this.ChkWeekdayTuesday);

            this.ChkWeekdayWednesday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayWednesday.Size.Height = 30;
            this.ChkWeekdayWednesday.Name = 'Wednesday';
            this.ChkWeekdayWednesday.Text = 'Wednesday';
            this.InputPanel.Add(this.ChkWeekdayWednesday);

            this.ChkWeekdayThursday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayThursday.Size.Height = 30;
            this.ChkWeekdayThursday.Name = 'Thursday';
            this.ChkWeekdayThursday.Text = 'Thursday';
            this.InputPanel.Add(this.ChkWeekdayThursday);

            this.ChkWeekdayFriday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayFriday.Size.Height = 30;
            this.ChkWeekdayFriday.Name = 'Friday';
            this.ChkWeekdayFriday.Text = 'Friday';
            this.InputPanel.Add(this.ChkWeekdayFriday);

            this.ChkWeekdaySaturday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdaySaturday.Size.Height = 30;
            this.ChkWeekdaySaturday.Name = 'Saturday';
            this.ChkWeekdaySaturday.Text = 'Saturday';
            this.InputPanel.Add(this.ChkWeekdaySaturday);
        }
    }
}
