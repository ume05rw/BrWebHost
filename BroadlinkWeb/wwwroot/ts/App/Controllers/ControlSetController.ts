/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;

    export class ControlSetController extends Fw.Controllers.ControllerBase {

        constructor() {
            super('ControlSet');

            this.SetClassName('ControlSetController');

            this.View = new Pages.ControlSetPageView();
            const page = this.View as Pages.ControlSetPageView;

            page.HeaderBar.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                Manager.Instance.Show("Main");
            });
        }
    }
}