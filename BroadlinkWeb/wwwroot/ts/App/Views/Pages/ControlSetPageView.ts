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

    export class ControlSetPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public EditButton: Controls.ButtonView;
        public HeaderLeftLabel: Views.LabelView;
        public ButtonPanel: Views.SlidableBoxView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.EditButton = new Controls.ButtonView();
            this.HeaderLeftLabel = new Views.LabelView();
            this.ButtonPanel = new Views.SlidableBoxView(Property.Direction.Vertical);


            this.SetClassName('ControlSetPageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlSet/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = 'Remote Control';
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


            this.ButtonPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.ButtonPanel.Size.Width = 280;
            this.ButtonPanel.SetAnchor(70, null, null, 10);
            this.ButtonPanel.Color = Color.MainBackground;
            this.Add(this.ButtonPanel);

            this.HeaderBar.Elem.hover(() => {
                if (this.EditButton.IsVisible) {
                    this.HeaderBar.SetStyles({
                        backgroundColor: Color.MainBackground,
                        cursor: 'normal'
                    });
                    this.HeaderBar.ApplyStyles();
                    return;
                }

                this.HeaderBar.SetStyles({
                    backgroundColor: Color.MainHover,
                    cursor: 'pointer'
                });
                this.HeaderBar.ApplyStyles();
            }, () => {
                this.HeaderBar.SetStyles({
                    backgroundColor: Color.MainBackground,
                    cursor: 'normal'
                });
                this.HeaderBar.ApplyStyles();
            });
        }
    }
}
