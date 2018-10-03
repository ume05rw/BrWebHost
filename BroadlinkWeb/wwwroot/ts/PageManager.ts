/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />
/// <reference path="./Page.ts" />

class PageManager {

    private _list: Page[];

    constructor() {
        let pages: Page[] = [];

        $("div[data-pageid]").each(function (i, el) {
            pages.push(new Page(el));
        }.bind(this));

        this._list = pages;
    };

    public show(id: string): void {
        let target = _.find(this._list, function (p) {
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
    }
};