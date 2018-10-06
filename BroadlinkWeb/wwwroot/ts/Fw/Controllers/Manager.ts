/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controllers {
    export class Manager {
        private _list: IController[];

        constructor() {
            let pages: IController[] = [];

            $("div[data-controller]").each(function (i, el) {
                const $elem = $(el);
                const name = $elem.data('controller');
                const instance = Factory.Create(name, $elem, this);
                pages.push(instance);
            }.bind(this));

            this._list = pages;
        }

        public Show(id: string): void {
            const target = _.find(this._list, function (p) {
                return (p.Id === id);
            });
            if (!target)
                throw new Error("id not found: " + id);

            _.each(this._list, function (p) {
                p.View.Elem.is(':visible')
                    ? p.View.Elem.hide(200)
                    : p.View.Elem.hide();
            });

            target.View.Elem.show(200);
        }
    }
}