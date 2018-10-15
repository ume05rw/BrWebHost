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

    export class ControlSetPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public ButtonPanel: Views.SlidableBoxView;

        constructor() {
            super($(""));

            this.HeaderBar = new Controls.HeaderBarView();
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

            this.ButtonPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.ButtonPanel.Size.Width = 300;
            this.ButtonPanel.SetAnchor(70, 10, null, 10);
            this.Add(this.ButtonPanel);

            for (let i = 0; i < 10; i++) {
                const left = (i % 3) * 100;
                const top = Math.floor(i / 3) * 100;

                const btn = new Controls.ControlButtonView();
                btn.SetLeftTop(left, top);
                this.ButtonPanel.Add(btn);
            }
        }
    }
}