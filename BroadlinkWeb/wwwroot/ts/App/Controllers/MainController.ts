/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import ButtonEvents = Fw.Events.ButtonViewEvents;

    export class MainController extends Fw.Controllers.ControllerBase {

        constructor() {
            super('Main');

            this.SetClassName('MainController');

            Dump.Log('SubController Load Start');
            const sub1Ctr = new Sub1Controller();
            const sub2Ctr = new Sub2Controller();
            const sub3Ctr = new Sub3Controller();
            const controlSetCtr = new ControlSetController();
            const controlPropertyCtr = new ControlPropertyController();
            const controlHeaderPropertyCtr = new ControlHeaderPropertyController();
            const functionSelectCtr = new OperationSelectController();
            const iconSelectCtr = new IconSelectController();
            const colorSelectCtr = new ColorSelectController();
            Dump.Log('SubController Load End');

            this.SetPageView(new Pages.MainPageView());
            const page = this.View as Pages.MainPageView;

            page.BottomPanel.EnableLog = true;

            page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {

                // TODO: 仮実装-実際は、シーンorリモコン、リモコン種選択をさせたあと、
                // リモコン編集画面に遷移。

                //const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                //ctr.SetEntity(new App.Models.Entities.ControlSet());
                //ctr.SetModal();
                ////this.SwitchTo('ControlSet');


                const ctr = this.Manager.Get('OperationSelect') as OperationSelectController;
                const item: App.Itmes.Operation = await ctr.Select(this);

                const ctr2 = this.Manager.Get('ControlSet') as ControlSetController;
                ctr2.SetEntity(new App.Models.Entities.ControlSet());
                ctr2.SetModal();
                //this.SwitchTo('ControlSet');

            });

            page.BtnGoSub1.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SwitchTo("Sub1");
            });

            page.BtnGoSub2.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SwitchTo("Sub2");
            });

            page.BtnGoSub3.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SwitchTo("Sub3");
            });

            page.BtnGoDynamic.AddEventListener(ButtonEvents.SingleClick, () => {
                const ctr = new LayoutCheckController('LayoutCheck');
                this.SwitchController(ctr);

                // TODO: 二回目以降で落ちる。処理後にControllerをDisposeするフローを考える。
            });
        }
    }
}
