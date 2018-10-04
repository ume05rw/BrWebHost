/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controller;
    (function (Controller) {
        var ControllerBase = /** @class */ (function () {
            function ControllerBase(elem, manager) {
                this.View = elem;
                this.Manager = manager;
                this.Id = this.View.data("controller");
                this.IsDefaultView = (this.View.data("default"));
                if (this.IsDefaultView)
                    this.View.show();
            }
            return ControllerBase;
        }());
        Controller.ControllerBase = ControllerBase;
    })(Controller = Fw.Controller || (Fw.Controller = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=ControllerBase.js.map