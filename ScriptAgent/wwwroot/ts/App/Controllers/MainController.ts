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
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Stores/ControlSetStore.ts" />
/// <reference path="../Items/OperationTemplate.ts" />
/// <reference path="../Items/ControlSetTemplate.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/Icon.ts" />
/// <reference path="../Items/Lang/Lang.ts" />

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
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;
    import Lang = App.Items.Lang.Lang;

    export class MainController extends Fw.Controllers.ControllerBase {

        private _page: Pages.MainPageView;

        constructor() {
            super('Main');

            Dump.Log('Start MainController');

            this.SetClassName('MainController');
            this.SetPageView(new Pages.MainPageView());
            this._page = this.View as Pages.MainPageView;

            this.InitStores()
                .then(async () => {
                    // ホスト名をセットする。
                    const hostname = await Stores.Remotes.GetHostname();
                    if (hostname != null) {
                        this._page.HeaderBar.Text = Lang.TitleScriptAgent + ' - ' + hostname;
                        this._page.HeaderBar.Refresh();
                    }

                    Dump.Log('SubController Load Start');
                    const controlSetCtr = new ControlSetController();

                    const controlHeaderPropertyCtr = new ControlHeaderPropertyController();
                    const controlPropertyCtr = new ControlPropertyController();
                    const iconSelectCtr = new IconSelectController();
                    const colorSelectCtr = new ColorSelectController();

                    Dump.Log('SubController Load End');
                });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // ヘッダの追加ボタンクリック - 新規スクリプト編集画面へ。
                let ctrSet: App.Models.Entities.ControlSet;
                ctrSet = await Stores.ControlSets.GetTemplateClone(ControlSetTemplate.SingleControl);
                ctrSet.OperationType = OperationType.Script;
                ctrSet.Name = 'Script';
                ctrSet.Color = Color.ButtonColors[2];
                ctrSet.IconUrl = Icon.GetByOperationTemplate(OperationTemplate.Script, true);
                ctrSet.Controls[0].Name = 'Script1';
                ctrSet.Controls[0].Code = '';
                ctrSet.Controls[0].IsAssignToggleOn = true;
                ctrSet.Controls[0].IsAssignToggleOff = true;

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
        }

        private async InitStores(): Promise<boolean> {

            Dump.Log('Store Initialize Start');

            await this.RefreshControlSets();

            Dump.Log('Store Initialize - ControlSets OK.');

            Dump.Log('Store Initialize End');

            return true;
        }

        public async RefreshControlSets(): Promise<boolean> {
            const sets = await Stores.ControlSets.GetListForMainPanel();

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

                this._page.ControlSetPanel.Add(btn);
            });
            this._page.ControlSetPanel.Refresh();

            return true;
        }
    }
}
