/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ControlView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;

    export class LabeledButtonView extends Fw.Views.ControlView {

        private _buttonView: Views.ButtonView;
        public get Button(): Views.ButtonView {
            return this._buttonView;
        }

        private _labelView: Views.LabelView;
        public get Label(): Views.LabelView {
            return this._labelView;
        }

        public get ImageSrc(): string {
            return this._buttonView.ImageSrc;
        }
        public set ImageSrc(value: string) {
            this._buttonView.ImageSrc = value;
        }

        public get Text(): string {
            return this._labelView.Text;
        }
        public set Text(value: string) {
            this._labelView.Text = value;
            this.Refresh();
        }

        public get HasBorder(): boolean {
            return this._buttonView.HasBorder;
        }
        public set HasBorder(value: boolean) {
            this._buttonView.HasBorder = value;
            this._buttonView.Dom.style.borderWidth = (value)
                ? '1px'
                : '0';
        }

        public get BorderRadius(): number {
            return this._buttonView.BorderRadius;
        }
        public set BorderRadius(value: number) {
            this._buttonView.BorderRadius = value;
        }

        public get Color(): string {
            return this._buttonView.Color;
        }
        public set Color(value: string) {
            this._buttonView.Color = value;
        }

        public get BackgroundColor(): string {
            return this._buttonView.BackgroundColor;
        }
        public set BackgroundColor(value: string) {
            this._buttonView.BackgroundColor = value;
        }

        public get Opacity(): number {
            return this._buttonView.Opacity;
        }
        public set Opacity(value: number) {
            this._buttonView.Opacity = value;
        }

        /**
         * @see publicプロパティの初期化タイミングに注意。コンストラクタ実行後に値がセットされる。
         */
        public HoverColor: string; // = '';

        protected Init(): void {
            this._buttonView = new Views.ButtonView();
            this._labelView = new Views.LabelView();

            super.Init();

            this.SetClassName('LabeledButtonView');
            this.Elem.addClass(this.ClassName);

            this.BackgroundColor = '#add8e6';
            this.HoverColor = '#6495ed';

            
            this._buttonView.SetAnchor(0, 0, 0, 20);
            this.Add(this._buttonView);

            
            this._labelView.SetAnchor(null, null, null, 0);
            this._labelView.Size.Height = 15;
            this._labelView.FontSize = Property.FontSize.Small;
            this.Add(this._labelView);

            this.Elem.hover(() => {
                //Dump.Log(`${this.ClassName}.hover: color = ${this.HoverColor}`);
                this._buttonView.Dom.style.backgroundColor = this.HoverColor;
            }, () => {
                this._buttonView.Dom.style.backgroundColor = this.BackgroundColor;
            });
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                super.InnerRefresh()

                this.Dom.style.color = 'transparent';
                this.Dom.style.backgroundColor = 'transparent';
                this.Dom.style.borderWidth = '0';
                this.Dom.style.borderColor = 'transparent';
                this.Dom.style.opacity = `${this.Opacity}`;

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
            this._buttonView = null;
            this.HoverColor = null;
        }
    }
}