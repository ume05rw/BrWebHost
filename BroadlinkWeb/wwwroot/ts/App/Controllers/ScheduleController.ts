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

    export class ScheduleController extends Fw.Controllers.ControllerBase {

        private _page: Pages.SchedulePageView;
        private _schedule: Entities.Schedule;
        private _operationType: ModalOperationType;

        constructor() {
            super('Schedule');

            this.SetClassName('ScheduleController');

            this.SetPageView(new Pages.SchedulePageView());
            this._page = this.View as Pages.SchedulePageView;

            this._schedule = null;
            this._operationType = ModalOperationType.Exec;

            this._page.HeaderBar.LeftButton.Hide(0);

            this._page.HeaderBar.LeftButton.AddEventListener(ButtonEvents.SingleClick, async () => {
                // 編集モードの状態で、戻るボタンクリック。
                // Sceneエンティティを保存する。
                const schedule = this._schedule;
                const ctr = this.Manager.Get('Main') as MainController;
                ctr.Show();
                this._schedule = null;

                // 登録処理、結果を確認せず画面を閉じる。
                const res = await Stores.Schedules.Write(schedule);

                if (!res) {
                    // 保存失敗
                    this.SetEntity(schedule);
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
        }

        public SetEditMode(): void {
            this._operationType = ModalOperationType.Edit;
            const left = (this._page.Size.Width / 2) - (this._page.InputPanel.Size.Width / 2);
            this._page.InputPanel.Position.Left = left;
            this._page.HeaderBar.Label.Show(0);
            this._page.HeaderBar.LeftButton.Show(0);
            this._page.HeaderLeftLabel.Hide(0);
            this._page.EditButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);

            const ctr = this.Manager.Get('ControlSetSelect') as ControlSetSelectController;
            ctr.RefreshControlSets();

        }

        public SetExecMode(): void {
            this._operationType = ModalOperationType.Exec;
            const left = 10;
            this._page.InputPanel.Position.Left = left;
            this._page.HeaderBar.Label.Hide(0);
            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);
            this._page.HeaderLeftLabel.Show(0);
            this._page.EditButton.Show(0);
        }

        /**
         * 操作対象シーンEnttiyをセットする。
         * @param entity
         */
        public SetEntity(entity: Entities.Schedule): void {

            if (this._schedule) {
                this._schedule.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._schedule = entity;

            if (!this._schedule)
                return;

            this._schedule.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

            this.ApplyFromEntity();
        }

        private ApplyFromEntity(): void {
            if (!this._schedule)
                return;

            this._page.HeaderBar.Text = this._schedule.Name;
            this._page.HeaderLeftLabel.Text = this._schedule.Name;
            this._page.Refresh();
        }

        /**
         * リモコン全体を削除する。
         */
        public async RemoveShedule(): Promise<boolean> {
            if (this._operationType !== ModalOperationType.Edit)
                return;
            //if (!this.IsOnEditMode)
            //    return;

            const schedule = this._schedule;
            const ctr = this.Manager.Get('Main') as MainController;
            ctr.Show();

            this._schedule = null;
            this._page.UnMask();

            // 削除メソッド、投げっぱなしの終了確認無しで終わる。
            await Stores.Schedules.Remove(schedule);

            ctr.RefreshScenes();
        }
    }
}
