/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />


namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;

    export class MainPageView extends Fw.Views.PageView {

        public Header: Views.BoxView;
        public BtnGoSub1: Views.ButtonView;
        public BtnGoSub2: Views.ButtonView;
        public BtnGoDynamic: Views.ButtonView;


        constructor() {
            const jqueryElem = $("");
            super(jqueryElem);

            this.Initialize();
        }

        private Initialize(): void {
            this.SetClassName('MainPageView');

            this.Header = new Views.BoxView();
            this.Header.Size.Height = 50;
            this.Header.SetAnchor(0, 0, 0, null);
            this.Header.BackgroundColor = '#555555';
            this.Header.Color = '#FFFFFF';
            this.Header.HasBorder = false;
            this.Add(this.Header);
            const headerLabel = new Views.LabelView();
            headerLabel.Text = 'Broadlink Web Host(仮題)';
            headerLabel.FontSize = Property.FontSize.Large;
            headerLabel.Color = '#FFFFFF';
            this.Header.Add(headerLabel);

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

            
            this.BtnGoDynamic = new Fw.Views.ButtonView();
            this.BtnGoDynamic.Label = 'Show LayoutCheck';
            this.BtnGoDynamic.SetSize(80, 30);
            this.BtnGoDynamic.SetLeftTop(10, 170);
            this.Add(this.BtnGoDynamic);
        }
    }
}