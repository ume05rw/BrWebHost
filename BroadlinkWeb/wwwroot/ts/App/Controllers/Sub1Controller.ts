/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Util/Xhr/Params.ts" />
/// <reference path="../../Fw/Util/Xhr/MethodType.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />

namespace App.Controllers {
    import Xhr = Fw.Util.Xhr;

    export class Sub1Controller extends Fw.Controllers.ControllerBase {

        private _btnGoMain: JQuery;
        private _btnDevices: JQuery;

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            super(elem, manager);
            this.Init();
        }

        private Init(): void {
            this._btnGoMain = this.View.Elem.find('button[name=GoMain]');
            this._btnDevices = this.View.Elem.find('button[name=Discover]');

            this._btnGoMain.click(() => {
                this.Manager.Show("Main");
            });

            this._btnDevices.click(() => {

                console.log('btnDevices.click');

                var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                params.Callback = (data) => {
                    console.log('Disover:');
                    console.log(data);
                }
                Xhr.Query.Invoke(params);
            });
        }
    }
}