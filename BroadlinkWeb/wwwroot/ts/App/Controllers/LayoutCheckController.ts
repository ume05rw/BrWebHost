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

    export class LayoutCheckController extends Fw.Controllers.ControllerBase {

        constructor(id: string) {
            super(id);

            this.Init();
        }

        private Init(): void {
            this.SetClassName('LayoutCheckController');

            this.SetPageView(new Pages.LayoutCheckPageView());
            const page = this.View as Pages.LayoutCheckPageView;

            page.BtnGoSub1.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                // イベント通知でなく、参照保持でよいか？
                this.Manager.Get("Sub1").Show();
            });

            page.BtnGoSub2.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                // イベント通知でなく、参照保持でよいか？
                this.Manager.Get("Sub2").Show();
            });

            page.TmpCtl.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                this.Log(`${this.ClassName}.SingleClick1`);
                if (page.CenterControl.IsVisible) {
                    this.Log('みえてんで！');
                    page.CenterControl.Hide();
                } else {
                    this.Log('みえへんで...？');
                    page.CenterControl.Show();
                }
            });

            this.View.AddEventListener(Events.PageViewEvents.Shown, () => {
                this.Log(`${this.ClassName}.Shown`);
            });

            page.AncCtl4.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                //this.Log(`${this.ClassName}.SingleClick2`);
                page.IsMasked
                    ? page.UnMask()
                    : page.Mask();
            });
        }
    }
}
