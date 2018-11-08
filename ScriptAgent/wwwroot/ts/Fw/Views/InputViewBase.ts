/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/InputViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="IInputView.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.InputViewEvents;

    export abstract class InputViewBase extends ViewBase implements IInputView {

        protected _name: string;
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;
            this.Elem.attr('name', this._name);
        }

        protected _value: string;
        public get Value(): string {
            this._value = this.Elem.val();
            return this._value;
        }
        public set Value(value: string) {
            this.SetValue(value);
        }

        public SetValue(value: string, eventDispatch: boolean = true): void {
            const changed = (this._value !== value);
            this.Elem.val(value);
            this._value = this.Elem.val();
            this.Refresh();

            if (changed && eventDispatch) {
                this.DispatchEvent(Events.Changed, this.Value);
            }
        }

        protected _isReadOnly: boolean;
        public get IsReadOnly(): boolean {
            return this._isReadOnly;
        }
        public set IsReadOnly(value: boolean) {
            const changed = (this._isReadOnly !== value);

            if (changed) {
                this._isReadOnly = value;
                this.Elem.attr('readonly', this._isReadOnly);
            }
        }

        constructor(jqueryElem: JQuery) {
            super(jqueryElem);

            this.SetClassName('InputView');
            this.Elem.addClass(this.ClassName);

            this._name = '';
            this._value = '';
            this._isReadOnly = false;

            this.BackgroundColor = '#FFFFFF';

            this.Elem.on('propertychange change keyup paste input', () => {
                //this.Log('InputViewBase.Changed');
                this.DispatchEvent(Events.Changed, this.Value);
            });

            this.Elem.on('focus', () => {
                //this.Log('InputViewBase.Focused');
                this.DispatchEvent(Events.Focused);
            });

            this.Elem.on('blur', () => {
                //this.Log('InputViewBase.Blurred');
                this.DispatchEvent(Events.Blurred);
            });
        }
    }
}
