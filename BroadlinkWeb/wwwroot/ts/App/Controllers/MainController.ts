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

    export class MainController extends Fw.Controllers.ControllerBase {

        constructor() {
            super('Main');

            this.SetClassName('MainController');

            const sub3Ctr = new Sub3Controller();
            const controlSetCtr = new ControlSetController();

            this.SetPageView(new Pages.MainPageView());
            const page = this.View as Pages.MainPageView;

            page.HeaderBar.RightButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                //this.SwitchTo("ControlSet");
                this.SetModal('ControlSet');
            });

            page.BtnGoSub1.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                this.SwitchTo("Sub1");
            });

            page.BtnGoSub2.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                this.SwitchTo("Sub2");
            });

            page.BtnGoSub3.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                this.SwitchTo("Sub3");
            });

            page.BtnGoDynamic.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                const ctr = new LayoutCheckController('LayoutCheck');
                this.SwitchController(ctr);

                // TODO: 二回目以降で落ちる。処理後にControllerをDisposeするフローを考える。
            });
        }
    }
}