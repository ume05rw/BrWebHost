/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Events/StuckerBoxViewEvents.ts" />
/// <reference path="../../Fw/Events/InputViewEvents.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Popup/AlertPopup.ts" />
/// <reference path="../Views/Controls/SceneDetailView.ts" />
/// <reference path="../Views/Controls/ItemSelectButtonView.ts" />
/// <reference path="../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Entities/Control.ts" />
/// <reference path="../Models/Entities/Scene.ts" />
/// <reference path="../Models/Stores/RmStore.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/ModalOperationType.ts" />
/// <reference path="../Items/Weekday.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/Icon.ts" />
/// <reference path="ControlSetSelectController.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import Entities = App.Models.Entities;
    import Util = Fw.Util;
    import EntityEvents = Fw.Events.EntityEvents;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import InputEvents = Fw.Events.InputViewEvents;
    import StuckerBoxEvents = Fw.Events.StuckerBoxViewEvents;
    import Stores = App.Models.Stores;
    import Popup = App.Views.Popup;
    import OperationType = App.Items.OperationType;
    import SceneDetailView = App.Views.Controls.SceneDetailView;
    import ItemSelectButtonView = App.Views.Controls.ItemSelectButtonView;
    import ModalOperationType = App.Items.ModalOperationType;
    import ControlSetSelectController = App.Controllers.ControlSetSelectController;
    import Scene = App.Models.Entities.Scene;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Weekday = App.Items.Weekday;
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;

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
                    ctr.RefreshScenesAndSchedules();
                }
            });

            this._page.EditButton.AddEventListener(ButtonEvents.SingleClick, () => {
                this.SetEditMode();
                this.ToUnmodal();
            });

            _.each(this._page.InputPanel.Children, (view: Fw.Views.IView) => {
                if (view instanceof Fw.Views.InputViewBase
                    || view instanceof Fw.Views.CheckBoxInputView
                ) {
                    view.AddEventListener(InputEvents.Changed, this.ApplyToEntity, this);
                }
            });

            this._page.BtnColor.AddEventListener(ButtonEvents.SingleClick, async (e) => {
                if (!this._schedule)
                    return;

                //this.Log('SceneHeaderPropertyController.BtnColor.SingleClick');

                const ctr = this.Manager.Get('ColorSelect') as ColorSelectController;
                const color: string = await ctr.Select(this);

                this._schedule.Color = color;
                this._page.BtnColor.Color = color;
                this._page.BtnColor.BackgroundColor = color;
                this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(color);

                this._schedule.DispatchChanged();
            });

            this._page.SdvControl.ControlSetButton.AddEventListener(ButtonEvents.SingleClick, this.OnControlSetClicked, this);
            this._page.SdvControl.ControlButton.AddEventListener(ButtonEvents.SingleClick, this.OnControlClicked, this);

            this._page.DeleteButton.AddEventListener(Events.ButtonViewEvents.SingleClick, async (e) => {
                if (!this._schedule)
                    return;

                const res = await Popup.Confirm.OpenAsync({
                    Message: 'This Timer will be REMOVED.<br/>Are you ok?'
                });

                if (res !== true)
                    return;

                this.RemoveShedule();

                this._schedule = null;
                this.HideModal();
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

            const schedule = this._schedule;
            this._schedule = null;

            this._page.HeaderBar.Text = schedule.Name;
            this._page.HeaderLeftLabel.Text = schedule.Name;

            this._page.TxtName.Value = schedule.Name;

            this._page.BtnColor.Color = schedule.Color;
            this._page.BtnColor.BackgroundColor = schedule.Color;
            this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(schedule.Color);

            this._page.SdvControl.ControlSetButton.ImageSrc = '';
            this._page.SdvControl.ControlSetButton.Text = 'Select<br/>Remotes';
            this._page.SdvControl.ControlSetLabel.Text = '';
            this._page.SdvControl.ControlSetButton.Color = Color.ButtonColors[0];
            this._page.SdvControl.ControlSetButton.BackgroundColor = Color.MainBackground;
            this._page.SdvControl.ControlSetButton.HoverColor = Color.ButtonHoverColors[0];
            if (schedule.SceneId) {
                const entity = Stores.Scenes.List[schedule.SceneId];
                if (entity) {
                    this._page.SdvControl.ControlSetButton.ImageSrc = Icon.GetPairdOperationIcon(entity.IconUrl);
                    this._page.SdvControl.ControlSetButton.Text = (!entity.IconUrl || entity.IconUrl === '')
                        ? entity.Name
                        : '';
                    this._page.SdvControl.ControlSetLabel.Text = entity.Name;

                    const idx = Color.ButtonColors.indexOf(entity.Color);
                    if (idx !== -1) {
                        this._page.SdvControl.ControlSetButton.Color = entity.Color;
                        this._page.SdvControl.ControlSetButton.BackgroundColor = entity.Color;
                        this._page.SdvControl.ControlSetButton.HoverColor = Color.ButtonHoverColors[idx];
                    }
                }
            }
            if (schedule.ControlSetId) {
                const entity = Stores.ControlSets.List[schedule.ControlSetId];
                if (entity) {
                    this._page.SdvControl.ControlSetButton.ImageSrc = Icon.GetPairdOperationIcon(entity.IconUrl);
                    this._page.SdvControl.ControlSetButton.Text = (!entity.IconUrl || entity.IconUrl === '')
                        ? entity.Name
                        : '';
                    this._page.SdvControl.ControlSetLabel.Text = entity.Name;

                    const idx = Color.ButtonColors.indexOf(entity.Color);
                    if (idx !== -1) {
                        this._page.SdvControl.ControlSetButton.Color = entity.Color;
                        this._page.SdvControl.ControlSetButton.BackgroundColor = entity.Color;
                        this._page.SdvControl.ControlSetButton.HoverColor = Color.ButtonHoverColors[idx];
                    }
                }
            }
            if (schedule.ControlId) {
                const entity = Stores.Controls.List[schedule.ControlId];
                if (entity) {
                    this._page.SdvControl.ControlButton.ImageSrc = entity.IconUrl;
                    this._page.SdvControl.ControlButton.Text = (!entity.IconUrl || entity.IconUrl === '')
                        ? entity.Name
                        : '';
                    this._page.SdvControl.ControlLabel.Text = entity.Name;

                    const idx = Color.ButtonColors.indexOf(entity.Color);
                    if (idx !== -1) {
                        this._page.SdvControl.ControlButton.Color = entity.Color;
                        this._page.SdvControl.ControlButton.BackgroundColor = Color.MainBackground;
                        this._page.SdvControl.ControlButton.HoverColor = Color.ButtonHoverColors[idx];
                    }
                }
            }

            this._page.ChkEnabled.BoolValue = schedule.Enabled;

            if (!schedule.StartTimeString || schedule.StartTimeString === '') {
                this._page.SboHour.Value = '10';
                this._page.SboMinute.Value = '0';
            } else {
                const startTime = new Date(schedule.StartTimeString);
                this._page.SboHour.Value = startTime.getHours().toString();
                this._page.SboMinute.Value = startTime.getMinutes().toString();
            }

            this._page.ChkWeekdaySunday.BoolValue = schedule.GetWeekdayFlag(Weekday.Sunday);
            this._page.ChkWeekdayMonday.BoolValue = schedule.GetWeekdayFlag(Weekday.Monday);
            this._page.ChkWeekdayTuesday.BoolValue = schedule.GetWeekdayFlag(Weekday.Tuesday);
            this._page.ChkWeekdayWednesday.BoolValue = schedule.GetWeekdayFlag(Weekday.Wednesday);
            this._page.ChkWeekdayThursday.BoolValue = schedule.GetWeekdayFlag(Weekday.Thursday);
            this._page.ChkWeekdayFriday.BoolValue = schedule.GetWeekdayFlag(Weekday.Friday);
            this._page.ChkWeekdaySaturday.BoolValue = schedule.GetWeekdayFlag(Weekday.Saturday);

            this._schedule = schedule;
            this._page.Refresh();
        }

        private ApplyToEntity(): void {
            if (!this._schedule)
                return;

            this._schedule.Name = this._page.TxtName.Value;
            this._page.HeaderBar.Text = this._page.TxtName.Value;
            this._page.HeaderLeftLabel.Text = this._page.TxtName.Value;

            //this._schedule.Color = this._page.BtnColor.Color;

            this._schedule.Enabled = this._page.ChkEnabled.BoolValue;

            let startTime = new Date(2000, 0, 1, 0, 0, 0);
            if (this._page.SboHour.Value !== '' && this._page.SboMinute.Value !== '') {
                const hour = parseInt(this._page.SboHour.Value, 10);
                const minute = parseInt(this._page.SboMinute.Value, 10);
                startTime = new Date(2000, 0, 1, hour, minute, 0);
            }
            this._schedule.StartTimeString = Fw.Util.DateTime.GetIso8601(startTime);

            this._schedule.SetWeekdayFlag(Weekday.Sunday, this._page.ChkWeekdaySunday.BoolValue);
            this._schedule.SetWeekdayFlag(Weekday.Monday, this._page.ChkWeekdayMonday.BoolValue);
            this._schedule.SetWeekdayFlag(Weekday.Tuesday, this._page.ChkWeekdayTuesday.BoolValue);
            this._schedule.SetWeekdayFlag(Weekday.Wednesday, this._page.ChkWeekdayWednesday.BoolValue);
            this._schedule.SetWeekdayFlag(Weekday.Thursday, this._page.ChkWeekdayThursday.BoolValue);
            this._schedule.SetWeekdayFlag(Weekday.Friday, this._page.ChkWeekdayFriday.BoolValue);
            this._schedule.SetWeekdayFlag(Weekday.Saturday, this._page.ChkWeekdaySaturday.BoolValue);
        }

        private async OnControlSetClicked(e: Fw.Events.EventObject) {
            switch (this._operationType) {
                case ModalOperationType.Exec:
                    // なにもしない。
                    break;
                case ModalOperationType.Edit:

                    const ctr = this.Manager.Get('ControlSetSelect') as ControlSetSelectController;
                    ctr.IsSceneIncludes = true;
                    const entity: ControlSet | Scene = await ctr.Select(this);

                    if (entity) {
                        if (entity instanceof ControlSet) {
                            this._schedule.SceneId = null;
                            this._schedule.ControlSetId = entity.Id;
                            if (entity.Controls.length === 1) {
                                this._schedule.ControlId = entity.Controls[0].Id;
                            } else {
                                this.OnControlClicked(e);
                            }
                        } else if (entity instanceof Scene) {
                            this._schedule.SceneId = entity.Id;
                            this._schedule.ControlSetId = null;
                            this._schedule.ControlId = null;
                        }
                        this.ApplyFromEntity();
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
                    const controlSet: ControlSet = Stores.ControlSets.List[this._schedule.ControlSetId];

                    if (controlSet) {
                        const ctr = App.Controllers.CSControllerFactory.Get(controlSet);
                        ctr.SetEntity(controlSet);
                        ctr.SetSelectMode();
                        const control: Control = await ctr.Select(this);

                        if (control) {
                            this._schedule.ControlId = control.Id;
                        }
                        this.ApplyFromEntity();
                    }

                    break;
                case ModalOperationType.Select:
                default:
                    alert('ここにはこないはず。');
                    throw new Error('なんでー？');
            }
        }

        /**
         * スケジュールを削除する。
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

            ctr.RefreshScenesAndSchedules();
        }
    }
}
