﻿/// <reference path="../../../lib/jquery/index.d.ts" />
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
        private _currentButton: Controls.ControlButtonView;

        constructor() {
            super('ControlProperty');

            this.SetClassName('ControlPropertyController');

            this.SetPageView(new Pages.ControlPropertyPageView());
            this._page = this.View as Pages.ControlPropertyPageView;

            this._page.TxtName.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._currentButton)
                    return;

                Dump.Log('ControlPropertyController.TxtName.Changed');
                this._currentButton.Name = this._page.TxtName.Value;
                this._currentButton.Refresh();
            });

            this._page.SboIcon.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._currentButton)
                    return;

                Dump.Log('ControlPropertyController.SboIcon.Changed');
                this._currentButton.SetImage(this._page.SboIcon.Value);
                this._currentButton.Refresh();
                
            });

            this._page.SboColor.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._currentButton)
                    return;

                Dump.Log('ControlPropertyController.SboColor.Changed');
                this._currentButton.SetColor(this._page.SboColor.Value);
                this._currentButton.Refresh();
            });

            this._page.TarCode.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._currentButton)
                    return;

                Dump.Log('ControlPropertyController.TarCode.Changed');
                this._currentButton.Code = this._page.TarCode.Value;
                this._currentButton.Refresh();
            });

            this._page.DeleteButton.AddEventListener(Events.ButtonViewEvents.SingleClick, async () => {
                if (!this._currentButton)
                    return;

                Dump.Log('Delete this Control!');
                const res = await Popup.Confirm.OpenAsync({
                    Message: 'Button will be removed.<br/>Are you ok?'
                });
                Dump.Log('hello?');
                Dump.Log(`result: ${res}`);
                Dump.Log('OK. this ref is OK?: ' + this.ClassName);
            });
        }

        public SetControlButton(view: Controls.ControlButtonView): void {
            this._currentButton = view;

            this._page.TxtName.Value = this._currentButton.Name;
            this._page.SboIcon.Value = this._currentButton.ImageSrc;
            this._page.SboColor.Value = this._currentButton.Color;
            this._page.TarCode.Value = this._currentButton.Code;
        }
    }
}