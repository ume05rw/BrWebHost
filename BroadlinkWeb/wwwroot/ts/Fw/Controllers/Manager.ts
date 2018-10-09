/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="Factory.ts" />

namespace Fw.Controllers {
    import Dump = Fw.Util.Dump;
    import Config = Fw.Config;

    export class Manager {
        private static _instance: Manager = null;
        public static get Instance(): Manager {
            if (!Manager._instance)
                throw new Error('Manager.Init() has not been executed.');

            return Manager._instance;
        }
        public static Init(): void {
            Manager._instance = new Manager();
        }


        private _controllers: Array<IController>;

        private constructor() {
            const ctrs: Array<IController> = [];

            $(`div[${Config.PageIdAttribute}]`).each(function (i, el) {
                const $elem = $(el);
                const name = $elem.attr(Config.PageIdAttribute);
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