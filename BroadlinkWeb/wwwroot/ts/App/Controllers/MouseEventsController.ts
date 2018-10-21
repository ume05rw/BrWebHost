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
                this.Log('click');
            });
            this.View.Elem.on('mousedown', (e) => {
                this.Log('mousedown');
            });
            this.View.Elem.on('mousemove', (e) => {
                this.Log('mousemove');
            });
            this.View.Elem.on('mouseup', (e) => {
                this.Log('mouseup');
            });
            this.View.Elem.on('mouseout', (e) => {
                this.Log('mouseout');
            });

            this.View.Elem.on('touchstart', (e) => {
                this.Log('touchstart');
            });
            this.View.Elem.on('touchmove', (e) => {
                this.Log('touchmove');
            });
            this.View.Elem.on('touchend', (e) => {
                this.Log('touchend');
            });

        }
    }
}
