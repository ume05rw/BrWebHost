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
        }

        private async InitStores(): Promise<boolean> {

            await Stores.BrDevices.GetList();

            await this.RefreshControlSets();

            // これはawaitしない。
            //Stores.BrDevices.Discover();

            return true;
        }

        public async RefreshControlSets(): Promise<boolean> {
            const sets = await Stores.ControlSets.GetListWithoutTemplates();

            // 既存メインボタンを全削除。そのうち改善する。
            const children = Fw.Util.Obj.Mirror(this._page.ControlSetPanel.Children);
            _.each(children, (v: ControlSetButtonView) => {
                this._page.ControlSetPanel.Remove(v);
                v.Dispose();
            });

            _.each(sets, (cs: Entities.ControlSet) => {

                if (!cs.IsMainPanelReady)
                    return;

                const btn = new ControlSetButtonView(cs);

                if (!cs.IsTogglable) {
                    btn.Toggle.Hide(0);
                }

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

                    if (cset.ToggleState !== btn.Toggle.BoolValue)
                        btn.Toggle.SetBoolValue(cset.ToggleState, false);

                    if (cset.Name !== btn.Label.Text)
                        btn.Label.Text = cset.Name;

                    if (cset.Color !== btn.Button.Color) {
                        btn.Button.BackgroundColor = cset.Color;
                        btn.Button.Color = cset.Color;
                        btn.Button.HoverColor = cset.HoverColor;
                    }

                    if (cset.IconUrl !== btn.Button.ImageSrc)
                        btn.Button.ImageSrc = cset.IconUrl;
                });

                this._page.ControlSetPanel.Add(btn);

                if (cs.IsBrDevice) {
                    // Broadlinkデバイスのとき
                    // 現在の値を取得する。

                    // 対応するデバイスを取得
                    const pairedDev = Stores.BrDevices.Get(cs.BrDeviceId);
                    const delay = 5000;

                    switch (pairedDev.DeviceType) {
                        case App.Items.BrDeviceType.A1:
                            // コマンドは一つだけ - 現在の値を取得
                            _.delay(() => {
                                Stores.A1s.Get(cs);
                            }, delay);
                            break;

                        case App.Items.BrDeviceType.Sp2:
                            // コマンドはControlごとに。
                            _.delay(() => {
                                Stores.Sp2s.Get(cs);
                            }, delay);
                            break;

                        case App.Items.BrDeviceType.Rm2Pro:
                            // コマンドは一つだけ - 現在の値を取得
                            _.delay(() => {
                                Stores.Rm2Pros.GetTemperature(cs);
                            }, delay);
                            break;


                        // 以降、未対応。
                        case App.Items.BrDeviceType.Rm:
                        case App.Items.BrDeviceType.Dooya:
                        case App.Items.BrDeviceType.Hysen:
                        case App.Items.BrDeviceType.Mp1:
                        case App.Items.BrDeviceType.S1c:
                        case App.Items.BrDeviceType.Sp1:
                        case App.Items.BrDeviceType.Unknown:
                        default:
                            break;
                    }
                }
            });
            this._page.ControlSetPanel.Refresh();

            return true;
        }
    }
}
