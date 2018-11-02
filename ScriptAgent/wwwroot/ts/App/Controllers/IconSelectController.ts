/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="ItemSelectControllerBase.ts" />

/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Controls/ItemSelectButtonView.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />


namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import ItemSelectButtonView = App.Views.Controls.ItemSelectButtonView;

    export class IconSelectController extends ItemSelectControllerBase {

        private _page: Pages.ItemSelectPageView;

        constructor() {
            super('IconSelect');

            this.SetClassName('IconSelectController');

            this._page = this.View as Pages.ItemSelectPageView;

            this._page.Label.Text = 'Select Icon';

            _.each(App.Items.Icon.Names, (name, idx) => {
                const btn = new ItemSelectButtonView();
                btn.Value = name;
                btn.ImageSrc = 'images/icons/' + name;
                btn.AddEventListener(ButtonEvents.SingleClick, (e) => {
                    const button = e.Sender as ItemSelectButtonView;
                    this.Commit(button.Value);
                });
                this._page.SelectorPanel.Add(btn);
            });
        }
    }
}
