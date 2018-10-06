/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controllers {
    export class Manager {
        private _controllers: Array<IController>;

        constructor() {
            const ctrs: Array<IController> = [];

            $("div[data-controller]").each(function (i, el) {
                const $elem = $(el);
                const name = $elem.data('controller');
                const instance = Factory.Create(name, $elem, this);
                ctrs.push(instance);
            }.bind(this));

            this._controllers = ctrs;
        }

        public Show(id: string): void {
            const target = _.find(this._controllers, function (c) {
                return (c.Id === id);
            });
            if (!target)
                throw new Error("id not found: " + id);

            _.each(this._controllers, function (c) {
                if (c !== target && c.View.IsVisible())
                    c.View.Hide();
            });

            target.View.Show();
        }
    }
}