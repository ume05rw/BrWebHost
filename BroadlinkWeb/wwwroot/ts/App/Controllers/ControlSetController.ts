﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;

    export class ControlSetController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlSetPageView;

        constructor() {
            super('ControlSet');

            this.SetClassName('ControlSetController');

            this.SetPageView(new Pages.ControlSetPageView());
            this._page = this.View as Pages.ControlSetPageView;

            this._page.HeaderBar.LeftButton.Hide(0);
            this._page.HeaderBar.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                this.SwitchTo("Main");
            });

            this._page.EditButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                this.SetUnmodal();
            });

            this._page.HeaderBar.RightButton.AddEventListener(Events.ButtonViewEvents.SingleClick, (e) => {
                this.OnOrderedNewControl(e);
                //const btn = new Controls.ControlButtonView();
                //btn.SetLeftTop(185, this._page.Size.Height - 90 - 75);
                //btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.EditOrdered, (e, p) => {
                //    Dump.Log(p);
                //    const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                //    ctr.SetControlButton(p.Sender as Controls.ControlButtonView);
                //    ctr.SetModal();
                //}, this);
                //btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.ExecOrdered, (e, p) => {
                //    Dump.Log(p);
                //}, this);
                //this._page.ButtonPanel.Add(btn);

                //// 再配置可能指示はパネルにaddした後で。
                //btn.SetRelocatable(true);
            });

            this._page.HeaderBar.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
                //if (e.eventPhase !== 2)
                //    return;
                //if (this._page.EditButton.IsVisible)
                //    return;

                //Dump.Log('Show Header Property');
                //const ctr = this.Manager.Get('ControlHeaderProperty');
                //ctr.SetModal();
            });
            this._page.HeaderBar.Label.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });
        }

        private OnOrderedNewControl(e: JQueryEventObject): void {
            const btn = new Controls.ControlButtonView();
            btn.SetLeftTop(185, this._page.Size.Height - 90 - 75);
            btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.EditOrdered, (e, p) => {
                Dump.Log(p);
                const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                ctr.SetControlButton(p.Sender as Controls.ControlButtonView);
                ctr.SetModal();
            }, this);
            btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.ExecOrdered, (e, p) => {
                Dump.Log(p);
            }, this);
            this._page.ButtonPanel.Add(btn);

            // 再配置可能指示はパネルにaddした後で。
            btn.SetRelocatable(true);
        }

        private OnOrderedHeader(e: JQueryEventObject): void {
            if (e.eventPhase !== 2)
                return;
            if (this._page.EditButton.IsVisible)
                return;

            Dump.Log('Show Header Property');
            const ctr = this.Manager.Get('ControlHeaderProperty');
            ctr.SetModal();
        }
    }
}