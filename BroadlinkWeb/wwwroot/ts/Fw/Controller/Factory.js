/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controller;
    (function (Controller) {
        var Factory = /** @class */ (function () {
            function Factory() {
            }
            // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
            Factory.GetViewClass = function (name) {
                return Function('return (App.Controller.' + name + 'Controller)')();
            };
            return Factory;
        }());
        Controller.Factory = Factory;
    })(Controller = Fw.Controller || (Fw.Controller = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Factory.js.map