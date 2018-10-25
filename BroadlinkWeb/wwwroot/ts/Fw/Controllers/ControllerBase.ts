/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="IController.ts" />
/// <reference path="../ObjectBase.ts" />

/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="Manager.ts" />


namespace Fw.Controllers {
    import Dump = Fw.Util.Dump;
    import Config = Fw.Config;

    export abstract class ControllerBase extends ObjectBase implements IController {

        private _id: string;
        public get Id(): string {
            return this._id;
        }

        public IsDefaultView: boolean;

        private _view: Fw.Views.PageView;
        public get View(): Fw.Views.PageView {
            return this._view;
        }

        private _manager: Fw.Controllers.Manager;
        public get Manager(): Fw.Controllers.Manager {
            return this._manager;
        }

        constructor(id?: string) {
            super();

            this.SetClassName('ControllerBase');

            if (!id)
                id = Fw.Util.App.CreateId();

            this._id = id;
            this.IsDefaultView = false;
            this._view = null;
            this._manager = Fw.Controllers.Manager.Instance;
            this._manager.Add(this);
        }

        public SetPageView(view: Views.PageView): void {
            this._view = view;
        }

        public Show(): void {
            this.Manager.SetController(this);
        }
        public Hide(): void {
            this.View.Hide();
        }

        public ShowModal(): void {
            this.Manager.SetModal(this.Id);
        }

        public HideModal(): void {
            this.View.HideModal();
        }

        public ToUnmodal(): void {
            this.Manager.SetUnmodal(this.Id);
        }

        // ↓Showメソッドに移行。
        // ↓呼び出されたコントローラ側で、呼び出しタイミングが分かりにくいので。
        //public SwitchTo(id: string): void {
        //    this.Manager.Set(id);
        //}
        //public SwitchController(controller: IController): void {
        //    this.Manager.SetController(controller);
        //}


        public Dispose(): void {
            super.Dispose();

            this._manager.Remove(this.Id);

            this._view.Dispose();
            this._view = null;

            this._id = null;
            this.IsDefaultView = null;
            this._manager = null;
        }
    }
}
