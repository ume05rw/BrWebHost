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
/// <reference path="../Views/Controls/SceneButtonView.ts" />
/// <reference path="../Views/Controls/ScheduleButtonView.ts" />
/// <reference path="../Views/Controls/IMainButtonView.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Entities/Scene.ts" />
/// <reference path="../Items/OperationTemplate.ts" />
/// <reference path="../Items/ControlSetTemplate.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/Icon.ts" />

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
    import SceneButtonView = App.Views.Controls.SceneButtonView;
    import ScheduleButtonView = App.Views.Controls.ScheduleButtonView;
    import IMainButtonView = App.Views.Controls.IMainButtonView;
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;

    export class MainController extends Fw.Controllers.ControllerBase {

        private _page: Pages.MainPageView;

        constructor() {
            super('Main');

            Dump.Log('Start MainController');

            this.SetClassName('MainController');
            this.SetPageView(new Pages.MainPageView());
            this._page = this.View as Pages.MainPageView;

            this.InitStores()
                .then(() => {
                    Dump.Log('SubController Load Start');
                    const controlSetCtr = new ControlSetController();
                    const controlHeaderPropertyCtr = new ControlHeaderPropertyController();
                    const controlPropertyCtr = new ControlPropertyController();

                    const a1SetCtr = new A1SetController();
                    const templateSelectCtr = new TemplateSelectController();

                    const sceneCtr = new SceneController();
                    const operationSelectStr = new OperationSelectController();
                    const sceneHeaderPropertyCtr = new SceneHeaderPropertyController();

                    const scheduleCtr = new ScheduleController();

                    const iconSelectCtr = new IconSelectController();
                    const colorSelectCtr = new ColorSelectController();

                    Dump.Log('SubController Load End');
                });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // ヘッダの追加ボタンクリック - 新規リモコンのテンプレート選択後に編集画面へ。
                const ctr = this.Manager.Get('TemplateSelect') as TemplateSelectController;
                const item: OperationTemplate = await ctr.Select(this);

                let ctrSet: App.Models.Entities.ControlSet;
                switch (item) {
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
                        ctrSet.Color = Color.ButtonColors[7];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.Free, true);
                        break;
                    case OperationTemplate.WoL:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.WakeOnLan;
                        ctrSet.Name = 'Wake on LAN';
                        ctrSet.Color = Color.ButtonColors[2];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.WoL, true);
                        ctrSet.Controls[0].Name = 'WoL';
                        ctrSet.Controls[0].Code = '';
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;
                    case OperationTemplate.Script:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.Script;
                        ctrSet.Name = 'Script';
                        ctrSet.Color = Color.ButtonColors[2];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.Script, true);
                        ctrSet.Controls[0].Name = 'Script';
                        ctrSet.Controls[0].Code = '';
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;
                    case OperationTemplate.RemoteHostScript:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.RemoteHostScript;
                        ctrSet.Name = 'Remote Script';
                        ctrSet.Color = Color.ButtonColors[2];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.RemoteHostScript, true);
                        ctrSet.Controls[0].Name = 'Remote';
                        ctrSet.Controls[0].Code = '';
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;

                    case OperationTemplate.Scene:
                        const ctr1 = this.Manager.Get('Scene') as SceneController;
                        const scene = new Entities.Scene();
                        const detail = new Entities.SceneDetail();
                        detail.Order = 1;
                        scene.Details.push(detail);
                        ctr1.SetEntity(scene);
                        ctr1.SetEditMode();
                        ctr1.Show();

                        // ※シーンとスケジュールのみ、対象Entity/起動画面が違う。このセクションでreturnする。
                        return;

                    case OperationTemplate.Schedule:
                        const ctr2 = this.Manager.Get('Schedule') as ScheduleController;
                        const schedule = new Entities.Schedule();
                        ctr2.SetEntity(schedule);
                        ctr2.SetEditMode();
                        ctr2.Show();

                        // ※シーンとスケジュールのみ、対象Entity/起動画面が違う。このセクションでreturnする。
                        return;

                    default:
                        alert('ここにはこないはず');
                        throw new Error('なんでやー！');
                }

                const ctr2 = App.Controllers.CSControllerFactory.Get(ctrSet);
                ctr2.SetEntity(ctrSet);
                ctr2.SetEditMode();
                ctr2.Show();
            });

            this._page.ControlSetPanel.AddEventListener(StuckerBoxEvents.OrderChanged, async () => {
                const csets = new Array<Entities.ControlSet>();
                let idx = 1;
                _.each(this._page.ControlSetPanel.Children, (btn: ControlSetButtonView) => {
                    if (!btn.Entity)
                        return;
                    (btn.Entity as Entities.ControlSet).Order = idx;
                    idx++;
                    csets.push(btn.Entity as Entities.ControlSet);
                });
                await Stores.ControlSets.UpdateHeaders(csets);
            });

            this._page.ScenePanel.AddEventListener(StuckerBoxEvents.OrderChanged, async () => {
                const scenes = new Array<Entities.Scene>();
                const schedules = new Array<Entities.Schedule>();
                let idx = 1;
                _.each(this._page.ScenePanel.Children, (btn: IMainButtonView) => {
                    if (!btn.Entity)
                        return;

                    (btn.Entity as (Entities.Scene | Entities.Schedule)).Order = idx;
                    idx++;

                    if (btn.Entity instanceof Entities.Scene)
                        scenes.push(btn.Entity);
                    else if (btn.Entity instanceof Entities.Schedule)
                        schedules.push(btn.Entity);

                });
                Stores.Scenes.UpdateHeaders(scenes);
                Stores.Schedules.UpdateHeaders(schedules);
            });
        }

        private async InitStores(): Promise<boolean> {

            Dump.Log('Store Initialize Start');

            // 各Storeにキャッシュしつつ描画。並列で行う。
            const promises: Promise<boolean>[] = [];
            promises.push(this.RefreshControlSets());
            promises.push(this.RefreshScenesAndSchedules());
            await Promise.all(promises);

            Dump.Log('Store Initialize End');

            return true;
        }

        public async RefreshControlSets(): Promise<boolean> {
            let sets: Array<Entities.ControlSet> = [];
            const promises: Promise<boolean>[] = [];
            promises.push((async () => {
                await Stores.BrDevices.GetList();
                return true;
            })());
            promises.push((async () => {
                sets = await Stores.ControlSets.GetListForMainPanel();
                return true;
            })());
            await Promise.all(promises);

            // 削除されたEntity分のボタンをパネルから削除。
            const children = Fw.Util.Obj.Mirror(this._page.ControlSetPanel.Children);
            _.each(children, (btn: ControlSetButtonView) => {
                const existsSet = _.find(sets, (cs: Entities.ControlSet) => {
                    return (cs === btn.Entity);
                });
                if (!existsSet) {
                    this._page.ControlSetPanel.Remove(btn);
                    btn.Dispose();
                }
            });

            // 追加されたEntity分のボタンをパネルに追加。
            _.each(sets, (cs: Entities.ControlSet) => {
                const existsBtn = _.find(children, (b: ControlSetButtonView) => {
                    return (b.Entity === cs);
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

                    const ctr = App.Controllers.CSControllerFactory.Get(button.Entity as Entities.ControlSet);

                    ctr.SetEntity(button.Entity as Entities.ControlSet);
                    ctr.SetExecMode();
                    ctr.ShowModal();
                });

                btn.Button.AddEventListener(ButtonEvents.LongClick, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ControlSetPanel.IsChildRelocation)
                        return;

                    // メインボタンの長押し - リモコンを編集表示する。
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const ctr = App.Controllers.CSControllerFactory.Get(button.Entity as Entities.ControlSet);
                    ctr.SetEntity(button.Entity as Entities.ControlSet);
                    ctr.SetEditMode();
                    ctr.Show();
                });

                btn.Toggle.AddEventListener(ToggleEvents.Changed, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ControlSetPanel.IsChildRelocation)
                        return;

                    // トグルクリック
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const cset = button.Entity as Entities.ControlSet;
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
                        return (csetBtn.Entity === cset);
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

        public async RefreshScenesAndSchedules(): Promise<boolean> {
            const promises: Promise<Array<Entities.Scene|Entities.Schedule>>[] = [];
            promises.push(Stores.Scenes.GetList());
            promises.push(Stores.Schedules.GetList());
            await Promise.all(promises);

            const entities: Array<Entities.Scene | Entities.Schedule> = [];
            _.each(Stores.Scenes.List, (e: Entities.Scene) => { entities.push(e); });
            _.each(Stores.Schedules.List, (e: Entities.Schedule) => { entities.push(e); });

            // 削除されたEntity分のボタンをパネルから削除。
            let children = Fw.Util.Obj.Mirror(this._page.ScenePanel.Children);
            _.each(children, (view: IMainButtonView) => {
                const entity = _.find(entities, (e: Entities.Scene | Entities.Schedule) => {
                    return (e === view.Entity);
                });
                if (!entity) {
                    this._page.ScenePanel.Remove(view);
                    view.Dispose();
                }
            });

            // 追加されたEntity分のボタンをパネルに追加。
            children = Fw.Util.Obj.Mirror(this._page.ScenePanel.Children);
            _.each(entities, (entity: Entities.Scene | Entities.Schedule) => {

                const existsBtn = _.find(children, (b: IMainButtonView) => {
                    return (b.Entity === entity);
                });
                if (existsBtn)
                    return;

                let btn: IMainButtonView;
                if (entity instanceof Entities.Scene)
                    btn = new SceneButtonView(entity);
                else if (entity instanceof Entities.Schedule)
                    btn = new ScheduleButtonView(entity);

                btn.Button.AddEventListener(ButtonEvents.SingleClick, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ScenePanel.IsChildRelocation)
                        return;

                    // シーンボタンクリック - シーンViewをスライドイン表示し、実行する。
                    const button = (e.Sender as Fw.Views.IView).Parent as IMainButtonView;

                    if (button.Entity instanceof Entities.Scene) {
                        const ctr = this.Manager.Get('Scene') as SceneController;
                        ctr.SetEntity(button.Entity as Entities.Scene);
                        ctr.SetExecMode();
                        ctr.ShowModal();
                        ctr.Exec();
                    } else if (button.Entity instanceof Entities.Schedule) {
                        const ctr = this.Manager.Get('Schedule') as ScheduleController;
                        ctr.SetEntity(button.Entity as Entities.Schedule);
                        ctr.SetExecMode();
                        ctr.ShowModal();
                    }
                });

                btn.Button.AddEventListener(ButtonEvents.LongClick, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ScenePanel.IsChildRelocation)
                        return;

                    // シーンボタン長押し - シーンViewを編集状態で表示する。
                    const button = (e.Sender as Fw.Views.IView).Parent as IMainButtonView;
                    if (button.Entity instanceof Entities.Scene) {
                        const ctr = this.Manager.Get('Scene') as SceneController;
                        ctr.SetEntity(button.Entity as Entities.Scene);
                        ctr.SetEditMode();
                        ctr.Show();
                    } else if (button.Entity instanceof Entities.Schedule) {
                        const ctr = this.Manager.Get('Schedule') as ScheduleController;
                        ctr.SetEntity(button.Entity as Entities.Schedule);
                        ctr.SetEditMode();
                        ctr.Show();
                    }
                });

                entity.AddEventListener(Events.EntityEvents.Changed, (e) => {
                    // ボタンに乗せたSceneEntityの値変更イベント
                    const senderEntity = e.Sender as (Entities.Scene | Entities.Schedule);
                    const btn: IMainButtonView = _.find(this._page.ScenePanel.Children, (b) => {
                        const mainButton = b as IMainButtonView;
                        return (mainButton.Entity === senderEntity);
                    }) as IMainButtonView;

                    if (!btn)
                        return;

                    btn.ApplyByEntity();
                });

                this._page.ScenePanel.Add(btn);
            });
            this._page.ScenePanel.Refresh();

            return true;
        }
    }
}
