/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controller {
    export class Manager {
        private _list: IController[];

        constructor() {
            let pages: IController[] = [];

            $("div[data-controller]").each(function (i, el) {
                let $elem = $(el);
                let name = $elem.data('controller');
                let instance = Factory.Create(name, $elem, this);
                pages.push(instance);
            }.bind(this));

            this._list = pages;
        }

        public show(id: string): void {
            let target = _.find(this._list, function (p) {
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
        }
    }
    
}