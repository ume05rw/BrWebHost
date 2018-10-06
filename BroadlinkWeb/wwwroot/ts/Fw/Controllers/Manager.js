/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Factory.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Manager = /** @class */ (function () {
            function Manager() {
                var ctrs = [];
                $("div[data-controller]").each(function (i, el) {
                    var $elem = $(el);
                    var name = $elem.data('controller');
                    var instance = Controllers.Factory.Create(name, $elem, this);
                    ctrs.push(instance);
                }.bind(this));
                this._controllers = ctrs;
            }
            Manager.prototype.Show = function (id) {
                var target = _.find(this._controllers, function (c) {
                    return (c.Id === id);
                });
                if (!target)
                    throw new Error("id not found: " + id);
                _.each(this._controllers, function (c) {
                    if (c !== target && c.View.IsVisible())
                        c.View.Hide();
                });
                target.View.Show();
            };
            return Manager;
        }());
        Controllers.Manager = Manager;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Manager.js.map