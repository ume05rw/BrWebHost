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
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/DeviceType.ts" />

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

    export class ControlHeaderPropertyController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlHeaderPropertyPageView;

        private _controlSet: App.Models.Entities.ControlSet;

        constructor() {
            super('ControlHeaderProperty');

            this.SetClassName('ControlHeaderPropertyController');

            this.SetPageView(new Pages.ControlHeaderPropertyPageView());
            this._page = this.View as Pages.ControlHeaderPropertyPageView;
            this._controlSet = null;

            this._page.TxtName.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                if (!this._controlSet)
                    return;

                this._controlSet.Name = this._page.TxtName.Value;
                this._controlSet.DispatchChanged();
            });

            this._page.BtnColor.AddEventListener(Events.ButtonViewEvents.SingleClick, async (e) => {
                if (!this._controlSet)
                    return;

                this.Log('ControlPropertyController.BtnColor.SingleClick');

                const ctr = this.Manager.Get('ColorSelect') as ColorSelectController;
                const color: string = await ctr.Select(this);

                this._controlSet.Color = color;
                this._page.BtnColor.Color = color;
                this._page.BtnColor.BackgroundColor = color;
                this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(color);

                this._controlSet.DispatchChanged();
            });

            this._page.SboRm.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                if (!this._controlSet)
                    return;

                if ($.isNumeric(this._page.SboRm.Value)) {
                    this._controlSet.BrDeviceId = parseInt(this._page.SboRm.Value, 10);
                    this._controlSet.DispatchChanged();
                }
            });

            this._page.DeleteButton.AddEventListener(Events.ButtonViewEvents.SingleClick, async (e) => {
                if (!this._controlSet)
                    return;

                const res = await Popup.Confirm.OpenAsync({
                    Message: 'This Remote Control will be REMOVED.<br/>Are you ok?'
                });

                if (res !== true)
                    return;

                const ctr = App.Controllers.CSControllerFactory.Get(this._controlSet);
                ctr.RemoveControlSet();

                this._controlSet = null;
                this.HideModal();
            });
        }


        public SetEntity(controlSet: Entities.ControlSet): void {
            if (!controlSet)
                return;

            this._controlSet = null;

            this._page.TxtName.Value = controlSet.Name;

            this._page.LabelColor.Show(0);
            this._page.BtnColor.Show(0);
            this._page.LabelRm.Hide(0);
            this._page.SboRm.Hide(0);
            this._page.DeleteButton.Show(0);

            this._page.BtnColor.Color = controlSet.Color;
            this._page.BtnColor.BackgroundColor = controlSet.Color;
            this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(controlSet.Color);

            this._controlSet = controlSet;
        }
    }
}
