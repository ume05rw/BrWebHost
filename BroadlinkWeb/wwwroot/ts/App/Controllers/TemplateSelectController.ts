/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="ItemSelectControllerBase.ts" />

/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Controls/LabelAndButtonView.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../Items/OperationTemplate.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/Icon.ts" />
/// <reference path="../Items/Lang/Lang.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import LabelAndButtonView = App.Views.Controls.LabelAndButtonView;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import OperationTemplate = App.Items.OperationTemplate;
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;
    import Lang = App.Items.Lang.Lang;

    export class TemplateSelectController extends ItemSelectControllerBase {

        private _page: Pages.ItemSelectPageView;

        constructor() {
            super('TemplateSelect');

            this.SetClassName('TemplateSelectController');

            this._page = this.View as Pages.ItemSelectPageView;

            this.InitView();
        }

        private InitView(): void {
            this._page.Label.Text = Lang.SelectNewOperation;

            // TV
            const btn2 = this.GetNewButton();
            btn2.Label.Text = Lang.Tv;
            btn2.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Tv);
            btn2.Button.BackgroundColor = Color.ButtonColors[4];
            btn2.Button.HoverColor = Color.ButtonHoverColors[4];
            btn2.Button.Color = Color.ButtonColors[4];
            btn2.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Tv);
            });
            this._page.SelectorPanel.Add(btn2);

            // AV
            const btn3 = this.GetNewButton();
            btn3.Label.Text = Lang.Av;
            btn3.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Av);
            btn3.Button.BackgroundColor = Color.ButtonColors[5];
            btn3.Button.HoverColor = Color.ButtonHoverColors[5];
            btn3.Button.Color = Color.ButtonColors[5];
            btn3.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Av);
            });
            this._page.SelectorPanel.Add(btn3);

            // 照明
            const btn4 = this.GetNewButton();
            btn4.Label.Text = Lang.Light;
            btn4.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Light);
            btn4.Button.BackgroundColor = Color.ButtonColors[3];
            btn4.Button.HoverColor = Color.ButtonHoverColors[3];
            btn4.Button.Color = Color.ButtonColors[3];
            btn4.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Light);
            });
            this._page.SelectorPanel.Add(btn4);

            // フリー編集
            const btn5 = this.GetNewButton();
            btn5.Label.Text = Lang.Free;
            btn5.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Free);
            btn5.Button.BackgroundColor = Color.ButtonColors[7];
            btn5.Button.HoverColor = Color.ButtonHoverColors[7];
            btn5.Button.Color = Color.ButtonColors[7];
            btn5.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Free);
            });
            this._page.SelectorPanel.Add(btn5);

            // 区切り線
            const line2 = new Fw.Views.LineView(Property.Direction.Horizontal);
            line2.SetAnchor(null, 5, 5, null);
            line2.Color = App.Items.Color.MainBackground;
            this._page.SelectorPanel.Add(line2);

            // WoL
            const btn6 = this.GetNewButton();
            btn6.Label.Text = Lang.Wol;
            btn6.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.WoL);
            btn6.Button.BackgroundColor = Color.ButtonColors[2];
            btn6.Button.HoverColor = Color.ButtonHoverColors[2];
            btn6.Button.Color = Color.ButtonColors[2];
            btn6.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.WoL);
            });
            this._page.SelectorPanel.Add(btn6);

            // ローカル実行
            const btn7 = this.GetNewButton();
            btn7.Label.Text = Lang.Script;
            btn7.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Script);
            btn7.Button.BackgroundColor = Color.ButtonColors[2];
            btn7.Button.HoverColor = Color.ButtonHoverColors[2];
            btn7.Button.Color = Color.ButtonColors[2];
            btn7.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Script);
            });
            this._page.SelectorPanel.Add(btn7);

            // リモート実行
            const btn8 = this.GetNewButton();
            btn8.Label.Text = Lang.Remote;
            btn8.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.RemoteHostScript);
            btn8.Button.BackgroundColor = Color.ButtonColors[2];
            btn8.Button.HoverColor = Color.ButtonHoverColors[2];
            btn8.Button.Color = Color.ButtonColors[2];
            btn8.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.RemoteHostScript);
            });
            this._page.SelectorPanel.Add(btn8);

            // 区切り線
            const line1 = new Fw.Views.LineView(Property.Direction.Horizontal);
            line1.SetAnchor(null, 5, 5, null);
            line1.Color = App.Items.Color.MainBackground;
            this._page.SelectorPanel.Add(line1);

            // シーン
            const btn1 = this.GetNewButton();
            btn1.Label.Text = Lang.Scene;
            btn1.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Scene);
            btn1.Button.Color = Color.ButtonColors[8];
            btn1.Button.BackgroundColor = Color.ButtonColors[8]
            btn1.Button.HoverColor = Color.ButtonHoverColors[8];
            btn1.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Scene);
            });
            this._page.SelectorPanel.Add(btn1);

            // スケジュール
            const btn9 = this.GetNewButton();
            btn9.Label.Text = Lang.Timer;
            btn9.Button.ImageSrc = Icon.GetByOperationTemplate(OperationTemplate.Schedule);
            btn9.Button.Color = Color.ButtonColors[9];
            btn9.Button.BackgroundColor = Color.ButtonColors[9]
            btn9.Button.HoverColor = Color.ButtonHoverColors[9];
            btn9.Button.AddEventListener(ButtonEvents.SingleClick, () => {
                this.Commit(OperationTemplate.Schedule);
            });
            this._page.SelectorPanel.Add(btn9);
        }

        private GetNewButton(): LabelAndButtonView {
            const button = new LabelAndButtonView();
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
