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

    export class MainPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public BtnGoSub1: Controls.ButtonView;
        public BtnGoSub2: Controls.ButtonView;
        public BtnGoSub3: Controls.ButtonView;
        public BtnGoDynamic: Controls.ButtonView;


        constructor() {
            const jqueryElem = $("");
            super(jqueryElem);

            this.Initialize();
        }

        private Initialize(): void {
            this.SetClassName('MainPageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Main/app_background.jpg';
            this.Add(background);

            this.HeaderBar = new Controls.HeaderBarView();
            this.HeaderBar.Text = 'Broadlink Web Host(仮題)';
            this.HeaderBar.LeftButton.Hide(0);
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            const bottom = new Views.StuckerBoxView();
            bottom.HasBorder = true;
            bottom.BorderRadius = 5;
            bottom.BackgroundColor = 'transparent';
            bottom.Color = '#D4B16A';
            bottom.SetAnchor(null, 10, 10, 10);
            bottom.ReferencePoint = Property.ReferencePoint.RightBottom;
            bottom.Size.Height = 50;
            this.Add(bottom);

            this.BtnGoSub1 = new Controls.ButtonView();
            this.BtnGoSub1.Label = 'Show Sub1';
            this.BtnGoSub1.SetSize(80, 30);
            bottom.Add(this.BtnGoSub1);

            this.BtnGoSub2 = new Controls.ButtonView();
            this.BtnGoSub2.Label = 'Show Sub2';
            this.BtnGoSub2.SetSize(80, 30);
            bottom.Add(this.BtnGoSub2);

            this.BtnGoSub3 = new Controls.ButtonView();
            this.BtnGoSub3.Label = 'Show Sub3';
            this.BtnGoSub3.SetSize(80, 30);
            bottom.Add(this.BtnGoSub3);

            
            this.BtnGoDynamic = new Controls.ButtonView();
            this.BtnGoDynamic.Label = 'Layout';
            this.BtnGoDynamic.SetSize(80, 30);
            bottom.Add(this.BtnGoDynamic);
        }
    }
}