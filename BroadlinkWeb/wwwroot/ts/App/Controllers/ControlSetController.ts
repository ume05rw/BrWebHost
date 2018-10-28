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
/// <reference path="../Models/Stores/RmStore.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/DeviceType.ts" />

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
    import ButtonViewEvents = Fw.Events.ButtonViewEvents;
    import ControlButtonViewEvents = App.Events.Controls.ControlButtonViewEvents;
    import Stores = App.Models.Stores;
    import Popup = App.Views.Popup;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;

    export class ControlSetController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlSetPageView;
        private _controlSet: Entities.ControlSet;

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
                const ctr = this.Manager.Get('Main') as MainController;
                ctr.Show();
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

                ctr.RefreshControlSets();
            });

            this._page.EditButton.AddEventListener(ButtonViewEvents.SingleClick, () => {
                this.SetEditMode();
                this.ToUnmodal();
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

        public SetEditMode(): void {
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

        public SetOperateMode(): void {
            const left = 10;
            this._page.ButtonPanel.Position.Left = left;
            this._page.HeaderBar.Label.Hide(0);
            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);
            this._page.HeaderLeftLabel.Show(0);
            this._page.EditButton.Show(0);

            // 編集自体は許可する。
            // 編集項目を、名称だけに制限する。
            //// 編集ボタン - 表示制御対象
            //if (!this._controlSet) {
            //    // ControlSetエンティティが見当たらない
            //    this._page.EditButton.Hide(0);
            //} else if (this._controlSet.IsBrDevice) {
            //    // ControlSetは、Broadlinkデバイス = 編集不能
            //    this._page.EditButton.Hide(0);
            //} else {
            //    // その他 - ユーザー追加デバイス = 編集可
            //    this._page.EditButton.Show(0);
            //}

            _.each(this._page.ButtonPanel.Children, (v) => {
                if (v instanceof Controls.ControlButtonView)
                    (v as Controls.ControlButtonView).SetRelocatable(false);
            });
        }

        /**
         * 操作対象リモコンEnttiyをセットする。
         * @param entity
         */
        public SetEntity(entity: Entities.ControlSet): void {

            // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
            const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                this._page.ButtonPanel.Remove(btn);
                btn.Dispose();
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

                btn.AddEventListener(ControlButtonViewEvents.EditOrdered, async (e) => {
                    // 既存ボタンの処理。新規ボタン用に同様のロジックが、下にある。

                    // Broadlinkデバイスはボタン編集禁止
                    if (this._controlSet.OperationType === OperationType.BroadlinkDevice)
                        return;

                    const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                    const button = e.Sender as Controls.ControlButtonView;
                    ctr.SetEntity(button.Control);
                    ctr.ShowModal();

                    // クリック時にコードが空のものは、自動で学習モードにする。
                    const id = this._controlSet.BrDeviceId;
                    if ((id)
                        && (this._controlSet.OperationType === OperationType.RemoteControl)
                        && (!button.Control.Code
                            || button.Control.Code === '')
                    ) {
                        const code = await this.GetLearnedCode();
                        if (code) {
                            button.Control.Code = code;
                            ctr.SetEntity(button.Control);
                        }
                    }
                }, this);

                btn.AddEventListener(ControlButtonViewEvents.ExecOrdered, (e) => {
                    this.Log('ControlButtonViewEvents.ExecOrdered');
                    const button = e.Sender as Controls.ControlButtonView;
                    this.ExecCode(button.Control);
                }, this);

                this._page.ButtonPanel.Add(btn);
            });

            this.ApplyFromEntity();
        }

        private ApplyFromEntity(): void {
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

                if (this._controlSet.OperationType === OperationType.BroadlinkDevice
                    && (control.Value)
                    && control.Value !== ''
                ) {
                    const brDev = Stores.BrDevices.Get(this._controlSet.BrDeviceId);
                    switch (brDev.DeviceType) {
                        case DeviceType.A1:
                            // センサ値をボタンに表示する。
                            btn.HoverEnable = false;
                            switch (control.Code) {
                                case 'Temp':
                                    btn.Name = 'Temp.<br/>' + control.Value;
                                    break;
                                case 'Humidity':
                                    btn.Name = 'Humidity<br/>' + control.Value;
                                    break;
                                case 'Voc':
                                    btn.Name = 'VOC<br/>' + control.Value;
                                    break;
                                case 'Light':
                                    btn.Name = 'Light<br/>' + control.Value;
                                    break;
                                case 'Noise':
                                    btn.Name = 'Noise<br/>' + control.Value;
                                    break;
                                default:
                                    break;
                            }
                            break;

                        case DeviceType.Sp2:
                            // 電源/電灯の状態を表示する。
                            btn.HoverEnable = false;
                            if (control.Value === 'true') {
                                btn.IsActive = true;
                            } else {
                                btn.IsActive = false;
                            }
                            break;

                        case DeviceType.Rm2Pro:
                            // 温度値をボタンに表示する。
                            btn.HoverEnable = false;
                            break;

                        case DeviceType.Sp1:
                            // 電源の状態を表示する。
                            btn.HoverEnable = false;
                            if (control.Value === 'true') {
                                btn.IsActive = true;
                            } else {
                                btn.IsActive = false;
                            }
                            break;

                        // 以降、未対応。
                        case DeviceType.Rm:
                        case DeviceType.Dooya:
                        case DeviceType.Hysen:
                        case DeviceType.Mp1:
                        case DeviceType.S1c:
                        case DeviceType.Unknown:
                        default:
                            break;
                    }
                }
            });
        }

        /**
         * リモコンボタン追加指示
         * @param e
         */
        private OnOrderedNewControl(e: Fw.Events.EventObject): void {
            if (!this.IsOnEditMode)
                return;

            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            const control = new Entities.Control();
            control.ControlSetId = this._controlSet.Id;
            this._controlSet.Controls.push(control);

            const btn = new Controls.ControlButtonView();
            btn.Control = control;
            btn.SetLeftTop(185, this._page.Size.Height - 90 - 75);

            btn.AddEventListener(ControlButtonViewEvents.EditOrdered, async (e) => {
                // ボタン編集指示

                // リモコン操作以外はボタン編集禁止
                if (this._controlSet.OperationType !== OperationType.RemoteControl)
                    return;

                const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                const button = e.Sender as Controls.ControlButtonView;
                ctr.SetEntity(button.Control);
                ctr.ShowModal();

                // クリック時にコードが空のものは、自動で学習モードにする。
                const id = this._controlSet.BrDeviceId;
                if ((id)
                    && (this._controlSet.OperationType === OperationType.RemoteControl)
                    && (!button.Control.Code
                        || button.Control.Code === '')
                ) {
                    const code = await this.GetLearnedCode();
                    if (code) {
                        button.Control.Code = code;
                        ctr.SetEntity(button.Control);
                    }
                }

            }, this);

            btn.AddEventListener(ControlButtonViewEvents.ExecOrdered, (e) => {
                // ボタン実行指示
                const button = e.Sender as Controls.ControlButtonView;
                this.ExecCode(button.Control);
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
            ctr.ShowModal();
        }


        /**
         * 学習指示／コード取得
         */
        public async GetLearnedCode(): Promise<string> {

            const id = this._controlSet.BrDeviceId;

            if (!id) {
                Popup.Alert.Open({
                    Message: 'Select your Rm-Device.<br />Click Header.'
                });
                return null;
            }

            Popup.Cancellable.Open({
                Message: 'Set Remote Control head to Rm,<br/> and Push target Button.',
                CallbackCancel: () => {
                    // キャンセル指示を送信
                    Stores.Rms.CancelLearning(id);
                    // ポップアップを閉じる。
                    Popup.Cancellable.Close();

                    // 放っておいてもタイムアウトするので、以降は何もしない。でいい。はず。だ。
                }
            });
            const rCmd = await Stores.Rms.GetLearnedCode(id);

            Popup.Cancellable.Close();

            if (!rCmd || !rCmd.Code)
                return null;

            return rCmd.Code;
        }


        /**
         * コード実行
         * @param code
         */
        public async ExecCode(control: Entities.Control): Promise<boolean> {
            this.Log('ExecCode');
            const id = this._controlSet.BrDeviceId;

            if (!this._controlSet.BrDeviceId) {
                const guide = (this.IsOnEditMode)
                    ? 'Click Header.'
                    : 'Go Edit.';
                Popup.Alert.Open({
                    Message: 'Select your Rm-Device,<br/>' + guide,
                });
                return null;
            }

            if (!control.Code || control.Code === '') {
                const guide = (this.IsOnEditMode)
                    ? 'Click Learn-Button.'
                    : 'Go Edit.';
                Popup.Alert.Open({
                    Message: 'Learn your Remote Control Button.<br/>' + guide,
                });
                return null;
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
            if (!this.IsOnEditMode)
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
        public async RemoveControlSet(): Promise<boolean> {
            if (!this.IsOnEditMode)
                return;

            const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                this._page.ButtonPanel.Remove(btn);
                btn.Dispose();
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
