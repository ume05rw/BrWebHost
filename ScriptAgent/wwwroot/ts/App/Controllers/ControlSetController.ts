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
/// <reference path="../Views/Popup/AlertPopup.ts" />
/// <reference path="../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Stores/ControlSetStore.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/DeviceType.ts" />
/// <reference path="../Items/ModalOperationType.ts" />
/// <reference path="ItemSelectControllerBase.ts" />
/// <reference path="../Views/Controls/ItemSelectButtonView.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import Entities = App.Models.Entities;
    import Util = Fw.Util;
    import EntityEvents = Fw.Events.EntityEvents;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import ControlButtonEvents = App.Events.Controls.ControlButtonViewEvents;
    import Stores = App.Models.Stores;
    import Popup = App.Views.Popup;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;
    import ModalOperationType = App.Items.ModalOperationType;
    import ItemSelectControllerBase = App.Controllers.ItemSelectControllerBase;
    import ItemSelectButtonView = App.Views.Controls.ItemSelectButtonView;

    export class ControlSetController extends ItemSelectControllerBase implements IControlSetController {

        protected _page: Pages.ControlSetPageView;
        protected _controlSet: Entities.ControlSet;
        protected _operationType: ModalOperationType;

        constructor(controllerId: string = null) {
            super(controllerId || 'ControlSet');

            this.SetClassName('ControlSetController');

            this.SetPageView(new Pages.ControlSetPageView());
            this._page = this.View as Pages.ControlSetPageView;

            this._controlSet = null;
            this._operationType = ModalOperationType.Exec;

            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.LeftButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // 編集モードの状態で、戻るボタンクリック。
                // ControlSetエンティティを保存する。
                const controlSet = this._controlSet;
                const ctr = this.Manager.Get('Main') as MainController;
                ctr.Show();
                this._controlSet = null;

                // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
                const views = Util.Obj.Mirror(this._page.ButtonPanel.Children);
                _.each(views, (view: Fw.Views.IView) => {
                    if (view instanceof Controls.ControlButtonView) {
                        this._page.ButtonPanel.Remove(view);
                        view.Dispose();
                    }
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

                const res = await Stores.ControlSets.Write(controlSet);

                if (!res) {
                    // 保存失敗
                    this.SetEntity(controlSet);
                    this.SetEditMode();
                    this.Show();
                    Popup.Alert.Open({
                        Message: 'Ouch! Save Failure.<br/>Server online?'
                    });
                } else {
                    // 保存成功
                    ctr.RefreshControlSets();
                }
            });

            this._page.EditButton.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SetEditMode();
                this.ToUnmodal();
            });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, (e) => {
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
         * リモコンボタン選択 ** このメソッド呼び出し前に、SetEntity()しておくこと。**
         * @param parentController
         */
        public async Select(parentController: Fw.Controllers.IController): Promise<any> {
            this._operationType = ModalOperationType.Select;
            return super.Select(parentController);
        }

        public SetEditMode(): void {
            this._operationType = ModalOperationType.Edit;
            const left = (this._page.Size.Width / 2) - (this._page.ButtonPanel.Size.Width / 2);
            this._page.ButtonPanel.Position.Left = left;
            this._page.HeaderBar.Label.Show(0);
            this._page.HeaderBar.LeftButton.Show(0);
            this._page.HeaderLeftLabel.Hide(0);
            this._page.EditButton.Hide(0);

            // 追加ボタン - 表示制御対象
            if (!this._controlSet) {
                // ControlSetエンティティが見当たらない
                this._page.HeaderBar.RightButton.Hide(0);
            } else if (this._controlSet.OperationType === OperationType.BroadlinkDevice) {
                // ControlSetは、Broadlinkデバイス = 編集不能
                this._page.HeaderBar.RightButton.Hide(0);
            } else {
                // その他 - ユーザー追加デバイス = 編集可
                this._page.HeaderBar.RightButton.Show(0);
            }

            _.each(this._page.ButtonPanel.Children, (v) => {
                if (v instanceof Controls.ControlButtonView)
                    (v as Controls.ControlButtonView).SetRelocatable(true);
            });
        }

        public SetExecMode(): void {
            this._operationType = ModalOperationType.Exec;
            const left = 10;
            this._page.ButtonPanel.Position.Left = left;
            this._page.HeaderBar.Label.Hide(0);
            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);
            this._page.HeaderLeftLabel.Show(0);

            // ↓と、思ったけど、やめ。
            //// 編集ボタンは使用しないことにする。
            //// ボタン長押しで編集画面に行ってもらう。
            //this._page.EditButton.Hide(0); 
            this._page.EditButton.Show(0);

            _.each(this._page.ButtonPanel.Children, (v) => {
                if (v instanceof Controls.ControlButtonView)
                    (v as Controls.ControlButtonView).SetRelocatable(false);
            });
        }

        public SetSelectMode(): void {
            this._operationType = ModalOperationType.Select;
            const left = 10;
            this._page.ButtonPanel.Position.Left = left;
            this._page.HeaderBar.Label.Hide(0);
            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);
            this._page.HeaderLeftLabel.Show(0);
            this._page.EditButton.Hide(0);
        }

        /**
         * 操作対象リモコンEnttiyをセットする。
         * @param entity
         */
        public SetEntity(entity: Entities.ControlSet): void {

            // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
            const views = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(views, (view: Fw.Views.IView) => {
                if (view instanceof Controls.ControlButtonView) {
                    this._page.ButtonPanel.Remove(view);
                    view.Dispose();
                }
            });
            this._page.ButtonPanel.InnerLength = this._page.ButtonPanel.Size.Height;


            if (this._controlSet) {
                this._controlSet.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._controlSet = entity;

            if (!this._controlSet)
                return


            this._controlSet.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

            _.each(this._controlSet.Controls, (control) => {
                const btn = new Controls.ControlButtonView();
                btn.Control = control;
                btn.SetLeftTop(control.PositionLeft, control.PositionTop);
                btn.SetColor(control.Color);
                btn.SetImage(control.IconUrl);

                btn.AddEventListener(ButtonEvents.SingleClick, this.OnButtonClicked, this);

                this._page.ButtonPanel.Add(btn);
            });

            this.ApplyFromEntity();
        }

        protected async OnButtonClicked(e: Fw.Events.EventObject) {

            switch (this._operationType) {
                case ModalOperationType.Exec:

                    this.Log('ControlButtonViewEvents.ExecOrdered');
                    const button1 = e.Sender as Controls.ControlButtonView;
                    this.ExecCode(button1.Control);

                    break;
                case ModalOperationType.Edit:

                    // Broadlinkデバイスはボタン編集禁止
                    if (this._controlSet.OperationType === OperationType.BroadlinkDevice)
                        return;

                    const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                    const button2 = e.Sender as Controls.ControlButtonView;
                    ctr.SetEntity(button2.Control, this._controlSet);
                    ctr.ShowModal();

                    break;
                case ModalOperationType.Select:

                    const button3 = e.Sender as Controls.ControlButtonView;
                    this.Commit(button3.Control);

                    break;
                default:
                    alert('ここにはこないはず。');
                    throw new Error('なんでー？');
            }
        }

        protected ApplyFromEntity(): void {
            if (!this._controlSet)
                return;

            this._page.HeaderBar.Text = this._controlSet.Name;
            this._page.HeaderLeftLabel.Text = this._controlSet.Name;
            this._page.Refresh();

            _.each(this._page.ButtonPanel.Children, (btn: Controls.ControlButtonView) => {
                const control = btn.Control;

                if (btn.Color !== control.Color)
                    btn.SetColor(control.Color);

                if (btn.ImageSrc !== control.IconUrl)
                    btn.SetImage(control.IconUrl);
            });
        }

        /**
         * リモコンボタン追加指示
         * @param e
         */
        private OnOrderedNewControl(e: Fw.Events.EventObject): void {
            //if (!this.IsOnEditMode)
            //    return;
            if (this._operationType !== ModalOperationType.Edit)
                return;

            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            const control = new Entities.Control();
            control.ControlSetId = this._controlSet.Id;
            this._controlSet.Controls.push(control);

            const btn = new Controls.ControlButtonView();
            btn.Control = control;
            btn.SetLeftTop(185, this._page.Size.Height - 90 - 75);

            btn.AddEventListener(ButtonEvents.SingleClick, this.OnButtonClicked, this);

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

            //if (!this.IsOnEditMode)
            //    return;
            if (this._operationType !== ModalOperationType.Edit)
                return;

            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            const ctr = this.Manager.Get('ControlHeaderProperty') as ControlHeaderPropertyController;
            ctr.SetEntity(this._controlSet);
            ctr.ShowModal();
        }

        /**
         * 学習指示／コード取得
         */
        public async GetLearnedCode(): Promise<string> {
            throw new Error("Method not implemented.");
        }

        /**
         * コード実行
         * @param code
         */
        public async ExecCode(control: Entities.Control): Promise<boolean> {
            this.Log('ExecCode');
            const id = this._controlSet.BrDeviceId;

            if (
                (this._controlSet.OperationType === OperationType.RemoteControl
                 || this._controlSet.OperationType === OperationType.BroadlinkDevice)
                && !this._controlSet.BrDeviceId
            ) {
                const guide = (this._operationType === ModalOperationType.Edit)
                    ? 'Click Header.'
                    : 'Go Edit.';
                Popup.Alert.Open({
                    Message: 'Select your Rm-Device,<br/>' + guide,
                });
                return false;
            }

            if (!control.Code || control.Code === '') {
                let message = '';

                switch (this._controlSet.OperationType) {
                    case OperationType.RemoteControl:
                        const guide = (this._operationType === ModalOperationType.Edit)
                            ? 'Click Learn-Button.'
                            : 'Go Edit.';
                        message = 'Learn your Remote Control Button.<br/>' + guide;
                        break;
                    case OperationType.BroadlinkDevice:
                        alert('ここにはこないはずやで！！');
                        message = 'Unexpected Operation...?';
                        break;
                    case OperationType.WakeOnLan:
                        message = 'Set MAC-Address,<br/>Go Edit.';
                        break;
                    case OperationType.Script:
                        message = 'Write Script,<br/>Go Edit.';
                        break;
                    case OperationType.RemoteHostScript:
                        message = 'Select Remote Script,<br/>Go Edit.';
                        break;
                    case OperationType.Scene:
                    default:
                        alert('ここにはこないはずやで！！');
                        message = 'Unexpected Operation...?';
                        break;
                }

                Popup.Alert.Open({
                    Message: message,
                });

                return false;
            }

            if (this._operationType === ModalOperationType.Edit) {
                const newCs = await Stores.ControlSets.Write(this._controlSet);

                if (newCs !== null) {
                    this._controlSet = newCs;
                    this.SetEntity(this._controlSet);

                    const newCtl = _.find(newCs.Controls, (c: Entities.Control) => {
                        return (c.PositionLeft === control.PositionLeft
                            && c.PositionTop === control.PositionTop
                            && c.Name === control.Name
                            && c.Code === control.Code);
                    });

                    if (!newCtl) {
                        Popup.Alert.Open({
                            Message: 'Unexpected...Control not Found.'
                        });
                        return false;
                    }
                    control = newCtl;

                    const ctr1 = this.Manager.Get('ControlProperty') as ControlPropertyController;
                    if (ctr1.View.IsVisible)
                        ctr1.SetEntity(control, this._controlSet);

                    const ctr2 = this.Manager.Get('ControlHeaderProperty') as ControlHeaderPropertyController;
                    if (ctr2.View.IsVisible)
                        ctr2.SetEntity(this._controlSet);

                } else {
                    Popup.Alert.Open({
                        Message: 'Ouch! Save Failure.<br/>Server online?'
                    });
                    return false;
                }
            }

            const result = await Stores.Operations.Exec(this._controlSet, control);

            if (result) {
                if (control.IsAssignToggleOn === true
                    && control.IsAssignToggleOff === true
                ) {
                    // ボタンにトグルOn/Off両方アサインされているとき、
                    // 表示制御しない。
                } else if (control.IsAssignToggleOn) {
                    // ボタンにトグルOnがアサインされているとき
                    this._controlSet.ToggleState = true;
                    this._controlSet.DispatchChanged();
                } else if (control.IsAssignToggleOff) {
                    // ボタンにトグルOffがアサインされているとき
                    this._controlSet.ToggleState = false;
                    this._controlSet.DispatchChanged();
                }
            }

            return result;
        }

        /**
         * Controlのトグルアサイン状態を唯一選択に保つ
         * @param control アサイン指定されたControl
         * @param targetState On/Offアサインのどちらかを示す
         */
        public ResetToggleAssign(control: Entities.Control, targetState: boolean): void {
            //if (!this.IsOnEditMode)
            //    return;
            if (this._operationType !== ModalOperationType.Edit)
                return;

            const propName = (targetState)
                ? 'IsAssignToggleOn'
                : 'IsAssignToggleOff';

            _.each(this._controlSet.Controls, (c: Entities.Control) => {
                if (c === control)
                    return;

                if (c[propName] === true)
                    c[propName] = false;
            });
        }

        /**
         * リモコンボタンを一つ削除する。
         * @param control
         */
        public RemoveControl(control: Entities.Control): void {
            //if (!this.IsOnEditMode)
            //    return;
            if (this._operationType !== ModalOperationType.Edit)
                return;

            // View側削除処理
            const views = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(views, (view: Fw.Views.IView) => {
                if (
                    view instanceof Controls.ControlButtonView
                    && view.Control === control
                ) {
                    this._page.ButtonPanel.Remove(view);
                    view.Dispose();
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
        public async RemoveControlSet(): Promise<boolean> {
            if (this._operationType !== ModalOperationType.Edit)
                return;
            //if (!this.IsOnEditMode)
            //    return;

            const views = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(views, (view: Fw.Views.IView) => {
                if (view instanceof Controls.ControlButtonView) {
                    this._page.ButtonPanel.Remove(view);
                    view.Dispose();
                }
            });

            const controlSet = this._controlSet;
            const ctr = this.Manager.Get('Main') as MainController;
            ctr.Show();

            this._controlSet = null;
            this._page.UnMask();

            // 削除メソッド、投げっぱなしの終了確認無しで終わる。
            await Stores.ControlSets.Remove(controlSet);

            ctr.RefreshControlSets();
        }
    }
}
