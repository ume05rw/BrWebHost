/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Events/SelectBoxInputViewEvents.ts" />
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
    import SelectBoxEvents = Fw.Events.SelectBoxInputViewEvents;
    import Lang = App.Items.Lang.Lang;

    export class SchedulePageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public EditButton: Controls.ButtonView;
        public HeaderLeftLabel: Views.LabelView;
        public InputPanel: Views.StuckerBoxView;
        public LblName: Views.LabelView;
        public TxtName: Views.TextBoxInputView;
        public LblColor: Views.LabelView;
        public BtnColor: Controls.ItemSelectButtonView;
        public SdvControl: Controls.SceneDetailView;
        public ChkEnabled: Views.CheckBoxInputView;
        public SboHour: Views.SelectBoxInputView;
        public SboMinute: Views.SelectBoxInputView;
        public LblTimeSeparator: Views.LabelView;
        public LblStartTime: Views.LabelView;
        public ChkWeekdaySunday: Views.CheckBoxInputView;
        public ChkWeekdayMonday: Views.CheckBoxInputView;
        public ChkWeekdayTuesday: Views.CheckBoxInputView;
        public ChkWeekdayWednesday: Views.CheckBoxInputView;
        public ChkWeekdayThursday: Views.CheckBoxInputView;
        public ChkWeekdayFriday: Views.CheckBoxInputView;
        public ChkWeekdaySaturday: Views.CheckBoxInputView;
        public DeleteButton: Controls.PropertyButtonView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.HeaderLeftLabel = new Views.LabelView();
            this.EditButton = new Controls.ButtonView();

            this.InputPanel = new Views.StuckerBoxView();
            this.LblName = new Views.LabelView();
            this.TxtName = new Views.TextBoxInputView();
            this.LblColor = new Views.LabelView();
            this.BtnColor = new Controls.ItemSelectButtonView();

            this.SdvControl = new Controls.SceneDetailView();
            this.ChkEnabled = new Views.CheckBoxInputView();
            this.SboHour = new Views.SelectBoxInputView();
            this.SboMinute = new Views.SelectBoxInputView();
            this.LblTimeSeparator = new Views.LabelView();
            this.LblStartTime = new Views.LabelView();
            this.ChkWeekdaySunday = new Views.CheckBoxInputView();
            this.ChkWeekdayMonday = new Views.CheckBoxInputView();
            this.ChkWeekdayTuesday = new Views.CheckBoxInputView();
            this.ChkWeekdayWednesday = new Views.CheckBoxInputView();
            this.ChkWeekdayThursday = new Views.CheckBoxInputView();
            this.ChkWeekdayFriday = new Views.CheckBoxInputView();
            this.ChkWeekdaySaturday = new Views.CheckBoxInputView();
            this.DeleteButton = new Controls.PropertyButtonView();

            this.SetClassName('SchedulePageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlSet/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = Lang.Scene;
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
            this.InputPanel.IsChildRelocatable = false;
            this.Add(this.InputPanel);

            this.LblName.Text = Lang.Name;
            this.LblName.TextAlign = Property.TextAlign.Left;
            this.LblName.AutoSize = true;
            this.LblName.SetAnchor(null, 5, null, null);
            this.LblName.Size.Height = 21;
            this.InputPanel.Add(this.LblName);

            this.TxtName.SetAnchor(null, 5, 15, null);
            this.TxtName.Size.Height = 30;
            this.InputPanel.Add(this.TxtName);

            this.LblColor.Text = Lang.Color;
            this.LblColor.TextAlign = Property.TextAlign.Left;
            this.LblColor.AutoSize = true;
            this.LblColor.SetAnchor(null, 5, null, null);
            this.LblColor.Size.Height = 21;
            this.InputPanel.Add(this.LblColor);
            this.InputPanel.AddSpacer();

            this.InputPanel.Add(this.BtnColor);
            this.InputPanel.AddSpacer();

            const lbl6 = new Views.LabelView();
            lbl6.Text = Lang.Operation;
            lbl6.TextAlign = Property.TextAlign.Left;
            lbl6.AutoSize = true;
            lbl6.SetAnchor(null, 5, null, null);
            lbl6.Size.Height = 21;
            this.InputPanel.Add(lbl6);

            this.SdvControl.SetWaitable(false);
            this.InputPanel.Add(this.SdvControl);

            const lbl3 = new Views.LabelView();
            lbl3.Text = Lang.TimerEnable;
            lbl3.TextAlign = Property.TextAlign.Left;
            lbl3.AutoSize = true;
            lbl3.SetAnchor(null, 5, null, null);
            lbl3.Size.Height = 21;
            this.InputPanel.Add(lbl3);

            this.ChkEnabled.SetAnchor(null, 15, 15, null);
            this.ChkEnabled.Size.Height = 30;
            this.ChkEnabled.Text = Lang.Enable;
            this.InputPanel.Add(this.ChkEnabled);

            const lbl5 = new Views.LabelView();
            lbl5.Text = Lang.StartTime;
            lbl5.TextAlign = Property.TextAlign.Left;
            lbl5.AutoSize = true;
            lbl5.SetAnchor(null, 5, null, null);
            lbl5.Size.Height = 21;
            this.InputPanel.Add(lbl5);
            this.InputPanel.AddSpacer();

            //this.SboHour.SetAnchor(null, 5, null, null);
            this.SboHour.SetSize(80, 30);
            for (let i = 0; i < 24; i++) {
                this.SboHour.AddItem(`00${i}`.slice(-2), i.toString());
            }
            this.SboHour.AddEventListener(SelectBoxEvents.Changed, this.OnStartTimeChanged, this);
            this.InputPanel.Add(this.SboHour);

            this.LblTimeSeparator.Text = ':';
            this.LblTimeSeparator.TextAlign = Property.TextAlign.Center;
            this.LblTimeSeparator.SetSize(10, 30);
            this.LblTimeSeparator.AutoSize = false;
            this.InputPanel.Add(this.LblTimeSeparator);

            this.SboMinute.SetSize(80, 30);
            for (let i = 0; i < 6; i++) {
                this.SboMinute.AddItem(`00${(i * 10)}`.slice(-2), (i * 10).toString());
            }
            this.SboMinute.AddEventListener(SelectBoxEvents.Changed, this.OnStartTimeChanged, this);
            this.InputPanel.Add(this.SboMinute);

            this.LblStartTime = new Views.LabelView();
            this.LblStartTime.Text = '00:00';
            this.LblStartTime.TextAlign = Property.TextAlign.Left;
            this.LblStartTime.AutoSize = true;
            this.LblStartTime.SetAnchor(null, 20, null, null);
            this.LblStartTime.Size.Height = 21;
            this.InputPanel.Add(this.LblStartTime);
            this.InputPanel.AddSpacer();


            const lbl4 = new Views.LabelView();
            lbl4.Text = Lang.WeekdayAction;
            lbl4.TextAlign = Property.TextAlign.Left;
            lbl4.AutoSize = true;
            lbl4.SetAnchor(null, 5, null, null);
            lbl4.Size.Height = 21;
            this.InputPanel.Add(lbl4);

            this.ChkWeekdaySunday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdaySunday.Size.Height = 30;
            this.ChkWeekdaySunday.Text = Lang.Sunday;
            this.InputPanel.Add(this.ChkWeekdaySunday);

            this.ChkWeekdayMonday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayMonday.Size.Height = 30;
            this.ChkWeekdayMonday.Text = Lang.Monday;
            this.InputPanel.Add(this.ChkWeekdayMonday);

            this.ChkWeekdayTuesday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayTuesday.Size.Height = 30;
            this.ChkWeekdayTuesday.Text = Lang.Tuesday;
            this.InputPanel.Add(this.ChkWeekdayTuesday);

            this.ChkWeekdayWednesday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayWednesday.Size.Height = 30;
            this.ChkWeekdayWednesday.Text = Lang.Wednesday;
            this.InputPanel.Add(this.ChkWeekdayWednesday);

            this.ChkWeekdayThursday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayThursday.Size.Height = 30;
            this.ChkWeekdayThursday.Text = Lang.Thursday;
            this.InputPanel.Add(this.ChkWeekdayThursday);

            this.ChkWeekdayFriday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdayFriday.Size.Height = 30;
            this.ChkWeekdayFriday.Text = Lang.Friday;
            this.InputPanel.Add(this.ChkWeekdayFriday);

            this.ChkWeekdaySaturday.SetAnchor(null, 15, 15, null);
            this.ChkWeekdaySaturday.Size.Height = 30;
            this.ChkWeekdaySaturday.Text = Lang.Saturday;
            this.InputPanel.Add(this.ChkWeekdaySaturday);

            this.DeleteButton.SetAnchor(null, 5, 15, null);
            this.DeleteButton.Size.Height = 30;
            this.DeleteButton.Text = Lang.Delete;
            this.InputPanel.Add(this.DeleteButton);
        }

        private OnStartTimeChanged(): void {
            if (!this.SboHour.Value
                || this.SboHour.Value === ''
                || !this.SboMinute.Value
                || this.SboMinute.Value === ''
            ) {
                this.LblStartTime.Text = '--:--';
            } else {
                this.LblStartTime.Text
                    = ('00' + this.SboHour.Value).slice(-2)
                        + ':'
                        + ('00' + this.SboMinute.Value).slice(-2);
            }
        }
    }
}
