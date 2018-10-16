/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="IController.ts" />
/// <reference path="Manager.ts" />
/* /// <reference path="../Views/PageView.ts" /> */

namespace Fw.Controllers {
    import Dump = Fw.Util.Dump;
    import Config = Fw.Config;

    /**
     * @see コントローラはイベント等の実装が無いので、IObjectを実装しない。
     * */
    export abstract class ControllerBase implements IController {

        private _id: string;
        public get Id(): string {
            return this._id;
        }

        public IsDefaultView: boolean;


        private _view: Fw.Views.IView;
        public get View(): Fw.Views.IView {
            return this._view;
        }

        private _manager: Fw.Controllers.Manager;
        public get Manager(): Fw.Controllers.Manager {
            return this._manager;
        }

        private _className: string;
        public get ClassName(): string {
            return this._className;
        }

        constructor(id?: string, jqueryElem?: JQuery) {
            if (!id)
                id = Fw.Util.App.CreateId();

            this._id = id;
            this.IsDefaultView = false;
            this._view = null;
            this._manager = Fw.Controllers.Manager.Instance;
            this._className = 'ControllerBase';

            this._manager.Add(this);

            if (jqueryElem)
                this.SetPageViewByJQuery(jqueryElem);
        }

        public SetClassName(name: string): void {
            this._className = name;
        }

        public SetPageView(view: Views.PageView): void {
            this._view = view;
        }

        public SetPageViewByJQuery(elem: JQuery): void {
            this._view = new Fw.Views.PageView(elem);
            this.IsDefaultView = (this.View.Elem.attr(Config.DefaultPageAttribute) === "true");

            if (this.IsDefaultView)
                this.View.Show();
        }

        public SwitchTo(id: string): void {
            this.Manager.Set(id);
        }

        public SwitchController(controller: IController): void {
            this.Manager.SetController(controller);
        }

        public SetModal(): void {
            this.Manager.SetModal(this.Id);
        }

        public HideModal(): void {
            (this.View as Views.PageView).HideModal();
        }

        public SetUnmodal(): void {
            this.Manager.SetUnmodal(this.Id);
        }

        public Dispose(): void {
            this._manager.Remove(this.Id);

            this._view.Dispose();
            this._view = null;

            this._id = null;
            this.IsDefaultView = null;
            this._manager = null;
            this._className = null;
        }
    }
}
