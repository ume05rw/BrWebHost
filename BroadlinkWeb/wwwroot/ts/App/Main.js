/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />
/// <reference path="../Fw/Util/Xhr/Config.ts" />
var App;
(function (App) {
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.StartUp = function () {
            var proto = location.protocol;
            var host = location.hostname;
            var port = location.port;
            Fw.Util.Xhr.Config.BaseUrl = proto + '//' + host + ':' + port + '/api/';
            // コントローラを起動。
            Main._controllerManager = new Fw.Controllers.Manager();
        };
        return Main;
    }());
    App.Main = Main;
})(App || (App = {}));
// アプリケーションを起動する。
// 以下にはこれ以上書かないこと。
$(function () {
    App.Main.StartUp();
});
//# sourceMappingURL=Main.js.map