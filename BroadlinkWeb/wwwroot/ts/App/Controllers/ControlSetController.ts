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

    export class ControlSetController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlSetPageView;
        private _controlSet: App.Models.Entities.ControlSet;

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
            });

            this._page.HeaderBar.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });
            this._page.HeaderBar.Label.Elem.on('click', (e) => {
                this.OnOrderedHeader(e);
            });
        }

        public SetControlSet(entity: App.Models.Entities.ControlSet): void {

            if (this._controlSet) {
                this._controlSet.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity);
            }

            this._controlSet = entity;

            if (this._controlSet) {
                this._controlSet.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

                // TODO: controlSet配下のControlの数分だけ、ControlボタンViewを生成して追加する。
                _.each(this._controlSet.Controls, (control) => {
                    const btn = new Controls.ControlButtonView();
                    btn.Control = control;
                    btn.SetLeftTop(control.PositionLeft, control.PositionTop);
                    btn.SetColor(control.Color);
                    btn.SetImage(control.IconUrl);

                    btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.EditOrdered, (e, p) => {
                        Dump.Log(p);
                        const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                        const button = p.Sender as Controls.ControlButtonView;
                        ctr.SetControl(button.Control);
                        ctr.SetModal();
                    }, this);

                    btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.ExecOrdered, (e, p) => {
                        Dump.Log(p);
                    }, this);

                    this._page.ButtonPanel.Add(btn);
                });
            }

            this.ApplyFromEntity();
        }

        private ApplyFromEntity(): void {
            if (!this._controlSet)
                return;

            this._page.HeaderBar.Text = this._controlSet.Name;
        }

        private OnOrderedNewControl(e: JQueryEventObject): void {
            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            const control = new App.Models.Entities.Control();
            control.ControlSetId = this._controlSet.Id;
            this._controlSet.Controls.push(control);

            const btn = new Controls.ControlButtonView();
            btn.Control = control;
            btn.SetLeftTop(185, this._page.Size.Height - 90 - 75);

            btn.AddEventListener(App.Events.Controls.ControlButtonViewEvents.EditOrdered, (e, p) => {
                Dump.Log(p);
                const ctr = this.Manager.Get('ControlProperty') as ControlPropertyController;
                const button = p.Sender as Controls.ControlButtonView;
                ctr.SetControl(button.Control);
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

            if (!this._controlSet)
                throw new Error('ControlSet Not Found');

            Dump.Log('Show Header Property');
            const ctr = this.Manager.Get('ControlHeaderProperty') as ControlHeaderPropertyController;
            ctr.SetControlSet(this._controlSet);
            ctr.SetModal();
        }
    }
}