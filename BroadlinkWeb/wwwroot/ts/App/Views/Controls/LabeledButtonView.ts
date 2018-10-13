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

        /**
         * @see publicプロパティの初期化タイミングに注意。コンストラクタ実行後に値がセットされる。
         */
        public HoverColor: string; // = '';

        constructor() {
            super()

            this._buttonView = new Views.ButtonView();
            this._labelView = new Views.LabelView();

            this.SetClassName('LabeledButtonView');
            this.Elem.addClass(this.ClassName);

            this._buttonView.SetAnchor(0, 0, 0, 20);
            this.Add(this._buttonView);

            this._labelView.SetAnchor(null, null, null, 0);
            this._labelView.Size.Height = 15;
            this._labelView.FontSize = Property.FontSize.Small;
            this.Add(this._labelView);
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