/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controller {
    export class ControllerBase implements Fw.Controller.IController {
        public Id: string;
        public IsDefaultView: boolean;
        public View: JQuery;
        public Manager: Fw.Controller.Manager;

        constructor(elem: JQuery, manager: Fw.Controller.Manager) {
            this.View = elem;
            this.Manager = manager;
            this.Id = this.View.data("viewclass");
            this.IsDefaultView = (this.View.data("defaultview"));

            if (this.IsDefaultView)
                this.View.show();
        }
    }
}
