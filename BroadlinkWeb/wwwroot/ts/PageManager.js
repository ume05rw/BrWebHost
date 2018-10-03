/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />
/// <reference path="./Page.ts" />
var PageManager = /** @class */ (function () {
    function PageManager() {
        var pages = [];
        $("div[data-pageid]").each(function (i, el) {
            pages.push(new Page(el));
        }.bind(this));
        this._list = pages;
    }
    ;
    PageManager.prototype.show = function (id) {
        var target = _.find(this._list, function (p) {
            return (p.Id === id);
        });
        if (target == null)
            throw new Error("id not found: " + id);
        _.each(this._list, function (p) {
            p.Elem.is(':visible')
                ? p.Elem.hide(200)
                : p.Elem.hide();
        });
        target.Elem.show(200);
    };
    return PageManager;
}());
;
//# sourceMappingURL=PageManager.js.map