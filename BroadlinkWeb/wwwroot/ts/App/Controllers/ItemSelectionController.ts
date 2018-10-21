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

    export class ItemSelectionController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ItemSelectionPageView;
        private _parentController: Fw.Controllers.IController;
        private _resolve: (value: any) => void;

        constructor() {
            super('ItemSelection');

            this.SetPageView(new Pages.ItemSelectionPageView());
            this._page = this.View as Pages.ItemSelectionPageView;

            this.SetClassName('ItemSelectionController');
        }

        public async ShowSelector(parentController: Fw.Controllers.IController): Promise<any> {
            return new Promise<any>((resolve: (value: any) => void) => {
                this._parentController = parentController;
                this._resolve = resolve;
            });
        }

        protected Commit(selectedItem: any): void {
            if (!this._parentController || !this._resolve)
                throw new Error('Exec ShowSelector');

            try {
                this._resolve(selectedItem);
            } catch (e) {
                this.Log('ERROR!');
                Dump.ErrorLog(e);
            }

            this.HideModal();
            this._parentController.View.UnMask();

            this._parentController = null;
            this._resolve = null;
        }

        protected Cancel(): void {
            if (!this._parentController || !this._resolve)
                throw new Error('Exec ShowSelector');

            try {
                this._resolve(null);
            } catch (e) {
                this.Log('ERROR!');
                Dump.ErrorLog(e);
            }
            
            this.HideModal();
            this._parentController.View.UnMask();

            this._parentController = null;
            this._resolve = null;
        }
    }
}
