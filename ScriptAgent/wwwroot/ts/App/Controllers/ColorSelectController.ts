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

    export class ColorSelectController extends ItemSelectControllerBase {

        private _page: Pages.ItemSelectPageView;

        constructor() {
            super('ColorSelect');

            this.SetClassName('ColorSelectController');

            this._page = this.View as Pages.ItemSelectPageView;

            this._page.Label.Text = 'Select Color';

            _.each(App.Items.Color.ButtonColors, (color, idx) => {
                const btn = new ItemSelectButtonView();
                btn.Value = color;
                btn.Color = color;
                btn.BackgroundColor = color;
                btn.HoverColor = App.Items.Color.ButtonHoverColors[idx];
                btn.AddEventListener(ButtonEvents.SingleClick, (e) => {
                    const button = e.Sender as ItemSelectButtonView;
                    this.Commit(button.Value);
                });
                this._page.SelectorPanel.Add(btn);
            });
        }
    }
}
