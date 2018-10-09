/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Xhr = Fw.Util.Xhr;
    import Events = Fw.Events;

    export class Sub2Controller extends Fw.Controllers.ControllerBase {

        private _btnGoMain: JQuery;
        private _btnA1Value: JQuery;

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            super(elem, manager);
            this.Init();
        }

        private Init(): void {
            this._btnGoMain = this.View.Elem.find('button[name=GoMain]');
            this._btnA1Value = this.View.Elem.find('button[name=A1Value]');

            this._btnGoMain.click(() => {
                this.Manager.Show("Main");
            });

            this._btnA1Value.click(() => {

                console.log('btnA1Value.click');

                var params = new Xhr.Params('BrDevices/GetA1SensorValues', Xhr.MethodType.Get);
                params.Callback = (data) => {
                    console.log('GetA1SensorValues:');
                    console.log(data);
                }
                Xhr.Query.Invoke(params);
            })

            const btnMove = new Fw.Views.RelocatableControlView();
            btnMove.SetDisplayParams(60, 60, 0, -200, '#1188FF');
            
            btnMove.BackgroundColor = '#FF9900';
            btnMove.Label = '動く？';
            btnMove.AddEventListener(Events.ControlEvents.SingleClick, () => {
                console.log('btnMove.SingleClick');
            });
            this.View.Add(btnMove);

            const btnReset = new Fw.Views.ControlView();
            btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
            btnReset.SetAnchor(5, null, 5, null);
            btnReset.Label = 'リセット';
            btnReset.AddEventListener(Events.ControlEvents.SingleClick, () => {
                console.log('btnReset.SingleClick');
                if (btnMove.IsRelocatable)
                    btnMove.SetRelocatable(false);
            });
            this.View.Add(btnReset);
        }
    }
}