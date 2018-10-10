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
    import Manager = Fw.Controllers.Manager;

    export class Sub2Controller extends Fw.Controllers.ControllerBase {

        constructor(elem: JQuery) {
            super(elem);
            this.Init();
        }

        private Init(): void {

            const btnGoMain = new Fw.Views.ControlView();
            btnGoMain.Label = 'Back Main';
            btnGoMain.SetSize(80, 30);
            btnGoMain.SetAnchor(30, 10, null, null);
            btnGoMain.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                // イベント通知でなく、参照保持でよいか？
                Manager.Instance.Show("Main");
            });
            this.View.Add(btnGoMain);

            const btnA1Value = new Fw.Views.ControlView();
            btnA1Value.Label = 'A1 Value';
            btnA1Value.SetSize(80, 30);
            btnA1Value.SetAnchor(80, 10, null, null);
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


            const btnMove = new Fw.Views.RelocatableControlView();
            btnMove.SetSize(60, 60);
            btnMove.Color = '#1188FF';
            btnMove.BackgroundColor = '#FF9900';
            ///btnMove.SetXY(0, -200);
            btnMove.SetLeftTop(10, 20);
            //btnMove.SetDisplayParams(60, 60, 0, -200, '#1188FF');
            
            btnMove.Label = '動く？';
            btnMove.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('btnMove.SingleClick');
            });
            this.View.Add(btnMove);

            const btnReset = new Fw.Views.ControlView();
            btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
            btnReset.SetAnchor(5, null, 5, null);
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