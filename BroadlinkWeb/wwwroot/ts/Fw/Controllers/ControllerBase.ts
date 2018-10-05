/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controllers {
    export abstract class ControllerBase implements Fw.Controllers.IController {
        public Id: string;
        public IsDefaultView: boolean;
        public View: JQuery;
        public Manager: Fw.Controllers.Manager;

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            this.View = elem;
            this.Manager = manager;
            this.Id = this.View.data("controller");
            this.IsDefaultView = (this.View.data("default"));

            if (this.IsDefaultView)
                this.View.show();
        }
    }
}
