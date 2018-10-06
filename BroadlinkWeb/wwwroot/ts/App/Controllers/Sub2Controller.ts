/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Xhr/Params.ts" />
/// <reference path="../../Fw/Util/Xhr/MethodType.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />

namespace App.Controllers {
    import Xhr = Fw.Util.Xhr;

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
        }
    }
}