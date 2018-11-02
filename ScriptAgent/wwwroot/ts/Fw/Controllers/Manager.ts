/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />

namespace Fw.Controllers {
    import Dump = Fw.Util.Dump;
    import Config = Fw.Config;

    export class Manager {
        private static _instance: Manager = null;
        public static get Instance(): Manager {
            if (!Manager._instance) {
                Manager._instance = new Manager();
            }

            return Manager._instance;
        }


        private _controllers: { [name: string]: IController };

        private constructor() {
            this._controllers = {};
        }

        public Add(controller: IController): void {
            if (this._controllers[controller.Id])
                throw new Error(`Id[${controller.Id}] already exists`);

            this._controllers[controller.Id] = controller;
        }

        public Get(id: string): IController {
            if (!this._controllers[id]) {
                alert(`Controller Id[${id}] not found`)
                throw new Error(`Controller Id[${id}] not found`);
            }

            return this._controllers[id];
        }

        public Remove(id: string): void {
            if (!this._controllers[id])
                throw new Error(`Id[${id}] not found`);

            delete this._controllers[id];
        }

        private Reset(excludeController: IController): void {
            _.each(this._controllers, function (c) {
                if (c !== excludeController) {
                    const page = c.View as Views.PageView;
                    if (page.IsVisible) {
                        if (page.IsModal)
                            page.HideModal();
                        else
                            page.Hide();
                    }
                    if (page.IsMasked)
                        page.UnMask();
                }
            });
        }

        public Set(id: string): void {
            const controller = this._controllers[id];
            if (!controller)
                throw new Error("id not found: " + id);

            this.SetController(controller);
        }

        public SetController(controller: IController): void {
            this.Reset(controller);
            controller.View.Show();
        }

        public SetModal(id: string): void {
            const controller = this._controllers[id];
            if (!controller)
                throw new Error("id not found: " + id);

            _.each(this._controllers, function (c) {
                if (c !== controller && c.View.IsVisible && !c.View.IsModal)
                    (c.View as Views.PageView).Mask();
            });

            (controller.View as Views.PageView).ShowModal();
        }

        public HideModal(id: string): void {
            const controller = this._controllers[id];
            if (!controller)
                throw new Error("id not found: " + id);

            // 指定ID以外で、モーダルのPageが在るか否か
            let existsModal = false;
            _.each(this._controllers, function (c) {
                if (c !== controller && c.View.IsVisible && c.View.IsModal)
                    existsModal = true;
            });
            // 全員モーダルでない場合、マスクを消す。
            if (!existsModal)
                Fw.Root.Instance.UnMask();

            (controller.View as Views.PageView).HideModal();
        }

        public SetUnmodal(id: string): void {
            const controller = this._controllers[id];
            if (!controller)
                throw new Error("id not found: " + id);

            this.Reset(controller);
            (controller.View as Views.PageView).SetUnmodal();
        }
    }
}
