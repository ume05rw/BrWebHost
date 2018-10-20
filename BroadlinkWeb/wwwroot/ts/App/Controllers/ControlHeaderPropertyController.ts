/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import EntityEvents = Fw.Events.EntityEvents;

    export class ControlHeaderPropertyController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlHeaderPropertyPageView;

        private _controlSet: App.Models.Entities.ControlSet;

        constructor() {
            super('ControlHeaderProperty');

            this.SetClassName('ControlHeaderPropertyController');

            this.SetPageView(new Pages.ControlHeaderPropertyPageView());
            this._page = this.View as Pages.ControlHeaderPropertyPageView;
            this._controlSet = null;

            this._page.TxtName.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._controlSet)
                    return;

                this._controlSet.Name = this._page.TxtName.Value;
                this._controlSet.DispatchChanged();
            });

            this._page.SboRm.AddEventListener(Events.InputViewEvents.Changed, (je, eo) => {
                if (!this._controlSet)
                    return;

                if ($.isNumeric(this._page.SboRm.Value)) {
                    this._controlSet.BrDeviceId = parseInt(this._page.SboRm.Value, 10);
                    this._controlSet.DispatchChanged();
                }
            });

            this._page.TmpRegistButton.AddEventListener(Events.ButtonViewEvents.SingleClick, async () => {
                // 仮機能 - 新規ControlSetを保存する。
                Dump.Log('Register');
                Dump.Log(this._controlSet);
                const res = await App.Models.Stores.ControlSets.Write(this._controlSet);
                Dump.Log('Register Completed?');
                Dump.Log(res);
            });
        }


        public SetControlSet(entity: App.Models.Entities.ControlSet): void {
            this._controlSet = entity;

            this._page.TxtName.Value = this._controlSet.Name;
            this._page.SboRm.Value = String(this._controlSet.BrDeviceId);
        }
    }
}