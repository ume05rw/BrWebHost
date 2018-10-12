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
            this.Stucker.SetSize(600, 400);
            this.Stucker.SetLeftTop(10, 70);
            this.Add(this.Stucker);

            const btn1 = new Views.ButtonView();
            btn1.SetSize(100, 120);
            btn1.Label = 'btn1';
            this.Stucker.Add(btn1);
            btn1.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.LeftTop;
            });

            const btn2 = new Views.ButtonView();
            btn2.SetSize(100, 120);
            btn2.Label = 'btn2';
            this.Stucker.Add(btn2);
            btn2.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.RightTop;
            });

            const btn3 = new Views.ButtonView();
            btn3.SetSize(100, 120);
            btn3.Label = 'btn3';
            this.Stucker.Add(btn3);
            btn3.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.LeftBottom;
            });


            const btn4 = new Views.ButtonView();
            btn4.SetSize(100, 120);
            btn4.Label = 'btn4';
            this.Stucker.Add(btn4);
            btn4.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, () => {
                this.Stucker.ReferencePoint = Property.ReferencePoint.RightBottom;
            });

            const btn5 = new Views.ButtonView();
            btn5.SetSize(100, 120);
            btn5.Label = 'btn5';
            this.Stucker.Add(btn5);

            const btn6 = new Views.ButtonView();
            btn6.SetSize(100, 120);
            btn6.Label = 'btn6';
            this.Stucker.Add(btn6);

            const btn7 = new Views.ButtonView();
            btn7.SetSize(100, 120);
            btn7.Label = 'btn7';
            this.Stucker.Add(btn7);

        }
    }
}