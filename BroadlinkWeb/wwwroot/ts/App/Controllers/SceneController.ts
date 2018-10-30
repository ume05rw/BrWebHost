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
/// <reference path="../Views/Controls/SceneDetailView.ts" />
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
    import SceneDetailView = App.Views.Controls.SceneDetailView;

    export class SceneController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ScenePageView;

        /**
         * 現在リモコン編集中か否か
         */
        private get IsOnEditMode(): boolean {
            // 編集ボタンが見えているとき操作モード。非表示のとき編集モード
            return !this._page.EditButton.IsVisible;
        }

        constructor() {
            super('Scene');

            this.SetClassName('SceneController');

            this.SetPageView(new Pages.ScenePageView());
            this._page = this.View as Pages.ScenePageView;

            this._page.HeaderBar.LeftButton.Hide(0);

            this._page.HeaderBar.LeftButton.AddEventListener(ButtonViewEvents.SingleClick, async () => {
                // 編集モードの状態で、戻るボタンクリック。
                // ここでSceneエンティティを保存する。


                const ctr = this.Manager.Get('Main') as MainController;
                ctr.Show();



                //ctr.RefreshScenes();
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


            for (var i = 0; i < 5; i++) {
                const row = new SceneDetailView();
                (i === 4)
                    ? row.SetWaitable(false)
                    : row.SetWaitable(true);
                this._page.OperationPanel.Add(row);
            }

        }

        public SetEditMode(): void {
            const left = (this._page.Size.Width / 2) - (this._page.OperationPanel.Size.Width / 2);
            this._page.OperationPanel.Position.Left = left;
            this._page.HeaderBar.Label.Show(0);
            this._page.HeaderBar.LeftButton.Show(0);
            this._page.HeaderLeftLabel.Hide(0);
            this._page.EditButton.Hide(0);
            this._page.HeaderBar.RightButton.Show(0);

            _.each(this._page.OperationPanel.Children, (v) => {
                //if (v instanceof Controls.ControlButtonView)
                //    (v as Controls.ControlButtonView).SetRelocatable(true);
            });
        }

        public SetOperateMode(): void {
            const left = 10;
            this._page.OperationPanel.Position.Left = left;
            this._page.HeaderBar.Label.Hide(0);
            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.RightButton.Hide(0);
            this._page.HeaderLeftLabel.Show(0);
            this._page.EditButton.Show(0);

            _.each(this._page.OperationPanel.Children, (v) => {
                //if (v instanceof Controls.ControlButtonView)
                //    (v as Controls.ControlButtonView).SetRelocatable(false);
            });
        }

        /**
         * 操作対象シーンEnttiyをセットする。
         * @param entity
         */
        public SetEntity(entity: Entities.ControlSet): void {
        }

        private ApplyFromEntity(): void {
        }

        /**
         * 操作追加指示
         * @param e
         */
        private OnOrderedNewControl(e: Fw.Events.EventObject): void {
        }

        /**
         * シーンヘッダ情報の編集指示
         * @param e
         */
        private OnOrderedHeader(e: JQueryEventObject): void {
        }
    }
}
