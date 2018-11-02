/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/InputViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="InputViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.InputViewEvents;

    export class NumberBoxInputView extends InputViewBase {

        private _textAlign: Property.TextAlign;
        public get TextAlign(): Property.TextAlign {
            return this._textAlign;
        }
        public set TextAlign(value: Property.TextAlign) {
            this._textAlign = value;
            this.Refresh();
        }

        private _decimalPoint: number;
        public get DecimalPoint(): number {
            return this._decimalPoint;
        }
        public set DecimalPoint(value: number) {
            const changed = (this._decimalPoint !== value);

            if (changed) {
                this._decimalPoint = value;
                this.Refresh();
            }
        }

        private _thousandSeparator: boolean;
        public get ThousandSeparator(): boolean {
            return this._thousandSeparator;
        }
        public set ThousandSeparator(value: boolean) {
            const changed = (this._thousandSeparator !== value);

            if (changed) {
                this._thousandSeparator = value;
                this.Refresh();
            }
        }

        private _numberValue: number;
        public get NumberValue(): number {
            return this._numberValue;
        }
        public set NumberValue(value: number) {
            const changed = (this._numberValue !== value);

            if (changed)
                this.SetNumberValue(value);
        }

        public get Value(): string {
            return (this._numberValue === null)
                ? null
                : this._numberValue.toFixed(this._decimalPoint);
        }
        public set Value(value: string) {
            this.SetValue(value);
        }

        public SetValue(value: string, eventDispatch: boolean = true): void {
            if (!$.isNumeric(value)) {
                Dump.Log('Not Number value: ' + value);
                throw new Error('Not Number value: ' + value);
            }
            this.SetNumberValue(parseFloat(value), eventDispatch);
        }

        public SetNumberValue(value: number, eventDispatch: boolean = true): void {
            const changed = (this._numberValue !== value);
            this._numberValue = value;

            this.Refresh();

            if (changed && eventDispatch) {
                this.DispatchEvent(Events.Changed, this.Value);
            }
        }

        constructor() {
            super($('<input type="text"></input>'));

            this.SetClassName('TextBoxInputView');
            this.Elem.addClass(this.ClassName);

            this._numberValue = 0;
            this._decimalPoint = 0;
            this._thousandSeparator = false;
            this._textAlign = Property.TextAlign.Left;

            
            // タブや方向キー、BackSpaceなども無効化してしまう。
            // ちょうどいい具合のものがないか、検討中。
            // 数値以外の入力値を禁止する。
            //this.Elem.on('keypress', (e) => {
            //    // 数字以外の不要な文字を削除
            //    var st = String.fromCharCode(e.which);
            //    return ("0123456789-.,".indexOf(st, 0) < 0)
            //        ? false
            //        : true;
            //});
            this.Elem.on('change', () => {
                let value = this.Elem.val().replace(/,/g, '');

                if ($.isNumeric(value)) {
                    this.SetNumberValue(parseFloat(value));
                } else {
                    this.SetNumberValue(0);
                }
                this.Refresh();
            });
        }

        protected InnerRefresh(): void {
            try {
                if (this.IsDisposed !== false)
                    return;

                super.InnerRefresh();

                let textValue = this._numberValue.toFixed(this._decimalPoint);
                if (this.ThousandSeparator) {
                    textValue = this.addCommnas(textValue);
                }
                this.Elem.val(textValue);

                this.SetStyles({
                    textAlign: this._textAlign,
                });

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            }
        }

        private addCommnas(numString): string {
            numString += '';
            const x = numString.split('.');

            let x1 = x[0];
            const x2 = x.length > 1
                ? '.' + x[1]
                : '';

            const rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

    }
}
