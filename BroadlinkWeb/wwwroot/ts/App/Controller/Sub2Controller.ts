/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Controller {
    export class Sub2Controller extends Fw.Controller.ControllerBase {

        private _btnGoMain: JQuery;
        private _btnA1Value: JQuery;

        constructor(elem: JQuery, manager: Fw.Controller.Manager) {
            super(elem, manager);
            this.Init();
        }

        private Init(): void {
            this._btnGoMain = this.View.find('button[name=GoMain]');
            this._btnA1Value = this.View.find('button[name=A1Value]');

            this._btnGoMain.click(() => {
                this.Manager.show("Main");
            });

            this._btnA1Value.click(() => {

                console.log('btnA1Value.click');

                var params = new Fw.Util.XhrParams('BrDevices/GetA1SensorValues', Fw.Util.XhrMethodType.Get);
                params.Callback = (data) => {
                    console.log('GetA1SensorValues:');
                    console.log(data);
                }
                Fw.Util.Xhr.Query(params);
            })
        }
    }
}