/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="IController.ts" />
/// <reference path="Manager.ts" />
/* /// <reference path="../Views/PageView.ts" /> */

namespace Fw.Controllers {
    import Dump = Fw.Util.Dump;

    export abstract class ControllerBase implements Fw.Controllers.IController {
        public Id: string;
        public IsDefaultView: boolean;
        public View: Fw.Views.IView;
        public Manager: Fw.Controllers.Manager;

        constructor(jqueryElem: JQuery, manager: Fw.Controllers.Manager) {
            this.View = new Fw.Views.PageView(jqueryElem);
            this.Manager = manager;
            this.Id = this.View.Elem.data("controller");
            this.IsDefaultView = (this.View.Elem.data("default"));

            if (this.IsDefaultView)
                this.View.Show();
        }
    }
}
