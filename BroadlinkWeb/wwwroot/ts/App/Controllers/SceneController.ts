/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Events/StuckerBoxViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../../Fw/Views/ButtonView.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Popup/AlertPopup.ts" />
/// <reference path="../Views/Controls/SceneDetailView.ts" />
/// <reference path="../Views/Controls/ItemSelectButtonView.ts" />
/// <reference path="../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Stores/RmStore.ts" />
/// <reference path="../Models/Entities/Job.ts" />
/// <reference path="../Models/Entities/SceneStatus.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/DeviceType.ts" />
/// <reference path="../Items/ModalOperationType.ts" />
/// <reference path="ControlSetSelectController.ts" />

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
    import StuckerBoxEvents = Fw.Events.StuckerBoxViewEvents;
    import Stores = App.Models.Stores;
    import Popup = App.Views.Popup;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;
    import SceneDetailView = App.Views.Controls.SceneDetailView;
    import ButtonView = Fw.Views.ButtonView;
    import ItemSelectButtonView = App.Views.Controls.ItemSelectButtonView;
    import ModalOperationType = App.Items.ModalOperationType;
    import ControlSetSelectController = App.Controllers.ControlSetSelectController;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Job = App.Models.Entities.Job;
    import SceneStatus = App.Models.Entities.SceneStatus;

    export class SceneController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ScenePageView;
        private _scene: Entities.Scene;
        private _operationType: ModalOperationType;

        constructor() {
            super('Scene');

            this.SetClassName('SceneController');

            this.SetPageView(new Pages.ScenePageView());
            this._page = this.View as Pages.ScenePageView;

            this._scene = null;
            this._operationType = ModalOperationType.Exec;

            this._page.HeaderBar.LeftButton.Hide(0);

            this._page.HeaderBar.LeftButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // 編集モードの状態で、戻るボタンクリック。
                // Sceneエンティティを保存する。
                const scene = this._scene;
                const ctr = this.Manager.Get('Main') as MainController;
                ctr.Show();
                this._scene = null;

                // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
                const buttons = Util.Obj.Mirror(this._page.DetailPanel.Children);
                _.each(buttons, (btn: Fw.Views.IView) => {
                    this._page.DetailPanel.Remove(btn);
                    btn.Dispose();
                });

                // 登録処理、結果を確認せず画面を閉じる。
                let isSave = true;
                if (scene.Details.length <= 0) {
                    isSave = await App.Views.Popup.Confirm.OpenAsync({
                        Message: 'No operations.<br/>Save OK?'
                    });
                }

                if (!isSave)
                    return;

                const res = await Stores.Scenes.Write(scene);

                if (!res) {
                    // 保存失敗
                    this.SetEntity(scene);
                    this.SetEditMode();
                    this.Show();
                    Popup.Alert.Open({
                        Message: 'Ouch! Save Failure.<br/>Server online?'
                    });
                } else {
                    // 保存成功
                    ctr.RefreshScenes();
                }
            });

            this._page.EditButton.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SetEditMode();
                this.ToUnmodal();
            });

            this._page.HeaderBar.RightButton.AddEventListener(ButtonEvents.SingleClick, (e) => {
                this.OnOrderedNewDetail(e);
            });

            this._page.HeaderBar.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });
            this._page.HeaderBar.Label.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });

            this._page.DetailPanel.AddEventListener(StuckerBoxEvents.RelocationStarted, () => {
                _.each(this._page.DetailPanel.Children, (v: SceneDetailView) => {
                    v.DeleteButton.Show();
                });
                _.delay(() => {
                    this._page.DetailPanel.Refresh();
                }, 300);
            });

            this._page.DetailPanel.AddEventListener(StuckerBoxEvents.RelocationEnded, () => {
                _.each(this._page.DetailPanel.Children, (v: SceneDetailView) => {
                    v.DeleteButton.Hide();
                });
                _.delay(() => {
                    this._page.DetailPanel.Refresh();
                }, 300);
            });

            this._page.DetailPanel.AddEventListener(StuckerBoxEvents.OrderUncommitChanged, () => {

                if (!this._scene)
                    return;

                const length = this._scene.Details.length;
                let idx = 1;
                _.each(this._page.DetailPanel.Children, (v: SceneDetailView) => {
                    v.Detail.Order = idx;
                    v.SetWaitable(v.Detail.Order !== length);
                    idx++;
                });
                this._page.DetailPanel.Refresh();
            });

        }

        public SetEditMode(): void {
            this._operationType = ModalOperationType.Edit;
            const left = (this._page.Size.Width / 2) - (this._page.DetailPanel.Size.Width / 2);
            this._page.DetailPanel.Position.Left = left;
            this._page.HeaderBar.Label.Show(0);
            this._page.HeaderBar.LeftButton.Show(0);
            this._page.HeaderLeftLabel.Hide(0);
            this._page.EditButton.Hide(0);
            this._page.HeaderBar.RightButton.Show(0);

            // 開始時、再配置モードにはしない。
            // マウスイベントをStuckerに取られ、待機時間入力が出来ないので。
            //this._page.DetailPanel.StartRelocation();

            const ctr = this.Manager.Get('ControlSetSelect') as ControlSetSelectController;
            ctr.RefreshControlSets();

            _.each(this._page.DetailPanel.Children, (v: SceneDetailView) => {
                v.SetEditMode();
            });
        }

        public SetExecMode(): void {
            this._operationType = ModalOperationType.Exec;
            const left = 10;
            this._page.DetailPanel.Position.Left = left;
            this._page.HeaderBar.Label.Hide(0);
            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);
            this._page.HeaderLeftLabel.Show(0);

            // ↓と、思ったけど、やめ。
            //// 編集ボタンは使用しないことにする。
            //// ボタン長押しで編集画面に行ってもらう。
            //this._page.EditButton.Hide(0);
            this._page.EditButton.Show(0);

            if (this._page.DetailPanel.IsChildRelocation)
                this._page.DetailPanel.CommitRelocation();

            _.each(this._page.DetailPanel.Children, (v: SceneDetailView) => {
                v.SetExecMode();
            });
        }

        /**
         * 操作対象シーンEnttiyをセットする。
         * @param entity
         */
        public SetEntity(entity: Entities.Scene): void {

            // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
            const buttons = Util.Obj.Mirror(this._page.DetailPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                this._page.DetailPanel.Remove(btn);
                btn.Dispose();
            });

            if (this._scene) {
                this._scene.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._scene = entity;

            if (!this._scene)
                return;

            this._scene.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

            _.each(this._scene.Details, (detail) => {
                this.AddDetail(detail);
            });

            this.ApplyFromEntity();
        }

        private AddDetail(detail: Entities.SceneDetail): void {
            
            const box = new SceneDetailView();
            box.Detail = detail;
            box.ControlSetButton.AddEventListener(ButtonEvents.SingleClick, this.OnControlSetClicked, this);
            box.ControlButton.AddEventListener(ButtonEvents.SingleClick, this.OnControlClicked, this);
            box.DeleteButton.AddEventListener(ButtonEvents.SingleClick, this.OnDeleteClicked, this);
            this._page.DetailPanel.Add(box);

            const length = this._scene.Details.length;
            _.each(this._page.DetailPanel.Children, (v: SceneDetailView) => {
                v.SetWaitable(v.Detail.Order !== length);
            });
            this._page.DetailPanel.Refresh();
        }

        private async OnControlSetClicked(e: Fw.Events.EventObject) {
            switch (this._operationType) {
                case ModalOperationType.Exec:
                    // なにもしない。
                    break;
                case ModalOperationType.Edit:

                    const ctr = this.Manager.Get('ControlSetSelect') as ControlSetSelectController;
                    const controlSet: ControlSet = await ctr.Select(this);

                    if (controlSet) {
                        const button: ItemSelectButtonView = e.Sender as ItemSelectButtonView;
                        const sdView: SceneDetailView = button.Parent as SceneDetailView;
                        sdView.Detail.ControlSetId = controlSet.Id;

                        if (controlSet.Controls.length === 1) {
                            sdView.Detail.ControlId = controlSet.Controls[0].Id;
                            sdView.ApplyFromEntity();
                        } else {
                            sdView.Detail.ControlId = null;
                            sdView.ApplyFromEntity();

                            // eのイベント発生元ボタンが異なるが、Parentが同じなので良しとする。
                            this.OnControlClicked(e);
                        }
                    }

                    break;
                case ModalOperationType.Select:
                default:
                    alert('ここにはこないはず。');
                    throw new Error('なんでー？');
            }
        }

        private async OnControlClicked(e: Fw.Events.EventObject) {
            switch (this._operationType) {
                case ModalOperationType.Exec:
                    // なにもしない。
                    break;
                case ModalOperationType.Edit:
                    const button: ItemSelectButtonView = e.Sender as ItemSelectButtonView;
                    const sdView: SceneDetailView = button.Parent as SceneDetailView;
                    const controlSet: ControlSet = Stores.ControlSets.List[sdView.Detail.ControlSetId];

                    if (controlSet) {
                        const ctr = App.Controllers.CSControllerFactory.Get(controlSet);
                        ctr.SetEntity(controlSet);
                        ctr.SetSelectMode();
                        const control: Control = await ctr.Select(this);

                        if (control) {
                            sdView.Detail.ControlSetId = controlSet.Id;
                            sdView.Detail.ControlId = control.Id;
                            sdView.ApplyFromEntity();
                        }
                    }

                    break;
                case ModalOperationType.Select:
                default:
                    alert('ここにはこないはず。');
                    throw new Error('なんでー？');
            }
        }

        private async OnDeleteClicked(e: Fw.Events.EventObject) {
            switch (this._operationType) {
                case ModalOperationType.Exec:
                    // なにもしない。
                    break;
                case ModalOperationType.Edit:
                    const button: ButtonView = e.Sender as ButtonView;
                    const sdView: SceneDetailView = button.Parent as SceneDetailView;
                    const detail = sdView.Detail as Entities.SceneDetail;
                    const idx = this._scene.Details.indexOf(detail);

                    if (idx === -1)
                        return;

                    this._page.DetailPanel.Remove(sdView);
                    sdView.Dispose();

                    this._scene.Details.splice(idx, 1);
                    detail.Dispose();

                    this._page.Refresh();

                    break;
                case ModalOperationType.Select:
                default:
                    alert('ここにはこないはず。');
                    throw new Error('なんでー？');
            }
        }
        

        private ApplyFromEntity(): void {
            if (!this._scene)
                return;

            this._page.HeaderBar.Text = this._scene.Name;
            this._page.HeaderLeftLabel.Text = this._scene.Name;
            this._page.Refresh();

        }

        /**
         * 操作追加指示
         * @param e
         */
        private OnOrderedNewDetail(e: Fw.Events.EventObject): void {

            if (this._operationType !== ModalOperationType.Edit)
                return;

            if (!this._scene)
                throw new Error('Scene Not Found');

            const detail = new Entities.SceneDetail();
            this._scene.Details.push(detail);
            detail.SceneId = this._scene.Id;
            detail.Order = this._scene.Details.length;
            this.AddDetail(detail);
        }

        /**
         * シーンヘッダ情報の編集指示
         * @param e
         */
        private OnOrderedHeader(e: JQueryEventObject): void {
            if (e.eventPhase !== 2)
                return;

            //if (!this.IsOnEditMode)
            //    return;
            if (this._operationType !== ModalOperationType.Edit)
                return;

            if (!this._scene)
                throw new Error('Scene Not Found');

            const ctr = this.Manager.Get('SceneHeaderProperty') as SceneHeaderPropertyController;
            ctr.SetEntity(this._scene);
            ctr.ShowModal();
        }

        /**
         * リモコン全体を削除する。
         */
        public async RemoveScene(): Promise<boolean> {
            if (this._operationType !== ModalOperationType.Edit)
                return;
            //if (!this.IsOnEditMode)
            //    return;

            const buttons = Util.Obj.Mirror(this._page.DetailPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                this._page.DetailPanel.Remove(btn);
                btn.Dispose();
            });

            const scene = this._scene;
            const ctr = this.Manager.Get('Main') as MainController;
            ctr.Show();

            this._scene = null;
            this._page.UnMask();

            // 削除メソッド、投げっぱなしの終了確認無しで終わる。
            await Stores.Scenes.Remove(scene);

            ctr.RefreshScenes();
        }

        /**
         * シーンを実行する。
         */
        public async Exec(): Promise<boolean> {
            // 編集中、テスト実行する機能を作るかも。
            //if (this._operationType !== ModalOperationType.Exec)
            //    return;

            try {
                let job = await Stores.Scenes.Exec(this._scene);
                let step = 0;

                while (true) {

                    job = await Stores.Jobs.Get(job.Id);

                    // ここで、VisualStudioは、JSON.parse()されたオブジェクトの値取得が出来ないらしい。
                    // 実際には取得出来ているので良しとする。
                    const status = job.JsonObject as SceneStatus;

                    if (step !== status.Step) {
                        const before = this._page.DetailPanel.Children[(status.Step - 2)] as SceneDetailView;
                        const current = this._page.DetailPanel.Children[(status.Step - 1)] as SceneDetailView;

                        if (before)
                            before.ClearAnimatedClass();

                        if (current) {
                            current.SetAnimatedClass('flash infinite');
                        }
                    }

                    if (job.IsCompleted)
                        break;

                    await Fw.Util.App.Wait(300);
                }

                if (this._operationType === ModalOperationType.Exec) {
                    _.delay(() => {
                        if (this._page.IsVisible && this._page.IsModal) {
                            this.HideModal();
                        }

                        // トグル状態の変更を適用する。
                        const ctr = this.Manager.Get('Main') as MainController;
                        ctr.RefreshControlSets();

                    }, 3000);
                }

            } catch (e) {
                Dump.Log(e);
                return false;
            }

            return true;
        }
    }
}
