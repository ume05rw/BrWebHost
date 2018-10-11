/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Xhr = Fw.Util.Xhr;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Manager = Fw.Controllers.Manager;

    export class Sub2Controller extends Fw.Controllers.ControllerBase {

        constructor(id: string, jqueryElem: JQuery) {
            super(id, jqueryElem);
            this.Init();
        }

        private Init(): void {

            const header = new Views.BoxView();
            header.Size.Height = 50;
            header.SetAnchor(0, 0, 0, null);
            header.BackgroundColor = '#555555';
            header.Color = '#FFFFFF';
            header.HasBorder = false;
            this.View.Add(header);
            const headerLabel = new Views.LabelView();
            headerLabel.Text = 'A1 Sensor';
            headerLabel.FontSize = Property.FontSize.Large;
            headerLabel.Color = '#FFFFFF';
            header.Add(headerLabel);

            const back = new Fw.Views.ButtonView();
            back.SetSize(40, 40);
            back.Label = '<<';
            back.SetAnchor(null, 5, null, null);
            back.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Manager.Instance.Show("Main");
            });
            header.Add(back);

            const btnA1Value = new Fw.Views.ButtonView();
            btnA1Value.Label = 'A1 Value';
            btnA1Value.SetSize(80, 30);
            btnA1Value.SetLeftTop(10, 70);
            btnA1Value.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('btnA1Value.click');

                var params = new Xhr.Params('BrDevices/GetA1SensorValues', Xhr.MethodType.Get);
                params.Callback = (data) => {
                    Dump.Log('GetA1SensorValues:');
                    Dump.Log(data);
                }
                Xhr.Query.Invoke(params);
            });
            this.View.Add(btnA1Value);


            const btnMove = new Fw.Views.RelocatableButtonView();
            btnMove.SetSize(60, 60);
            btnMove.Color = '#1188FF';
            btnMove.BackgroundColor = '#FF9900';
            btnMove.SetLeftTop(10, 120);

            btnMove.Label = '動く？';
            btnMove.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('btnMove.SingleClick');
            });
            this.View.Add(btnMove);

            const btnReset = new Fw.Views.ButtonView();
            btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
            btnReset.SetAnchor(70, null, 5, null);
            btnReset.Label = 'リセット';
            btnReset.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('btnReset.SingleClick');
                if (btnMove.IsRelocatable)
                    btnMove.SetRelocatable(false);
            });
            this.View.Add(btnReset);
        }
    }
}