/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="InputViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;

    export class TextBoxInputView extends InputViewBase {

        private _textAlign: Property.TextAlign;
        public get TextAlign(): Property.TextAlign {
            return this._textAlign;
        }
        public set TextAlign(value: Property.TextAlign) {
            this._textAlign = value;
            this.Refresh();
        }

        constructor() {
            super($('<input type="text"></input>'));

            this.SetClassName('TextBoxInputView');
            this.Elem.addClass(this.ClassName);

            this._textAlign = Property.TextAlign.Left;

        }

        protected InnerRefresh(): void {
            try {
                if (this.IsDisposed !== false)
                    return;

                super.InnerRefresh();

                this.SetStyles({
                    textAlign: this._textAlign,
                });

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            }
        }

    }
}
