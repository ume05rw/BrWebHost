/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/RelocatableButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="LabeledButtonView.ts" />


namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;
    import Events = App.Events.Controls.ControlButtonViewEvents;

    export class ControlButtonView extends Views.RelocatableButtonView {

        private _name: string;
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;
            Dump.Log(this.ImageSrc);
            if (this.ImageSrc === '')
                this.Text = value;
        }
        public Code: string;


        constructor() {
            super();

            this.SetSize(75, 75);
            this.GridSize = 90;
            this.Margin = 5;
            this.Position.Policy = Property.PositionPolicy.LeftTop;
            this.HasBorder = true;
            this.BorderRadius = 50;
            this.BackgroundColor = Color.MainBackground;
            this.HoverColor = Color.ButtonHoverColors[0];
            this.Color = Color.ButtonColors[0];
            this.Code = '';
            this._name = '';

            this.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, (e) => {
                this.OnSingleClicked(e);
            });
        }

        private OnSingleClicked(e: JQueryEventObject): void {
            if (this.IsRelocatable) {
                // 編集モードのとき
                Dump.Log('Edit');
                this.DispatchEvent(Events.EditOrdered);
            } else {
                // 実行モードのとき
                Dump.Log('Exec');
                this.DispatchEvent(Events.ExecOrdered, this.Code);
            }
        }

        public SetImage(value: string): void {
            if (value === undefined || value === null || value === '') {
                this.ImageSrc = '';
                this.Text = this.Name;
            } else {
                this.Text = '';
                this.ImageSrc = value;
            }
        }

        public SetColor(value: string): void {
            const idx = Color.ButtonColors.indexOf(value);

            if (idx === -1) {
                // 色が見つからないとき、デフォルト
                this.Color = Color.MainHover;
                this.HoverColor = Color.MainHover;
            } else {
                // 色が定義済みのとき、ホバー色とともにセット
                this.Color = value;
                this.HoverColor = Color.ButtonHoverColors[idx];
            }
            this.Refresh();
        }
    }
}