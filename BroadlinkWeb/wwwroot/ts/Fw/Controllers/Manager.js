/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Manager = /** @class */ (function () {
            function Manager() {
                var pages = [];
                $("div[data-controller]").each(function (i, el) {
                    var $elem = $(el);
                    var name = $elem.data('controller');
                    var instance = Controllers.Factory.Create(name, $elem, this);
                    pages.push(instance);
                }.bind(this));
                this._list = pages;
            }
            Manager.prototype.show = function (id) {
                var target = _.find(this._list, function (p) {
                    return (p.Id === id);
                });
                if (!target)
                    throw new Error("id not found: " + id);
                _.each(this._list, function (p) {
                    p.View.is(':visible')
                        ? p.View.hide(200)
                        : p.View.hide();
                });
                target.View.show(200);
            };
            return Manager;
        }());
        Controllers.Manager = Manager;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Manager.js.map