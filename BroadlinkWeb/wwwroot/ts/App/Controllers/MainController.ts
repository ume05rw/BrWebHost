/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Events/ToggleButtonInputViewEvents.ts" />
/// <reference path="../../Fw/Events/StuckerBoxViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Controls/ControlSetButtonView.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Items/Operation.ts" />
/// <reference path="../Items/ControlSetTemplate.ts" />
/// <reference path="../Items/ControlType.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import ToggleEvents = Fw.Events.ToggleButtonInputViewEvents;
    import StuckerBoxEvents = Fw.Events.StuckerBoxViewEvents;
    import Stores = App.Models.Stores;
    import Entities = App.Models.Entities;
    import Operation = App.Items.Operation;
    import ControlSetTemplate = App.Items.ControlSetTemplate;
    import ControlSetButtonView = App.Views.Controls.ControlSetButtonView;
    import ControlType = App.Items.ControlType;

    export class MainController extends Fw.Controllers.ControllerBase {

        private _page: Pages.MainPageView;

        constructor() {
            super('Main');

            Dump.Log('Start MainController');

            this.SetClassName('MainController');
            this.SetPageView(new Pages.MainPageView());
            this._page = this.View as Pages.MainPageView;

            Dump.Log('Store Initialize Start');
            this.InitStores()
                .then(() => {
                    Dump.Log('SubController Load Start');
                    const controlSetCtr = new ControlSetController();
                    const functionSelectCtr = new OperationSelectController();

                    const controlHeaderPropertyCtr = new ControlHeaderPropertyController();
                    const controlPropertyCtr = new ControlPropertyController();
                    const iconSelectCtr = new IconSelectController();
                    const colorSelectCtr = new ColorSelectController();

                    const sub1Ctr = new Sub1Controller();
                    const sub2Ctr = new Sub2Controller();
                    const sub3Ctr = new Sub3Controller();
                    Dump.Log('SubController Load End');
                });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // ヘッダの追加ボタンクリック - 新規リモコンのテンプレート選択後に編集画面へ。
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
                ctr2.SetEditMode();
                ctr2.Show();
            });

            this._page.BtnGoSub1.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Manager.Get("Sub1").Show();
            });

            this._page.BtnGoSub2.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Manager.Get("Sub2").Show();
            });

            this._page.BtnGoSub3.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Manager.Get("Sub3").Show();
            });

            this._page.BtnGoDynamic.AddEventListener(ButtonEvents.SingleClick, () => {
                const ctr = new LayoutCheckController('LayoutCheck');
                ctr.Show();

                // TODO: 二回目以降で落ちる。処理後にControllerをDisposeするフローを考える。
            });

            this._page.ControlSetPanel.AddEventListener(StuckerBoxEvents.OrderChanged, () => {
                //alert('Fuck!');
                const csets = new Array<Entities.ControlSet>();
                let idx = 1;
                _.each(this._page.ControlSetPanel.Children, (btn: ControlSetButtonView) => {
                    if (!btn.ControlSet)
                        return;
                    btn.ControlSet.Order = idx;
                    idx++;
                    csets.push(btn.ControlSet);
                });
                Stores.ControlSets.UpdateHeaders(csets);
            });
        }

        private async InitStores(): Promise<boolean> {

            await Stores.BrDevices.GetList();

            await this.RefreshControlSets();

            return true;
        }

        public async RefreshControlSets(): Promise<boolean> {
            const sets = await Stores.ControlSets.GetListForMainPanel();

            // 削除されたEntity分のボタンをパネルから削除。
            const children = Fw.Util.Obj.Mirror(this._page.ControlSetPanel.Children);
            _.each(children, (btn: ControlSetButtonView) => {
                const existsSet = _.find(sets, (cs: Entities.ControlSet) => {
                    return (cs === btn.ControlSet);
                });
                if (!existsSet) {
                    this._page.ControlSetPanel.Remove(btn);
                    btn.Dispose();
                }
            });

            // 追加されたEntity分のボタンをパネルに追加。
            _.each(sets, (cs: Entities.ControlSet) => {
                const existsBtn = _.find(children, (b: ControlSetButtonView) => {
                    return (b.ControlSet === cs);
                });
                if (existsBtn)
                    return;

                const btn = new ControlSetButtonView(cs);

                btn.Button.AddEventListener(ButtonEvents.SingleClick, (e) => {
                    // メインボタンクリック - リモコンをスライドイン表示する。
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                    ctr.SetEntity(button.ControlSet);
                    ctr.SetOperateMode();
                    ctr.ShowModal();
                });

                btn.Toggle.AddEventListener(ToggleEvents.Changed, (e) => {
                    // トグルクリック
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const cset = button.ControlSet;
                    const toggleValue = button.Toggle.BoolValue;

                    const controlOn: Entities.Control = _.find(cset.Controls as any, (c) => {
                        const ct = c as Entities.Control;
                        return ct.IsAssignToggleOn;;
                    });
                    const controlOff: Entities.Control = _.find(cset.Controls as any, (c) => {
                        const ct = c as Entities.Control;
                        return ct.IsAssignToggleOff;
                    });
                    const targetControl = (toggleValue)
                        ? controlOn
                        : controlOff;

                    Stores.BrDevices.Exec(cset, targetControl);



                });

                cs.AddEventListener(Events.EntityEvents.Changed, (e) => {
                    // ボタンに乗せたControlSetEntityの値変更イベント
                    const cset = e.Sender as Entities.ControlSet
                    const btn: ControlSetButtonView = _.find(this._page.ControlSetPanel.Children, (b) => {
                        const csetBtn = b as ControlSetButtonView;
                        return (csetBtn.ControlSet === cset);
                    }) as ControlSetButtonView;

                    if (!btn)
                        return;

                    btn.ApplyEntity();
                });

                if (cs.ControlType === ControlType.BroadlinkDevice)
                    btn.ApplyBrDeviceStatus();

                this._page.ControlSetPanel.Add(btn);
            });
            this._page.ControlSetPanel.Refresh();

            return true;
        }
    }
}
