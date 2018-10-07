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
            this._centerControl.SetDisplayParams(0, 0, 100, 50, '1155FF');
            this._centerControl.Label = 'はろー<br/>どうよ？';
            this.View.Add(this._centerControl);

            const tmpCtl = new Fw.Views.ControlView();
            tmpCtl.SetDisplayParams(-100, -100, 200, 200, '666666');
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

            const ancCtl1 = new Fw.Views.AnchoredControlView();
            ancCtl1.Label = '右下';
            ancCtl1.Width = 100;
            ancCtl1.Height = 30;
            ancCtl1.IsAnchorRight = true;
            ancCtl1.IsAnchorBottom = true;
            ancCtl1.AnchorMarginRight = 40;
            ancCtl1.AnchorMarginBottom = 5;
            this.View.Add(ancCtl1);

            const ancCtl2 = new Fw.Views.AnchoredControlView();
            ancCtl2.Label = '右上';
            ancCtl2.Width = 200;
            ancCtl2.Height = 50;
            ancCtl2.IsAnchorRight = true;
            ancCtl2.IsAnchorTop = true;
            ancCtl2.AnchorMarginRight = 3;
            ancCtl2.AnchorMarginTop = 3;
            this.View.Add(ancCtl2);

            const ancCtl3 = new Fw.Views.AnchoredControlView();
            ancCtl3.Label = '左下';
            ancCtl3.Width = 200;
            ancCtl3.Height = 50;
            ancCtl3.IsAnchorLeft = true;
            ancCtl3.IsAnchorBottom = true;
            ancCtl3.AnchorMarginLeft = 3;
            ancCtl3.AnchorMarginBottom = 3;
            this.View.Add(ancCtl3);

            const ancCtl4 = new Fw.Views.AnchoredControlView();
            ancCtl4.Label = '左上';
            ancCtl4.Width = 200;
            ancCtl4.Height = 50;
            ancCtl4.IsAnchorLeft = true;
            ancCtl4.IsAnchorTop = true;
            ancCtl4.AnchorMarginLeft = 3;
            ancCtl4.AnchorMarginTop = 3;
            this.View.Add(ancCtl4);

            const ancCtl5 = new Fw.Views.AnchoredControlView();
            ancCtl5.Label = '左右';
            ancCtl5.Height = 50;
            ancCtl5.IsAnchorBottom = true;
            ancCtl5.IsAnchorLeft = true;
            ancCtl5.IsAnchorRight = true;
            ancCtl5.AnchorMarginLeft = 150;
            ancCtl5.AnchorMarginRight = 300;
            ancCtl5.AnchorMarginBottom = 100;
            this.View.Add(ancCtl5);

            const ancCtl6 = new Fw.Views.AnchoredControlView();
            ancCtl6.Label = '上下';
            ancCtl6.IsAnchorTop = true;
            ancCtl6.IsAnchorBottom = true;
            ancCtl6.AnchorMarginTop = 200;
            ancCtl6.AnchorMarginBottom = 40;
            this.View.Add(ancCtl6);
        }
    }
}