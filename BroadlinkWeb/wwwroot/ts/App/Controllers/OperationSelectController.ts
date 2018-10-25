/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="ItemSelectControllerBase.ts" />

/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Controls/LabeledButtonView.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../Items/Operation.ts" />
/// <reference path="../Items/Color.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import LabeledButtonView = App.Views.Controls.LabeledButtonView;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import Operation = App.Items.Operation;
    import Color = App.Items.Color;

    export class OperationSelectController extends ItemSelectControllerBase {

        private _page: Pages.ItemSelectPageView;

        constructor() {
            super('OperationSelect');

            this.SetClassName('OperationSelectController');

            this._page = this.View as Pages.ItemSelectPageView;

            this.InitView();
        }

        private InitView(): void {
            this._page.Label.Text = 'Select New Operation';

            // シーン
            const btn1 = this.GetNewButton();
            btn1.Label.Text = 'Scene';
            btn1.Button.ImageSrc = App.Items.Icon.Scene;
            btn1.Button.BackgroundColor = Color.MainBackground;
            btn1.Button.HoverColor = Color.MainHover;
            btn1.Button.Color = Color.MainHover;
            btn1.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(Operation.Scene);
            });
            this._page.SelectorPanel.Add(btn1);

            // 区切り線
            const line = new Fw.Views.LineView(Property.Direction.Horizontal);
            line.SetAnchor(null, 5, 5, null);
            line.Color = App.Items.Color.MainBackground;
            this._page.SelectorPanel.Add(line);

            // TV
            const btn2 = this.GetNewButton();
            btn2.Label.Text = 'TV';
            btn2.Button.ImageSrc = App.Items.Icon.Tv;
            btn2.Button.BackgroundColor = Color.ButtonColors[4];
            btn2.Button.HoverColor = Color.ButtonHoverColors[4];
            btn2.Button.Color = Color.ButtonColors[4];
            btn2.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(Operation.Tv);
            });
            this._page.SelectorPanel.Add(btn2);

            // AV
            const btn3 = this.GetNewButton();
            btn3.Label.Text = 'AV';
            btn3.Button.ImageSrc = App.Items.Icon.Av;
            btn3.Button.BackgroundColor = Color.ButtonColors[5];
            btn3.Button.HoverColor = Color.ButtonHoverColors[5];
            btn3.Button.Color = Color.ButtonColors[5];
            btn3.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(Operation.Av);
            });
            this._page.SelectorPanel.Add(btn3);

            // 照明
            const btn4 = this.GetNewButton();
            btn4.Label.Text = 'Light';
            btn4.Button.ImageSrc = App.Items.Icon.Light;
            btn4.Button.BackgroundColor = Color.ButtonColors[3];
            btn4.Button.HoverColor = Color.ButtonHoverColors[3];
            btn4.Button.Color = Color.ButtonColors[3];
            btn4.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(Operation.Light);
            });
            this._page.SelectorPanel.Add(btn4);

            // フリー編集
            const btn5 = this.GetNewButton();
            btn5.Label.Text = 'Free';
            btn5.Button.ImageSrc = App.Items.Icon.Free;
            btn5.Button.BackgroundColor = Color.ButtonColors[7];
            btn5.Button.HoverColor = Color.ButtonHoverColors[7];
            btn5.Button.Color = Color.ButtonColors[7];
            btn5.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(Operation.Free);
            });
            this._page.SelectorPanel.Add(btn5);

            //// WoL
            //const btn6 = this.GetNewButton();
            //btn6.Label.Text = 'WoL';
            //btn6.Button.ImageSrc = App.Icon.WoL;
            //btn6.AddEventListener(ButtonEvents.SingleClick, () => {
            //    this.Commit(Operation.WoL);
            //});
            //this._page.SelectorPanel.Add(btn6);

            //// ローカル実行
            //const btn7 = this.GetNewButton();
            //btn7.Label.Text = 'Script';
            //btn7.Button.ImageSrc = App.Icon.Script;
            //btn7.AddEventListener(ButtonEvents.SingleClick, () => {
            //    this.Commit(Operation.Script);
            //});
            //this._page.SelectorPanel.Add(btn7);

            //// リモート実行
            //const btn8 = this.GetNewButton();
            //btn8.Label.Text = 'Remote';
            //btn8.Button.ImageSrc = App.Icon.Remote;
            //btn8.AddEventListener(ButtonEvents.SingleClick, () => {
            //    this.Commit(Operation.Remote);
            //});
            //this._page.SelectorPanel.Add(btn8);
        }

        private GetNewButton(): LabeledButtonView {
            const button = new LabeledButtonView();
            button.SetSize(75, 95);
            button.Button.Position.Policy = Property.PositionPolicy.LeftTop;
            button.Button.HasBorder = true;
            button.Button.BorderRadius = 10;
            button.Button.BackgroundColor = App.Items.Color.MainBackground;
            button.Button.HoverColor = App.Items.Color.ButtonHoverColors[0];
            button.Button.Color = App.Items.Color.ButtonColors[0];
            button.Button.ImageFitPolicy = Property.FitPolicy.Auto;
            return button;
        }
    }
}
