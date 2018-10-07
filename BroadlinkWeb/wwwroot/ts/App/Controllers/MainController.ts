/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />

namespace App.Controllers {
    export class MainController extends Fw.Controllers.ControllerBase {

        private _btnGoSub1: JQuery;
        private _btnGoSub2: JQuery;
        private _centerControl: Fw.Views.ControlView;

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            super(elem, manager);
            this.Init();
        }

        private Init(): void {
            this._btnGoSub1 = this.View.Elem.find('button[name=GoSub1]');
            this._btnGoSub2 = this.View.Elem.find('button[name=GoSub2]');

            this._btnGoSub1.click(() => {
                // イベント通知でなく、参照保持でよいか？
                this.Manager.Show("Sub1");
            });

            this._btnGoSub2.click(() => {
                // イベント通知でなく、参照保持でよいか？
                this.Manager.Show("Sub2");
            });

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
            tmpCtl.AddEventListener(Fw.Events.ControlEvents.SingleClick, () => {
                console.log('LONG CLICK!!');

                if (this._centerControl.IsVisible()) {
                    console.log('みえてんで！');
                    this._centerControl.Hide();
                } else {
                    console.log('みえへんで...？');
                    this._centerControl.Show();
                }
            });
            this.View.Add(tmpCtl);

            this.View.AddEventListener(Fw.Events.PageEvents.Shown, () => {
                console.log('MainView.Shown');
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