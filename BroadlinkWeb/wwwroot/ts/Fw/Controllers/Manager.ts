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
            if (!Manager._instance) {
                Manager.Init();
            }

            return Manager._instance;
        }
        // TODO: ↓そのうち削除予定
        public static Init(): void {
            if (!Manager._instance)
                Manager._instance = new Manager();
        }

        private _controllers: { [name: string]: IController };

        private constructor() {
            this._controllers = {};

            $(`div[${Config.PageIdAttribute}]`).each(function (i, el) {
                const $elem = $(el);
                const id = $elem.attr(Config.PageIdAttribute);
                const instance = Factory.Create(id, $elem);
                this._controllers[id] = instance;
            }.bind(this));
        }

        public Add(controller: IController): void {
            if (this._controllers[controller.Id])
                throw new Error(`Id[${controller.Id}] already exists`);

            this._controllers[controller.Id] = controller;
        }

        public Show(id: string): void {
            const target = this._controllers[id];
            if (!target)
                throw new Error("id not found: " + id);

            _.each(this._controllers, function (c) {
                if (c !== target && c.View.IsVisible)
                    c.View.Hide();
            });

            target.View.Show();
        }

        public ShowOnce(controller: IController): void {
            _.each(this._controllers, function (c) {
                c.View.Hide();
            });

            controller.View.Show();
        }
    }
}