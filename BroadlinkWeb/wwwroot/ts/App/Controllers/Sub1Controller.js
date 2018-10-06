/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
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
        var Sub1Controller = /** @class */ (function (_super) {
            __extends(Sub1Controller, _super);
            function Sub1Controller(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            Sub1Controller.prototype.Init = function () {
                var _this = this;
                this._btnGoMain = this.View.Elem.find('button[name=GoMain]');
                this._btnDevices = this.View.Elem.find('button[name=Discover]');
                this._btnGoMain.click(function () {
                    _this.Manager.Show("Main");
                });
                this._btnDevices.click(function () {
                    console.log('btnDevices.click');
                    var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        console.log('Disover:');
                        console.log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
            };
            return Sub1Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub1Controller = Sub1Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
//# sourceMappingURL=Sub1Controller.js.map