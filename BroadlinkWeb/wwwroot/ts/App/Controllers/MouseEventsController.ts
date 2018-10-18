/// <reference path="../../../lib/jquery/index.d.ts" />
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

    export class MouseEventsController extends Fw.Controllers.ControllerBase {

        public HeaderBar: Controls.HeaderBarView;

        constructor() {
            super('MouseEvents');

            this.HeaderBar = new Controls.HeaderBarView();

            this.SetClassName('ControlSetController');

            this.SetPageView(new Fw.Views.PageView());


            this.HeaderBar.Text = 'Remote Control';
            this.HeaderBar.RightButton.Hide(0);
            this.View.Add(this.HeaderBar);

            this.HeaderBar.LeftButton.Hide(0);
            this.HeaderBar.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                this.SwitchTo("Main");
            });

            this.View.Elem.on('click', (e) => {
                Dump.Log('click');
            });
            this.View.Elem.on('mousedown', (e) => {
                Dump.Log('mousedown');
            });
            this.View.Elem.on('mousemove', (e) => {
                Dump.Log('mousemove');
            });
            this.View.Elem.on('mouseup', (e) => {
                Dump.Log('mouseup');
            });
            this.View.Elem.on('mouseout', (e) => {
                Dump.Log('mouseout');
            });

            this.View.Elem.on('touchstart', (e) => {
                Dump.Log('touchstart');
            });
            this.View.Elem.on('touchmove', (e) => {
                Dump.Log('touchmove');
            });
            this.View.Elem.on('touchend', (e) => {
                Dump.Log('touchend');
            });

        }
    }
}