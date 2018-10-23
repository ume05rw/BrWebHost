/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FontWeight.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Property = Fw.Views.Property;

    export class LabelView extends ViewBase {

        private _text: string;
        public get Text(): string {
            return this._text;
        }
        public set Text(value: string) {
            this._text = value;
            this.Elem.text(''); // 一旦消す。
            this._hiddenSpan.innerText = this._text;
            this.Refresh();
        }

        private _fontWeight: Property.FontWeight;
        public get FontWeight(): Property.FontWeight {
            return this._fontWeight;
        }
        public set FontWeight(value: Property.FontWeight) {
            this._fontWeight = value;
            this._hiddenSpan.style.fontWeight = this._fontWeight;
            this.Refresh();
        }

        private _fontSize: Property.FontSize;
        public get FontSize(): Property.FontSize {
            return this._fontSize;
        }
        public set FontSize(value: Property.FontSize) {
            this._fontSize = value;
            this._hiddenSpan.style.fontSize = this._fontSize;
            this.Refresh();
        }

        private _fontFamily: string;
        public get FontFamily(): string {
            return this._fontFamily;
        }
        public set FontFamily(value: string) {
            this._fontFamily = value;
            this._hiddenSpan.style.fontFamily = this._fontFamily;
            this.Refresh();
        }

        private _textAlign: Property.TextAlign;
        public get TextAlign(): Property.TextAlign {
            return this._textAlign;
        }
        public set TextAlign(value: Property.TextAlign) {
            this._textAlign = value;
            this.Refresh();
        }

        private _autoSize: boolean;
        public get AutoSize(): boolean {
            return this._autoSize;
        }
        public set AutoSize(value: boolean) {
            this._autoSize = value;
            this.Refresh();
        }

        private _hiddenSpan: HTMLSpanElement;

        constructor() {
            super($('<label></label>'));

            this._hiddenSpan = document.createElement('span') as HTMLSpanElement;

            this.SetClassName('LabelView');
            this.Elem.addClass(this.ClassName);

            this.BackgroundColor = 'transparent';
            this.SetTransAnimation(false);

            //this.Dom.style.borderWidth = '0';
            //this.Dom.style.borderRadius = '0';
            this.SetStyles({
                borderWidth: '0',
                borderRadius: '0'
            });

            this._text = '';
            this._fontWeight = Property.FontWeight.Normal;
            this._fontSize = Property.FontSize.Medium;
            this._fontFamily = 'Quicksand, 游ゴシック体, "Yu Gothic", YuGothic, "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif';
            this._textAlign = Property.TextAlign.Center;

            this._hiddenSpan.style.visibility = 'hidden';
            this._hiddenSpan.style.fontWeight = this._fontWeight;
            this._hiddenSpan.style.fontSize = this._fontSize;
            this._hiddenSpan.style.fontFamily = this._fontFamily;

            this.AddEventListener(Events.Attached, (e) => {
                e.stopPropagation();
                this.Parent.Elem.append(this._hiddenSpan);
            });
            this.AddEventListener(Events.Detached, (e) => {
                e.stopPropagation();
                $(this._hiddenSpan).remove();
            });

            this._autoSize = true;
        }

        protected InnerRefresh(): void {
            try {
                super.InnerRefresh();

                this.SetStyles({
                    textAlign: this._textAlign,
                    fontWeight: this._fontWeight,
                    fontSize: this._fontSize,
                    fontFamily: this._fontFamily
                });

                this.Elem.text(this._text);
            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            }
        }

        public CalcLayout(): void {
            try {
                this.SuppressLayout();

                if (this._autoSize) {
                    this.Size.Width = this._hiddenSpan.offsetWidth + 10;
                    this.Size.Height = this._hiddenSpan.offsetHeight;
                }

                super.CalcLayout();

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._text = null;
            $(this._hiddenSpan).remove();
        }
    }
}
