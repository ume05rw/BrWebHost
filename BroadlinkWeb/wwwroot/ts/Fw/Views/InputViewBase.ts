/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/InputViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="IInputView.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.InputViewEvents;
    import Number = Fw.Util.Number;

    export abstract class InputViewBase extends ViewBase implements IInputView {

        private _value: string;
        public get Value(): string {
            this._value = this.Elem.val();
            return this._value;
        }
        public set Value(value: string) {
            this.Elem.val(value);
            this._value = this.Elem.val();
            this.Refresh();
        }

        private _name: string;
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;
            this.Elem.attr('name', this._name);
        }

        constructor(jqueryElem: JQuery) {
            super(jqueryElem);

            this.SetClassName('InputView');
            this.Elem.addClass(this.ClassName);

            this._name = '';
            this._value = '';

            this.BackgroundColor = '#FFFFFF';

            this.Elem.on('propertychange change keyup paste input', () => {
                Dump.Log('InputViewBase.Changed');
                this.DispatchEvent(Events.Changed, this.Value);
            });

            this.Elem.on('focus', () => {
                //Dump.Log('InputViewBase.Focused');
                this.DispatchEvent(Events.Focused);
            });

            this.Elem.on('blur', () => {
                //Dump.Log('InputViewBase.Blurred');
                this.DispatchEvent(Events.Blurred);
            });
        }
    }
}