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
        public BtnGoSub1: Views.ButtonView;
        public BtnGoSub2: Views.ButtonView;
        public BtnGoSub3: Views.ButtonView;
        public BtnGoDynamic: Views.ButtonView;


        constructor() {
            const jqueryElem = $("");
            super(jqueryElem);

            this.Initialize();
        }

        private Initialize(): void {
            this.SetClassName('MainPageView');

            this.HeaderBar = new Controls.HeaderBarView();
            this.HeaderBar.Text = 'Broadlink Web Host(仮題)';
            this.HeaderBar.LeftButton.Hide(0);
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            this.BtnGoSub1 = new Fw.Views.ButtonView();
            this.BtnGoSub1.Label = 'Show Sub1';
            this.BtnGoSub1.SetSize(80, 30);
            this.BtnGoSub1.SetLeftTop(10, 70);
            this.Add(this.BtnGoSub1);

            this.BtnGoSub2 = new Fw.Views.ButtonView();
            this.BtnGoSub2.Label = 'Show Sub2';
            this.BtnGoSub2.SetSize(80, 30);
            this.BtnGoSub2.SetLeftTop(10, 120);
            this.Add(this.BtnGoSub2);

            this.BtnGoSub3 = new Fw.Views.ButtonView();
            this.BtnGoSub3.Label = 'Show Sub3';
            this.BtnGoSub3.SetSize(80, 30);
            this.BtnGoSub3.SetLeftTop(10, 170);
            this.Add(this.BtnGoSub3);

            
            this.BtnGoDynamic = new Fw.Views.ButtonView();
            this.BtnGoDynamic.Label = 'Show LayoutCheck';
            this.BtnGoDynamic.SetSize(80, 30);
            this.BtnGoDynamic.SetLeftTop(10, 220);
            this.Add(this.BtnGoDynamic);
        }
    }
}