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
/// <reference path="../Items/OperationTemplate.ts" />
/// <reference path="../Items/ControlSetTemplate.ts" />
/// <reference path="../Items/OperationType.ts" />

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
    import OperationTemplate = App.Items.OperationTemplate;
    import ControlSetTemplate = App.Items.ControlSetTemplate;
    import ControlSetButtonView = App.Views.Controls.ControlSetButtonView;
    import OperationType = App.Items.OperationType;

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

                    const sceneCtr = new SceneController();

                    Dump.Log('SubController Load End');
                });


            for (let i = 0; i < 5; i++) {
                const btn = new App.Views.Controls.SceneButtonView();
                btn.Label.Text = `Scene ${i + 1}`;
                btn.Button.AddEventListener(ButtonEvents.SingleClick, async () => {
                    const ctr = this.Manager.Get('Scene') as SceneController;
                    ctr.SetOperateMode();
                    ctr.ShowModal();
                });

                this._page.ScenePanel.Add(btn);
            }




            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // ヘッダの追加ボタンクリック - 新規リモコンのテンプレート選択後に編集画面へ。
                const ctr = this.Manager.Get('OperationSelect') as OperationSelectController;
                const item: OperationTemplate = await ctr.Select(this);

                let ctrSet: App.Models.Entities.ControlSet;
                switch (item) {
                    case OperationTemplate.Scene:
                        alert('Not Implemented!!');
                        return;
                    case OperationTemplate.Tv:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.Tv);
                        break;
                    case OperationTemplate.Av:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.Av);
                        break;
                    case OperationTemplate.Light:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.Light);
                        break;
                    case OperationTemplate.Free:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.NoControl);
                        ctrSet.OperationType = OperationType.RemoteControl;
                        ctrSet.Name = 'Free Edit';
                        ctrSet.Color = App.Items.Color.ButtonColors[7];
                        ctrSet.IconUrl = 'images/icons/controlset/free.png';
                        break;
                    case OperationTemplate.WoL:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.WakeOnLan;
                        ctrSet.Name = 'WoL';
                        ctrSet.Color = App.Items.Color.ButtonColors[2];
                        ctrSet.IconUrl = 'images/icons/controlset/wol.png';
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;
                    case OperationTemplate.Script:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.Script;
                        ctrSet.Name = 'Script';
                        ctrSet.Color = App.Items.Color.ButtonColors[2];
                        ctrSet.IconUrl = 'images/icons/controlset/script.png';
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;
                    case OperationTemplate.RemoteHostScript:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.RemoteHostScript;
                        ctrSet.Name = 'Remote Script';
                        ctrSet.Color = App.Items.Color.ButtonColors[2];
                        ctrSet.IconUrl = 'images/icons/controlset/remote.png';
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;

                    default:
                        alert('Not Implemented!!');
                        return;
                }

                const ctr2 = this.Manager.Get('ControlSet') as ControlSetController;
                ctr2.SetEntity(ctrSet);
                ctr2.SetEditMode();
                ctr2.Show();
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
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ControlSetPanel.IsChildRelocation)
                        return;

                    // メインボタンクリック - リモコンをスライドイン表示する。
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                    ctr.SetEntity(button.ControlSet);
                    ctr.SetExecMode();
                    ctr.ShowModal();
                });

                btn.Toggle.AddEventListener(ToggleEvents.Changed, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ControlSetPanel.IsChildRelocation)
                        return;

                    // トグルクリック
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const cset = button.ControlSet;
                    const toggleValue = button.Toggle.BoolValue;

                    const controlOn: Entities.Control = _.find(cset.Controls as any, (c) => {
                        const ct = c as Entities.Control;
                        return ct.IsAssignToggleOn;
                    });
                    const controlOff: Entities.Control = _.find(cset.Controls as any, (c) => {
                        const ct = c as Entities.Control;
                        return ct.IsAssignToggleOff;
                    });
                    const targetControl = (toggleValue)
                        ? controlOn
                        : controlOff;

                    Stores.Operations.Exec(cset, targetControl);
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

                    btn.ApplyByEntity();
                });

                if (cs.OperationType === OperationType.BroadlinkDevice)
                    btn.ApplyBrDeviceStatus();

                this._page.ControlSetPanel.Add(btn);
            });
            this._page.ControlSetPanel.Refresh();

            return true;
        }
    }
}
