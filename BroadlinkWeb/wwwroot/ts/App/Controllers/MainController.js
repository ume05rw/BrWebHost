/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var MainController = /** @class */ (function (_super) {
            __extends(MainController, _super);
            function MainController(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            MainController.prototype.Init = function () {
                var _this = this;
                this._btnGoSub1 = this.View.Elem.find('button[name=GoSub1]');
                this._btnGoSub2 = this.View.Elem.find('button[name=GoSub2]');
                this._btnGoSub1.click(function () {
                    // イベント通知でなく、参照保持でよいか？
                    _this.Manager.Show("Sub1");
                });
                this._btnGoSub2.click(function () {
                    // イベント通知でなく、参照保持でよいか？
                    _this.Manager.Show("Sub2");
                });
                this._centerControl = new Fw.Views.ControlView();
                this._centerControl.SetDisplayParams(0, 0, 100, 50, '1155FF');
                this._centerControl.Label = 'はろー<br/>どうよ？';
                this.View.Add(this._centerControl);
                var tmpCtl = new Fw.Views.ControlView();
                tmpCtl.SetDisplayParams(-100, -100, 200, 200, '666666');
                tmpCtl.Label = 'くりっく';
                tmpCtl.AddEventListener(Fw.Events.ControlEvents.SingleClick, function () {
                    console.log('LONG CLICK!!');
                    if (_this._centerControl.IsVisible()) {
                        console.log('みえてんで！');
                        _this._centerControl.Hide();
                    }
                    else {
                        console.log('みえへんで...？');
                        _this._centerControl.Show();
                    }
                });
                this.View.Add(tmpCtl);
                this.View.AddEventListener(Fw.Events.PageEvents.Shown, function () {
                    console.log('MainView.Shown');
                });
            };
            return MainController;
        }(Fw.Controllers.ControllerBase));
        Controllers.MainController = MainController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=MainController.js.map