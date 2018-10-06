/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Xhr/Params.ts" />
/// <reference path="../../Fw/Util/Xhr/MethodType.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />
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
        var Xhr = Fw.Util.Xhr;
        var Sub2Controller = /** @class */ (function (_super) {
            __extends(Sub2Controller, _super);
            function Sub2Controller(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            Sub2Controller.prototype.Init = function () {
                var _this = this;
                this._btnGoMain = this.View.Elem.find('button[name=GoMain]');
                this._btnA1Value = this.View.Elem.find('button[name=A1Value]');
                this._btnGoMain.click(function () {
                    _this.Manager.Show("Main");
                });
                this._btnA1Value.click(function () {
                    console.log('btnA1Value.click');
                    var params = new Xhr.Params('BrDevices/GetA1SensorValues', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        console.log('GetA1SensorValues:');
                        console.log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
            };
            return Sub2Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub2Controller = Sub2Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=Sub2Controller.js.map