/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Events/Controls/ControlButtonViewEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import Util = Fw.Util;
    import EntityEvents = Fw.Events.EntityEvents;
    import ButtonViewEvents = Fw.Events.ButtonViewEvents;
    import ControlButtonViewEvents = App.Events.Controls.ControlButtonViewEvents;

    export class ControlSetController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlSetPageView;
        private _controlSet: App.Models.Entities.ControlSet;

        /**
         * 現在リモコン編集中か否か
         */
        private get IsOnEditMode(): boolean {
            // 編集ボタンが見えているとき操作モード。非表示のとき編集モード
            return !this._page.EditButton.IsVisible;
        }

        constructor() {
            super('ControlSet');

            this.SetClassName('ControlSetController');

            this.SetPageView(new Pages.ControlSetPageView());
            this._page = this.View as Pages.ControlSetPageView;

            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.LeftButton.AddEventListener(ButtonViewEvents.SingleClick, async () => {
                // 編集モードの状態で、戻るボタンクリック。
                // ここでControlSetエンティティを保存する。

                const controlSet = this._controlSet;
                this.SwitchTo("Main");
                this._controlSet = null;

                // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
                const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
                _.each(buttons, (btn: Fw.Views.IView) => {
                    this._page.ButtonPanel.Remove(btn);
                    btn.Dispose();
                });

                // 登録処理、結果を確認せず画面を閉じる。
                let isSave = true;
                if (controlSet.Controls.length <= 0) {
                    isSave = await App.Views.Popup.Confirm.OpenAsync({
                        Message: 'No buttons.<br/>Save OK?'
                    });
                }

                if (!isSave)
                    return;

                const res = await App.Models.Stores.ControlSets.Write(controlSet);
            });

            this._page.EditButton.AddEventListener(ButtonViewEvents.SingleClick, () => {
                this.SetUnmodal();
            });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonViewEvents.SingleClick, (e) => {
                this.OnOrderedNewControl(e);
            });

            this._page.HeaderBar.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });
            this._page.HeaderBar.Label.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });
        }

        /**
         * 操作対象リモコンEnttiyをセットする。
         * @param entity
         */
        public SetEntity(entity: App.Models.Entities.ControlSet): void {

            if (this._controlSet) {
                this._controlSet.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._controlSet = entity;

            if (this._controlSet) {
                this._controlSet.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

                _.each(this._controlSet.Controls, (control) => {
                    const btn = new Controls.ControlButtonView();
                    btn.Control = control;
                    btn.SetLeftTop(control.PositionLeft, control.PositionTop);
                    btn.SetColor(control.Color);
                    btn.SetImage(control.IconUrl);

                    btn.AddEventListener(ControlButtonViewEvents.EditOrdered, (e, p) => {
                        this.Log(p);
                        const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                        const button = p.Sender as Controls.ControlButtonView;
                        ctr.SetEntity(button.Control);
                        ctr.SetModal();
                    }, this);

                    btn.AddEventListener(ControlButtonViewEvents.ExecOrdered, (e, p) => {
                        this.Log(p);
                    }, this);

                    this._page.ButtonPanel.Add(btn);
                });
            }

            this.ApplyFromEntity();
        }

        private ApplyFromEntity(): void {
            if (!this._controlSet)
                return;

            this._page.HeaderBar.Text = this._controlSet.Name;
        }

        /**
         * リモコンボタン追加指示
         * @param e
         */
        private OnOrderedNewControl(e: JQueryEventObject): void {
            if (!this.IsOnEditMode)
                return;

            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            const control = new App.Models.Entities.Control();
            control.ControlSetId = this._controlSet.Id;
            this._controlSet.Controls.push(control);

            const btn = new Controls.ControlButtonView();
            btn.Control = control;
            btn.SetLeftTop(185, this._page.Size.Height - 90 - 75);

            btn.AddEventListener(ControlButtonViewEvents.EditOrdered, (e, p) => {
                // ボタン編集指示
                const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                const button = p.Sender as Controls.ControlButtonView;
                ctr.SetEntity(button.Control);
                ctr.SetModal();
            }, this);

            btn.AddEventListener(ControlButtonViewEvents.ExecOrdered, (e, p) => {
                // ボタン実行指示
                this.Log('TODO: コード送信');
            }, this);

            this._page.ButtonPanel.Add(btn);

            // 再配置可能指示はパネルにaddした後で。
            btn.SetRelocatable(true);
        }

        /**
         * リモコンヘッダ情報の編集指示
         * @param e
         */
        private OnOrderedHeader(e: JQueryEventObject): void {
            if (e.eventPhase !== 2)
                return;

            if (!this.IsOnEditMode)
                return;

            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            const ctr = this.Manager.Get('ControlHeaderProperty') as ControlHeaderPropertyController;
            ctr.SetEntity(this._controlSet);
            ctr.SetModal();
        }

        /**
         * リモコンボタンを一つ削除する。
         * @param control
         */
        public RemoveControl(control: App.Models.Entities.Control): void {
            if (!this.IsOnEditMode)
                return;

            // View側削除処理
            const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(buttons, (btn: Controls.ControlButtonView) => {
                if (btn.Control === control) {
                    this._page.ButtonPanel.Remove(btn);
                    btn.Dispose();
                }
            });

            // Model側削除処理
            const idx = this._controlSet.Controls.indexOf(control);
            if (idx !== -1) {
                this._controlSet.Controls.splice(idx, 1);
                control.Dispose();
            }

            this._page.UnMask();
        }

        /**
         * リモコン全体を削除する。
         */
        public RemoveControlSet(): void {
            if (!this.IsOnEditMode)
                return;

            const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                this._page.ButtonPanel.Remove(btn);
                btn.Dispose();
            });

            const controlSet = this._controlSet;
            this.SwitchTo("Main");
            this._controlSet = null;
            this._page.UnMask();

            // 削除メソッド、投げっぱなしの終了確認無しで終わる。
            App.Models.Stores.ControlSets.Remove(controlSet);
        }
    }
}
