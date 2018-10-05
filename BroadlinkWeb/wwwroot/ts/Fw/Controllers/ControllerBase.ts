/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controllers {
    export abstract class ControllerBase implements Fw.Controllers.IController {
        public Id: string;
        public IsDefaultView: boolean;
        public View: Fw.Views.IView;
        public Manager: Fw.Controllers.Manager;

        constructor(jqueryElem: JQuery, manager: Fw.Controllers.Manager) {
            this.View = new Fw.Views.ControllerView(jqueryElem);
            this.Manager = manager;
            this.Id = this.View.Elem.data("controller");
            this.IsDefaultView = (this.View.Elem.data("default"));

            if (this.IsDefaultView)
                this.View.Elem.show();
        }
    }
}
