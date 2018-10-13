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

    export class Sub3PageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public Stucker: Views.StuckerBoxView;


        constructor() {
            const jqueryElem = $("");
            super(jqueryElem);

            this.HeaderBar = new Controls.HeaderBarView();
            this.Stucker = new Views.StuckerBoxView();

            this.SetClassName('Sub3PageView');

            this.HeaderBar.Text = 'Sub 3 Page';
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            //this.Stucker.SetSize(600, 400);
            this.Stucker.SetAnchor(70, 20, 20, null);
            this.Stucker.Size.Height = 400;
            this.Stucker.SetLeftTop(10, 70);
            this.Add(this.Stucker);

            const btn1 = new Views.ButtonView();
            btn1.SetSize(100, 120);
            btn1.Text = 'btn1: LeftTop';
            this.Stucker.Add(btn1);
            btn1.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.LeftTop;
            });

            const btn2 = new Views.ButtonView();
            btn2.SetSize(100, 120);
            btn2.Text = 'btn2: RightTop';
            this.Stucker.Add(btn2);
            btn2.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.RightTop;
            });

            const btn3 = new Views.ButtonView();
            btn3.SetSize(100, 120);
            btn3.Text = 'btn3: LeftBottom';
            this.Stucker.Add(btn3);
            btn3.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.LeftBottom;
            });

            const btn4 = new Views.ButtonView();
            btn4.SetSize(100, 120);
            btn4.Text = 'btn4: RightBottom';
            this.Stucker.Add(btn4);
            btn4.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.RightBottom;
            });

            let idx = 5;
            for (let i = 0; i < 20; i++) {
                const btn = new Views.ButtonView();
                btn.SetSize(100, 120);
                btn.Text = `btn${(idx + i)}`;
                this.Stucker.Add(btn);
            }
        }
    }
}