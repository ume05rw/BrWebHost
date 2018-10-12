/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
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

        /**
         * @see publicプロパティの初期化タイミングに注意。コンストラクタ実行後に値がセットされる。
         */
        public HoverColor: string; // = '';

        protected Init(): void {
            super.Init();

            this.SetClassName('ButtonView');
            this.Elem.addClass(this.ClassName);

            this.BackgroundColor = '#add8e6';
            this.HoverColor = '#6495ed';

            this._imageView = new ImageView();
            this._imageView.Src = null;
            this.Add(this._imageView);

            this.Elem.hover(() => {
                //Dump.Log(`${this.ClassName}.hover: color = ${this.HoverColor}`);
                this.Dom.style.backgroundColor = this.HoverColor;
            }, () => {
                this.Dom.style.backgroundColor = this.BackgroundColor;
            });
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                this._imageView.Size.Width = this.Size.Width;
                this._imageView.Size.Height = this.Size.Height;
                super.InnerRefresh()

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
            this._imageView = null;
            this.HoverColor = null;
        }
    }
}