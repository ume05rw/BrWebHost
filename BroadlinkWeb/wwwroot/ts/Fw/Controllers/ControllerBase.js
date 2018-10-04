/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
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
        Controllers.ControllerBase = ControllerBase;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=ControllerBase.js.map