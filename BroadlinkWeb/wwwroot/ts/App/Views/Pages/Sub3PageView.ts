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

        public Header: Views.BoxView;
        public BtnBack: Views.ButtonView;
        public Stucker: Views.StuckerBoxView;


        constructor() {
            const jqueryElem = $("");
            super(jqueryElem);

            this.Initialize();
        }

        private Initialize(): void {
            this.SetClassName('Sub3PageView');

            this.Header = new Views.BoxView();
            this.Header.Size.Height = 50;
            this.Header.SetAnchor(0, 0, 0, null);
            this.Header.BackgroundColor = '#555555';
            this.Header.Color = '#FFFFFF';
            this.Header.HasBorder = false;
            this.Add(this.Header);
            const headerLabel = new Views.LabelView();
            headerLabel.Text = 'Sub 3 Page';
            headerLabel.FontSize = Property.FontSize.Large;
            headerLabel.Color = '#FFFFFF';
            this.Header.Add(headerLabel);

            this.BtnBack = new Fw.Views.ButtonView();
            this.BtnBack.SetSize(40, 40);
            this.BtnBack.Label = '<<';
            this.BtnBack.SetAnchor(null, 5, null, null);
            this.Header.Add(this.BtnBack);

            this.Stucker = new Views.StuckerBoxView();
            //this.Stucker.SetSize(600, 400);
            this.Stucker.SetAnchor(70, 20, 20, null);
            this.Stucker.Size.Height = 400;
            this.Stucker.SetLeftTop(10, 70);
            this.Add(this.Stucker);

            const btn1 = new Views.ButtonView();
            btn1.SetSize(100, 120);
            btn1.Label = 'btn1: LeftTop';
            this.Stucker.Add(btn1);
            btn1.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.LeftTop;
            });

            const btn2 = new Views.ButtonView();
            btn2.SetSize(100, 120);
            btn2.Label = 'btn2: RightTop';
            this.Stucker.Add(btn2);
            btn2.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.RightTop;
            });

            const btn3 = new Views.ButtonView();
            btn3.SetSize(100, 120);
            btn3.Label = 'btn3: LeftBottom';
            this.Stucker.Add(btn3);
            btn3.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.LeftBottom;
            });


            const btn4 = new Views.ButtonView();
            btn4.SetSize(100, 120);
            btn4.Label = 'btn4: RightBottom';
            this.Stucker.Add(btn4);
            btn4.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.RightBottom;
            });

            let idx = 5;
            for (let i = 0; i < 20; i++) {
                const btn = new Views.ButtonView();
                btn.SetSize(100, 120);
                btn.Label = `btn${(idx + i)}`;
                this.Stucker.Add(btn);
            }
        }
    }
}