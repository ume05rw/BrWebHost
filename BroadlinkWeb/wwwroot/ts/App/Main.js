/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
var App;
(function (App) {
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.StartUp = function () {
            var pager = new Fw.Controller.Manager();
        };
        return Main;
    }());
    App.Main = Main;
})(App || (App = {}));
$(function () {
    Fw.Util.Xhr.UrlBase = 'http://localhost:20776/api/';
    App.Main.StartUp();
});
//# sourceMappingURL=Main.js.map