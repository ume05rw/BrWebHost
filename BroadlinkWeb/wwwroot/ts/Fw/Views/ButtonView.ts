/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ControlView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class ButtonView extends ControlView {

        private _imageView: ImageView;

        public get ImageSrc(): string {
            return this._imageView.Src;
        }
        public set ImageSrc(value: string) {
            this._imageView.Src = value;
        }

        public get ImageFitPolicy(): Property.FitPolicy {
            return this._imageView.FitPolicy;
        }
        public set ImageFitPolicy(value: Property.FitPolicy) {
            this._imageView.FitPolicy = value;
            this.Refresh();
        }

        /**
         * @see publicプロパティの初期化タイミングに注意。コンストラクタ実行後に値がセットされる。
         */
        public HoverColor: string; // = '';

        constructor() {
            super();

            this._imageView = new ImageView();

            this.SetClassName('ButtonView');
            this.Elem.addClass(this.ClassName);

            this.BackgroundColor = '#add8e6';
            this.HoverColor = '#6495ed';

            this._imageView.Src = '';
            this._imageView.FitPolicy = Property.FitPolicy.Contain;
            this.Add(this._imageView);

            this.Elem.hover(() => {
                //Dump.Log(`${this.ClassName}.hover: color = ${this.HoverColor}`);
                this.Dom.style.backgroundColor = this.HoverColor;
                //this.SetStyle('backgroundColor', this.HoverColor);
                //this.Refresh();
            }, () => {
                this.Dom.style.backgroundColor = this.BackgroundColor;
                //this.SetStyle('backgroundColor', this.BackgroundColor);
                //this.Refresh();
            });
        }

        public CalcLayout(): void {
            try {
                this.SuppressLayout();
                this._imageView.SuppressLayout();


                this._imageView.Size.Width = this.Size.Width;
                this._imageView.Size.Height = this.Size.Height;
                super.CalcLayout();

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
                this._imageView.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
            this._imageView = null;
            this.HoverColor = null;
        }
    }
}
