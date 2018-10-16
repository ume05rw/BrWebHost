/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Xhr = Fw.Util.Xhr;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Manager = Fw.Controllers.Manager;

    export class Sub3Controller extends Fw.Controllers.ControllerBase {

        constructor() {
            super('Sub3');

            this.SetPageView(new App.Views.Pages.Sub3PageView());
            const page = this.View as App.Views.Pages.Sub3PageView;

            page.HeaderBar.LeftButton.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                this.SwitchTo("Main");
            });


        }
    }
}