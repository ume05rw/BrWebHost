/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Popup/AlertPopup.ts" />
/// <reference path="../Models/Entities/BrDevice.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/DeviceType.ts" />
/// <reference path="../Items/Lang/Lang.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import EntityEvents = Fw.Events.EntityEvents;
    import Popup = App.Views.Popup;
    import Stores = App.Models.Stores;
    import Entities = App.Models.Entities;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;
    import Lang = App.Items.Lang.Lang;

    export class SceneHeaderPropertyController extends Fw.Controllers.ControllerBase {

        private _page: Pages.SceneHeaderPropertyPageView;

        private _scene: App.Models.Entities.Scene;

        constructor() {
            super('SceneHeaderProperty');

            this.SetClassName('SceneHeaderPropertyController');

            this.SetPageView(new Pages.SceneHeaderPropertyPageView());
            this._page = this.View as Pages.SceneHeaderPropertyPageView;
            this._scene = null;

            this._page.TxtName.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                if (!this._scene)
                    return;

                this._scene.Name = this._page.TxtName.Value;
                this._scene.DispatchChanged();
            });

            this._page.BtnColor.AddEventListener(Events.ButtonViewEvents.SingleClick, async (e) => {
                if (!this._scene)
                    return;

                //this.Log('SceneHeaderPropertyController.BtnColor.SingleClick');

                const ctr = this.Manager.Get('ColorSelect') as ColorSelectController;
                const color: string = await ctr.Select(this);

                this._scene.Color = color;
                this._page.BtnColor.Color = color;
                this._page.BtnColor.BackgroundColor = color;
                this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(color);

                this._scene.DispatchChanged();
            });

            this._page.DeleteButton.AddEventListener(Events.ButtonViewEvents.SingleClick, async (e) => {
                if (!this._scene)
                    return;

                const res = await Popup.Confirm.OpenAsync({
                    Message: Lang.ThisSceneWillBeRemoved
                });

                if (res !== true)
                    return;

                const ctr = this.Manager.Get('Scene') as SceneController;
                ctr.RemoveScene();

                this._scene = null;
                this.HideModal();
            });
        }


        public SetEntity(scene: Entities.Scene): void {
            if (!scene)
                return;

            this._scene = null;

            this._page.TxtName.Value = scene.Name;

            this._page.LabelColor.Show(0);
            this._page.BtnColor.Show(0);
            this._page.DeleteButton.Show(0);
            this._page.BtnColor.Color = scene.Color;
            this._page.BtnColor.BackgroundColor = scene.Color;
            this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(scene.Color);

            this._scene = scene;
        }
    }
}
