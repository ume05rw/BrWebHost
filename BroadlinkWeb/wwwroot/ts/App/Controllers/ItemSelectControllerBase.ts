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
/// <reference path="../Events/Controls/ControlButtonViewEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import EntityEvents = Fw.Events.EntityEvents;
    import ButtonViewEvents = Fw.Events.ButtonViewEvents;
    import ControlButtonViewEvents = App.Events.Controls.ControlButtonViewEvents;

    export abstract class ItemSelectControllerBase extends Fw.Controllers.ControllerBase {

        
        private _parentController: Fw.Controllers.IController;
        private _resolve: (value: any) => void;
        //private _callback: (value: any) => void;

        constructor(controllerId) {
            super(controllerId);

            this.SetPageView(new Pages.ItemSelectPageView());
            this.SetClassName('ItemSelectController');
            this.LogEnable = true;
        }

        public async Select(parentController: Fw.Controllers.IController): Promise<any> {
            this.Log('ShowSelector');
            return new Promise<any>((resolve: (value: any) => void) => {
                this.Log('ShowSelector.Promise');
                this._parentController = parentController;
                this._resolve = resolve;
                //this._callback = (value: any) => {
                //    resolve(value);
                //};
                this.View.ShowModal();
                this._parentController.View.Mask();
            });
        }

        protected Commit(selectedItem: any): void {
            this.Log('Commit: ' + selectedItem);
            console.log(this._resolve);

            if (!this._parentController || !this._resolve)
                throw new Error('Exec Select');

            try {
                this._resolve(selectedItem);
            } catch (e) {
                this.Log('ERROR!');
                Dump.ErrorLog(e);
            }
            this._resolve = null;

            this.Reset();
        }

        protected Cancel(): void {
            this.Log('Cancel');
            if (!this._parentController || !this._resolve)
                throw new Error('Exec Select');

            try {
                this._resolve(null);
            } catch (e) {
                this.Log('ERROR!');
                Dump.ErrorLog(e);
            }
            this._resolve = null;
            
            this.Reset();
        }

        public HideModal(): void {
            this.Log('HideModal');
            super.HideModal();

            if (this._resolve) {
                this._resolve(null);
                this._resolve = null;
            }
        }

        private Reset(): void {
            this.Log('Reset');
            this._resolve = null;

            this.HideModal();
            if (this._parentController.View.IsModal) {
                this._parentController.View.ShowModal();
            } else {
                if (this._parentController.View.IsMasked)
                    this._parentController.View.UnMask();
            }

            this._parentController = null;
        }
    }
}
