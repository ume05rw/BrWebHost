/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../../lib/popperjs/index.d.ts" />
/// <reference path="../../../lib/tippyjs/index.d.ts" />
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
            if (!value || value === '') {
                this._imageView.Hide(0);
            } else {
                this._imageView.Show(0);
            }
        }

        public get ImageFitPolicy(): Property.FitPolicy {
            return this._imageView.FitPolicy;
        }
        public set ImageFitPolicy(value: Property.FitPolicy) {
            this._imageView.FitPolicy = value;
            this.Refresh();
        }

        private _tooltip: string;
        private _tippy: Tippy.Instance;
        public get Tooltip(): string {
            return this._tooltip;
        }
        public set Tooltip(value: string) {
            this._tooltip = value;

            if (this._tippy)
                this._tippy.destroy();

            if ((this._tooltip) && this._tooltip !== '') {
                this._tippy = tippy(this.Dom as Element);
            }
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
            this._tooltip = '';

            this._imageView.Src = '';
            this._imageView.FitPolicy = Property.FitPolicy.Contain;
            this.Add(this._imageView);

            this.Elem.on('mouseenter', () => {
                this.Dom.style.backgroundColor = this.HoverColor;
            });
            this.Elem.on('mouseleave', () => {
                this.Dom.style.backgroundColor = this.BackgroundColor;
            });

            this.AddEventListener(Events.SingleClick, () => {
                this.SetAnimatedPulse();
            });
            this.AddEventListener(Events.LongClick, () => {
                this.SetAnimatedPulse();
            });
        }

        protected InnerRefresh(): void {
            try {
                super.InnerRefresh();

                if (!this._tooltip || this._tooltip === '') {
                    // ツールティップがセットされていない。
                    if (this.Elem.hasClass('tooltip')) {
                        this.Elem.removeClass('tooltip');
                    }
                    this.Elem.attr('title', '');

                } else {
                    // ツールティップがセットされている。
                    if (!this.Elem.hasClass('tooltip')) {
                        this.Elem.addClass('tooltip');
                    }
                    this.Elem.attr('title', this._tooltip);
                }

                this.SetStyle('borderColor', `${this.Color}`);
            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
            }
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
