/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />

namespace App.Controllers {
    export class MainController extends Fw.Controllers.ControllerBase {

        private _btnGoSub1: JQuery;
        private _btnGoSub2: JQuery;
        private _centerControl: Fw.Views.ControlView;

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            super(elem, manager);
            this.Init();
        }

        private Init(): void {
            this._btnGoSub1 = this.View.Elem.find('button[name=GoSub1]');
            this._btnGoSub2 = this.View.Elem.find('button[name=GoSub2]');

            this._btnGoSub1.click(() => {
                // イベント通知でなく、参照保持でよいか？
                this.Manager.Show("Sub1");
            });

            this._btnGoSub2.click(() => {
                // イベント通知でなく、参照保持でよいか？
                this.Manager.Show("Sub2");
            });

            this._centerControl = new Fw.Views.ControlView();
            this._centerControl.SetDisplayParams(0, 0, 100, 50, '1155FF');
            this._centerControl.Label = 'はろー<br/>どうよ？';
            this.View.Add(this._centerControl);
        }
    }
}