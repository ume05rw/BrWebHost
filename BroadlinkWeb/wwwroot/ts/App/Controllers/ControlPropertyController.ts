/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Popup/AlertPopup.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import Popup = App.Views.Popup;

    export class ControlPropertyController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlPropertyPageView;
        private _control: App.Models.Entities.Control;

        constructor() {
            super('ControlProperty');

            this.SetClassName('ControlPropertyController');

            this.SetPageView(new Pages.ControlPropertyPageView());
            this._page = this.View as Pages.ControlPropertyPageView;
            this._control = null;

            this._page.TxtName.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._control)
                    return;

                //this.Log('ControlPropertyController.TxtName.Changed');
                this._control.Name = this._page.TxtName.Value;
                this._control.DispatchChanged();
            });

            this._page.BtnIcon.AddEventListener(Events.ButtonViewEvents.SingleClick, async () => {
                if (!this._control)
                    return;

                this.Log('ControlPropertyController.BtnIcon.SingleClick');

                const ctr = this.Manager.Get('IconSelect') as IconSelectController;
                const icon: string = await ctr.Select(this);

                const url = (icon)
                    ? 'images/icons/' + icon
                    : '';

                this._control.IconUrl = url;
                this._page.BtnIcon.ImageSrc = url;

                this._control.DispatchChanged();
            });

            this._page.BtnColor.AddEventListener(Events.ButtonViewEvents.SingleClick, async () => {
                if (!this._control)
                    return;

                this.Log('ControlPropertyController.BtnColor.SingleClick');

                const ctr = this.Manager.Get('ColorSelect') as ColorSelectController;
                const color: string = await ctr.Select(this);

                this._control.Color = color;
                this._page.BtnColor.Color = color;
                this._page.BtnColor.BackgroundColor = color;
                this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(color);

                this._control.DispatchChanged();
            });

            this._page.TarCode.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._control)
                    return;

                //this.Log('ControlPropertyController.TarCode.Changed');
                this._control.Code = this._page.TarCode.Value;
                this._control.DispatchChanged();
            });

            this._page.ChkToggleOn.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._control)
                    return;

                //this.Log('ControlPropertyController.ChkToggleOn.Changed');
                this._control.IsAssignToggleOn = this._page.ChkToggleOn.BoolValue;
                this._control.DispatchChanged();
            });

            this._page.ChkToggleOff.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._control)
                    return;

                //this.Log('ControlPropertyController.ChkToggleOff.Changed');
                this._control.IsAssignToggleOff = this._page.ChkToggleOff.BoolValue;
                this._control.DispatchChanged();
            });


            this._page.DeleteButton.AddEventListener(Events.ButtonViewEvents.SingleClick, async () => {
                if (!this._control)
                    return;

                const res = await Popup.Confirm.OpenAsync({
                    Message: 'Button will be removed.<br/>Are you ok?'
                });

                if (res !== true)
                    return;

                const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                ctr.RemoveControl(this._control);

                this._control = null;
                this.HideModal();
            });
        }

        public SetEntity(control: App.Models.Entities.Control): void {
            this._control = control;

            this._page.TxtName.Value = this._control.Name;
            this._page.BtnIcon.ImageSrc = this._control.IconUrl;

            this._page.BtnColor.Color = this._control.Color;
            this._page.BtnColor.BackgroundColor = this._control.Color;
            this._page.BtnColor.HoverColor = App.Items.Color.GetButtonHoverColor(this._control.Color);

            this._page.TarCode.Value = this._control.Code;
            this._page.ChkToggleOn.BoolValue = this._control.IsAssignToggleOn;
            this._page.ChkToggleOff.BoolValue = this._control.IsAssignToggleOff;
        }
    }
}
