/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;

    export class MainController extends Fw.Controllers.ControllerBase {
        private _centerControl: Fw.Views.ControlView;

        constructor(elem: JQuery) {
            super(elem);
            this.Init();
        }

        private Init(): void {

            const btnGoSub1 = new Fw.Views.ControlView();
            btnGoSub1.Label = 'Go Sub1';
            btnGoSub1.SetSize(80, 30);
            btnGoSub1.SetAnchor(null, 10, null, null);
            btnGoSub1.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                // イベント通知でなく、参照保持でよいか？
                Manager.Instance.Show("Sub1");
            });
            this.View.Add(btnGoSub1);

            const btnGoSub2 = new Fw.Views.ControlView();
            btnGoSub2.Label = 'Go Sub2';
            btnGoSub2.SetSize(80, 30);
            btnGoSub2.Position.Y = 40;
            btnGoSub2.SetAnchor(null, 10, null, null);
            btnGoSub2.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                // イベント通知でなく、参照保持でよいか？
                Manager.Instance.Show("Sub2");
            });
            this.View.Add(btnGoSub2);


            this._centerControl = new Fw.Views.ControlView();
            this._centerControl.SetPosition(0, 0);
            this._centerControl.SetSize(100, 50);
            this._centerControl.Color = '#1155FF';
            this._centerControl.Label = 'はろー<br/>どうよ？';
            this.View.Add(this._centerControl);

            const tmpCtl = new Fw.Views.ControlView();
            tmpCtl.SetPosition(-100, -100);
            tmpCtl.SetSize(200, 200);
            tmpCtl.Color = '#666666';

            tmpCtl.Label = 'くりっく';
            tmpCtl.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Dump.Log('LONG CLICK!!');

                if (this._centerControl.IsVisible()) {
                    Dump.Log('みえてんで！');
                    this._centerControl.Hide();
                } else {
                    Dump.Log('みえへんで...？');
                    this._centerControl.Show();
                }
            });
            this.View.Add(tmpCtl);

            this.View.AddEventListener(Events.PageViewEvents.Shown, () => {
                Dump.Log('MainView.Shown');
            });

            const ancCtl1 = new Fw.Views.ControlView();
            ancCtl1.Label = '右下';
            ancCtl1.Size.Width = 100;
            ancCtl1.Size.Height = 30;
            ancCtl1.SetAnchor(null, null, 40, 5);
            this.View.Add(ancCtl1);

            const ancCtl2 = new Fw.Views.ControlView();
            ancCtl2.Label = '右上';
            ancCtl2.Size.Width = 200;
            ancCtl2.Size.Height = 50;
            ancCtl2.SetAnchor(3, null, 3, null);
            this.View.Add(ancCtl2);

            const ancCtl3 = new Fw.Views.ControlView();
            ancCtl3.Label = '左下';
            ancCtl3.Size.Width = 200;
            ancCtl3.Size.Height = 50;
            ancCtl3.SetAnchor(null, 3, null, 3);
            this.View.Add(ancCtl3);

            const ancCtl4 = new Fw.Views.ControlView();
            ancCtl4.Label = '左上';
            ancCtl4.Size.Width = 200;
            ancCtl4.Size.Height = 50;
            ancCtl4.SetAnchor(60, 3, null, null);
            this.View.Add(ancCtl4);

            const ancCtl5 = new Fw.Views.ControlView();
            ancCtl5.Label = '左右';
            ancCtl5.Size.Height = 50;
            ancCtl5.SetAnchor(null, 150, 300, 100);
            this.View.Add(ancCtl5);

            const ancCtl6 = new Fw.Views.ControlView();
            ancCtl6.Label = '上下';
            ancCtl6.SetAnchor(200, null, null, 40);
            ancCtl6.Size.Width = 30;
            this.View.Add(ancCtl6);
        }
    }
}