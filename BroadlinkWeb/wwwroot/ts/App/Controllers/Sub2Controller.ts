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

            const header = new App.Views.Controls.HeaderBarView();
            header.Text = 'A1 Sensor';
            header.RightButton.Hide(0);
            header.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                this.SwitchTo("Main");
            });
            this.View.Add(header);

            const btnA1Value = new Fw.Views.ButtonView();
            btnA1Value.Text = 'A1 Value';
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

            btnMove.Text = '動く？';
            btnMove.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('btnMove.SingleClick');
            });
            this.View.Add(btnMove);

            const btnReset = new Fw.Views.ButtonView();
            btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
            btnReset.SetAnchor(70, null, 5, null);
            btnReset.Text = 'リセット';
            btnReset.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('btnReset.SingleClick');
                if (btnMove.IsRelocatable)
                    btnMove.SetRelocatable(false);
            });
            this.View.Add(btnReset);
        }
    }
}