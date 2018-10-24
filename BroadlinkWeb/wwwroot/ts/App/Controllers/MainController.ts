/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Events/ToggleButtonInputViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Controls/ControlSetButtonView.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Items/Operation.ts" />
/// <reference path="../Items/ControlSetTemplate.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import ToggleEvents = Fw.Events.ToggleButtonInputViewEvents;
    import Stores = App.Models.Stores;
    import Entities = App.Models.Entities;
    import Operation = App.Items.Operation;
    import ControlSetTemplate = App.Items.ControlSetTemplate;
    import ControlSetButtonView = App.Views.Controls.ControlSetButtonView;

    export class MainController extends Fw.Controllers.ControllerBase {

        private _page: Pages.MainPageView;

        constructor() {
            super('Main');

            Dump.Log('Start MainController');

            this.SetClassName('MainController');
            this.SetPageView(new Pages.MainPageView());
            this._page = this.View as Pages.MainPageView;

            this.InitStores(); // awaitしないで続行。
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



            //this._page.EnableLog = true;
            //this._page.BottomPanel.EnableLog = true;

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {

                const ctr = this.Manager.Get('OperationSelect') as OperationSelectController;
                const item: Operation = await ctr.Select(this);

                let ctrSet: App.Models.Entities.ControlSet;
                switch (item) {
                    case Operation.Scene:
                        Dump.Log('Not Implemented!!');
                        return;
                    case Operation.Tv:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.Tv);
                        break;
                    case Operation.Av:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.Av);
                        break;
                    case Operation.Light:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.Light);
                        break;
                    case Operation.Free:
                        ctrSet = new App.Models.Entities.ControlSet();
                        break;
                    default:
                        Dump.Log('Not Implemented!!');
                        return;
                }

                const ctr2 = this.Manager.Get('ControlSet') as ControlSetController;
                ctr2.SetEntity(ctrSet);
                //ctr2.SetModal();
                this.SwitchController(ctr2);
            });

            this._page.BtnGoSub1.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SwitchTo("Sub1");
            });

            this._page.BtnGoSub2.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SwitchTo("Sub2");
            });

            this._page.BtnGoSub3.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SwitchTo("Sub3");
            });

            this._page.BtnGoDynamic.AddEventListener(ButtonEvents.SingleClick, () => {
                const ctr = new LayoutCheckController('LayoutCheck');
                this.SwitchController(ctr);

                // TODO: 二回目以降で落ちる。処理後にControllerをDisposeするフローを考える。
            });
        }

        private async InitStores(): Promise<boolean> {
            Dump.Log('InitStores Start');
            await Stores.BrDevices.Discover();

            await this.RefreshControlSets();
            Dump.Log('InitStores End');
            return true;
        }

        public async RefreshControlSets(): Promise<boolean> {
            const sets = await Stores.ControlSets.GetListWithoutTemplates();

            const children = Fw.Util.Obj.Mirror(this._page.ControlSetPanel.Children);
            _.each(children, (v: ControlSetButtonView) => {
                this._page.ControlSetPanel.Remove(v);
                v.Dispose();
            });

            _.each(sets, (cs: Entities.ControlSet) => {
                const btn = new ControlSetButtonView(cs);
                btn.Button.AddEventListener(ButtonEvents.SingleClick, (je, eo) => {
                    je.preventDefault();
                    je.stopPropagation();
                    const button = (eo.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const ctr2 = this.Manager.Get('ControlSet') as ControlSetController;
                    ctr2.SetEntity(button.ControlSet);
                    ctr2.SetModal();
                });
                btn.Toggle.AddEventListener(ToggleEvents.Changed, (je, eo) => {
                    je.preventDefault();
                    je.stopPropagation();
                    const button = (eo.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    Dump.Log('Toggle Changed!!: ' + button.Toggle.Value);
                });

                this._page.ControlSetPanel.Add(btn);
            });
            this._page.ControlSetPanel.Refresh();

            return true;
        }
    }
}
