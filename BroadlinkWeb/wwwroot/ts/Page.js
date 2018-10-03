/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />
var Page = /** @class */ (function () {
    function Page(elem) {
        this.Elem = elem;
        this.Id = this.Elem.data("pageid");
        this.IsDefaultPage = (this.Elem.data("pagedefault") == "true");
        if (this.IsDefaultPage)
            this.Elem.show();
    }
    ;
    return Page;
}());
;
//# sourceMappingURL=Page.js.map