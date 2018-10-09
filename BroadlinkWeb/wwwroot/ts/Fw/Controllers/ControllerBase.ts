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
        public View: Fw.Views.IView;

        constructor(jqueryElem: JQuery) {
            this.View = new Fw.Views.PageView(jqueryElem);
            this.Id = this.View.Elem.attr(Config.PageIdAttribute);
            this.IsDefaultView = (this.View.Elem.attr(Config.DefaultPageAttribute) === "true");

            if (this.IsDefaultView)
                this.View.Show();
        }
    }
}
