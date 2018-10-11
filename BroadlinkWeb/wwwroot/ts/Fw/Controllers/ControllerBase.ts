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
        public Id: string;
        public IsDefaultView: boolean;
        public View: Fw.Views.IView = null;

        private _className: string;
        public get ClassName(): string {
            return this._className;
        }

        constructor(id: string, jqueryElem?: JQuery) {
            if (!id)
                throw new Error('need Id');

            this.Id = id;

            if (jqueryElem) {
                this.SetPageViewByJQuery(jqueryElem);
            }

            this._className = 'ControllerBase';
        }

        public SetClassName(name: string): void {
            this._className = name;
        }

        public SetPageViewByJQuery(elem: JQuery): void {
            this.View = new Fw.Views.PageView(elem);
            this.IsDefaultView = (this.View.Elem.attr(Config.DefaultPageAttribute) === "true");

            if (this.IsDefaultView)
                this.View.Show();
        }

    }
}
