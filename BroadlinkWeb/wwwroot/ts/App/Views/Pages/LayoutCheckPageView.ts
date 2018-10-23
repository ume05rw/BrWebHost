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

    export class LayoutCheckPageView extends Fw.Views.PageView {

        public BtnGoSub1: Views.ButtonView;
        public BtnGoSub2: Views.ButtonView;
        public CenterControl: Views.ControlView;
        public TmpCtl: Views.ControlView;
        public Toggle: Views.ToggleButtonInputView;
        public AncCtl1: Views.ButtonView;
        public AncCtl2: Views.ButtonView;
        public AncCtl3: Views.ButtonView;
        public AncCtl4: Views.ButtonView;
        public AncCtl5: Views.ButtonView;
        public AncCtl6: Views.ButtonView;


        constructor() {
            super();

            this.BtnGoSub1 = new Fw.Views.ButtonView();
            this.BtnGoSub2 = new Fw.Views.ButtonView();
            this.CenterControl = new Fw.Views.ControlView();
            this.TmpCtl = new Fw.Views.ControlView();
            this.AncCtl1 = new Fw.Views.ButtonView();
            this.AncCtl2 = new Fw.Views.ButtonView();
            this.AncCtl3 = new Fw.Views.ButtonView();
            this.Toggle = new Fw.Views.ToggleButtonInputView();
            this.AncCtl4 = new Fw.Views.ButtonView();

            this.SetClassName('MainPageView');

            this.BtnGoSub1.Text = 'Go Sub1';
            this.BtnGoSub1.SetSize(80, 30);
            this.BtnGoSub1.SetAnchor(null, 10, null, null);
            this.Add(this.BtnGoSub1);

            this.BtnGoSub2.Text = 'Go Sub2';
            this.BtnGoSub2.SetSize(80, 30);
            this.BtnGoSub2.Position.Y = 40;
            this.BtnGoSub2.SetAnchor(null, 10, null, null);
            this.Add(this.BtnGoSub2);

            this.CenterControl.SetXY(0, 0);
            this.CenterControl.SetSize(100, 50);
            this.CenterControl.Color = '#1155FF';
            this.CenterControl.Text = 'はろー<br/>どうよ？';
            this.Add(this.CenterControl);

            this.TmpCtl.SetXY(-100, -100);
            this.TmpCtl.SetSize(200, 200);
            this.TmpCtl.Color = '#666666';
            this.TmpCtl.Text = 'くりっく';
            this.Add(this.TmpCtl);

            this.AncCtl1.Text = '右下';
            this.AncCtl1.SetSize(200, 50);
            this.AncCtl1.SetAnchor(null, null, 40, 5);
            this.Add(this.AncCtl1);

            this.AncCtl2.Text = '右上';
            this.AncCtl2.SetSize(200, 50);
            this.AncCtl2.SetAnchor(3, null, 3, null);
            this.Add(this.AncCtl2);
            const label = new Fw.Views.LabelView();
            label.FontSize = Property.FontSize.XxLarge;
            label.Text = 'らべるやで';
            this.AncCtl2.Add(label);

            this.AncCtl3.Text = '左下';
            this.AncCtl3.SetSize(300, 100);
            this.AncCtl3.SetAnchor(null, 3, null, 3);
            this.Add(this.AncCtl3);
            const img = new Fw.Views.ImageView();
            img.SetSize(100, 70);
            img.Src = 'images/icons/home.png';
            img.FitPolicy = Property.FitPolicy.Cover;
            this.AncCtl3.Add(img);

            this.Toggle.SetAnchor(150, 10, null, null);
            this.Add(this.Toggle);

            this.AncCtl4.Text = 'マスク';
            this.AncCtl4.SetSize(200, 50);
            this.AncCtl4.SetAnchor(60, 3, null, null);
            this.Add(this.AncCtl4);

            //this.AncCtl5 = new Fw.Views.ButtonView();
            //this.AncCtl5.Label = '左右';
            //this.AncCtl5.Size.Height = 50;
            //this.AncCtl5.SetAnchor(null, 150, 300, 100);
            //this.Add(this.AncCtl5);

            //this.AncCtl6 = new Fw.Views.ButtonView();
            //this.AncCtl6.Label = '上下';
            //this.AncCtl6.SetAnchor(200, null, null, 40);
            //this.AncCtl6.Size.Width = 30;
            //this.Add(this.AncCtl6);
        }
    }
}
