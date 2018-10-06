/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/IController.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Views/PageView.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var ControllerBase = /** @class */ (function () {
            function ControllerBase(jqueryElem, manager) {
                this.View = new Fw.Views.PageView(jqueryElem);
                this.Manager = manager;
                this.Id = this.View.Elem.data("controller");
                this.IsDefaultView = (this.View.Elem.data("default"));
                if (this.IsDefaultView)
                    this.View.Show();
            }
            return ControllerBase;
        }());
        Controllers.ControllerBase = ControllerBase;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=ControllerBase.js.map