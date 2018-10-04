/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controller;
    (function (Controller) {
        var Manager = /** @class */ (function () {
            function Manager() {
                var pages = [];
                $("div[data-viewclass]").each(function (i, el) {
                    var $elem = $(el);
                    var name = $elem.data('viewclass');
                    var pageClass = Fw.Controller.Factory.GetViewClass(name);
                    var instance = new pageClass($elem, this);
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
        Controller.Manager = Manager;
    })(Controller = Fw.Controller || (Fw.Controller = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Manager.js.map