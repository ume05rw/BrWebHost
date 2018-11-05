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
                    const a1SetCtr = new A1SetController();
                    const functionSelectCtr = new OperationSelectController();

                    const controlHeaderPropertyCtr = new ControlHeaderPropertyController();
                    const controlPropertyCtr = new ControlPropertyController();
                    const iconSelectCtr = new IconSelectController();
                    const colorSelectCtr = new ColorSelectController();

                    const sceneCtr = new SceneController();
                    const controlSetSelectStr = new ControlSetSelectController();
                    const sceneHeaderPropertyCtr = new SceneHeaderPropertyController();

                    Dump.Log('SubController Load End');
                });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // ヘッダの追加ボタンクリック - 新規リモコンのテンプレート選択後に編集画面へ。
                const ctr = this.Manager.Get('OperationSelect') as OperationSelectController;
                const item: OperationTemplate = await ctr.Select(this);

                let ctrSet: App.Models.Entities.ControlSet;
                switch (item) {
                    case OperationTemplate.Scene:
                        
                        //alert('Not Implemented!!');
                        const ctr = this.Manager.Get('Scene') as SceneController;
                        const scene = new Entities.Scene();
                        const detail = new Entities.SceneDetail();
                        detail.Order = 1;
                        scene.Details.push(detail);
                        ctr.SetEntity(scene);
                        ctr.SetEditMode();
                        ctr.Show();

                        // ※シーンのみ、対象Entity/起動画面が違う。このセクションでreturnする。
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
                        ctrSet.Color = Color.ButtonColors[7];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.Free, true);
                        break;
                    case OperationTemplate.WoL:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.WakeOnLan;
                        ctrSet.Name = 'WoL';
                        ctrSet.Color = Color.ButtonColors[2];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.WoL, true);
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;
                    case OperationTemplate.Script:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.Script;
                        ctrSet.Name = 'Script';
                        ctrSet.Color = Color.ButtonColors[2];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.Script, true);
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;
                    case OperationTemplate.RemoteHostScript:
                        ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                        ctrSet.OperationType = OperationType.RemoteHostScript;
                        ctrSet.Name = 'Remote Script';
                        ctrSet.Color = Color.ButtonColors[2];
                        ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.RemoteHostScript, true);
                        ctrSet.Controls[0].IsAssignToggleOn = true;
                        ctrSet.Controls[0].IsAssignToggleOff = true;
                        break;

                    default:
                        alert('ここにはこないはず');
                        throw new Error('なんでやー！');
                }

                const ctr2 = App.Controllers.CSControllerFactory.Get(ctrSet);
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

            Dump.Log('Store Initialize Start');

            await Stores.BrDevices.GetList();

            Dump.Log('Store Initialize - BrDevices OK.');

            // ControlSetとSceneは並列に実行する。
            //await this.RefreshControlSets();
            //await this.RefreshScenes();
            const promises: Promise<boolean>[] = [];
            promises.push(this.RefreshControlSets());
            promises.push(this.RefreshScenes());
            await Promise.all(promises);

            Dump.Log('Store Initialize - ControlSets/Scenes OK.');

            Dump.Log('Store Initialize End');

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

                    const ctr = App.Controllers.CSControllerFactory.Get(button.ControlSet);

                    ctr.SetEntity(button.ControlSet);
                    ctr.SetExecMode();
                    ctr.ShowModal();
                });

                btn.Button.AddEventListener(ButtonEvents.LongClick, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ControlSetPanel.IsChildRelocation)
                        return;

                    // メインボタンの長押し - リモコンを編集表示する。
                    const button = (e.Sender as Fw.Views.IView).Parent as ControlSetButtonView;
                    const ctr = App.Controllers.CSControllerFactory.Get(button.ControlSet);
                    ctr.SetEntity(button.ControlSet);
                    ctr.SetEditMode();
                    ctr.Show();
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

        public async RefreshScenes(): Promise<boolean> {
            const scenes = await Stores.Scenes.GetList();

            // 削除されたEntity分のボタンをパネルから削除。
            const children = Fw.Util.Obj.Mirror(this._page.ScenePanel.Children);
            _.each(children, (btn: SceneButtonView) => {
                const existsSet = _.find(scenes, (s: Entities.Scene) => {
                    return (s === btn.Scene);
                });
                if (!existsSet) {
                    this._page.ScenePanel.Remove(btn);
                    btn.Dispose();
                }
            });

            // 追加されたEntity分のボタンをパネルに追加。
            _.each(scenes, (scene: Entities.Scene) => {
                const existsBtn = _.find(children, (b: SceneButtonView) => {
                    return (b.Scene === scene);
                });
                if (existsBtn)
                    return;

                const btn = new SceneButtonView(scene);

                btn.Button.AddEventListener(ButtonEvents.SingleClick, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ScenePanel.IsChildRelocation)
                        return;

                    // シーンボタンクリック - シーンViewをスライドイン表示し、実行する。
                    const button = (e.Sender as Fw.Views.IView).Parent as SceneButtonView;
                    const ctr = this.Manager.Get('Scene') as SceneController;
                    ctr.SetEntity(button.Scene);
                    ctr.SetExecMode();
                    ctr.ShowModal();
                    ctr.Exec();
                });

                btn.Button.AddEventListener(ButtonEvents.LongClick, (e) => {
                    // 子View再配置中のとき、何もしない。
                    if (this._page.ScenePanel.IsChildRelocation)
                        return;

                    // シーンボタン長押し - シーンViewを編集状態で表示する。
                    const button = (e.Sender as Fw.Views.IView).Parent as SceneButtonView;
                    const ctr = this.Manager.Get('Scene') as SceneController;
                    ctr.SetEntity(button.Scene);
                    ctr.SetEditMode();
                    ctr.Show();
                });

                scene.AddEventListener(Events.EntityEvents.Changed, (e) => {
                    // ボタンに乗せたControlSetEntityの値変更イベント
                    const sc = e.Sender as Entities.Scene
                    const btn: SceneButtonView = _.find(this._page.ScenePanel.Children, (b) => {
                        const sceneBtn = b as SceneButtonView;
                        return (sceneBtn.Scene === sc);
                    }) as SceneButtonView;

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
