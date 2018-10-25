/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/CheckBoxInputViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="IInputView.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.CheckBoxInputViewEvents;

    export class CheckBoxInputView extends ViewBase implements IInputView {

        private _text: string;
        public get Text(): string {
            return this._text;
        }
        public set Text(value: string) {
            this._text = value;
            this._label.text(this._text);
        }

        private _name: string;
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;
            this._input.attr('name', this._name);

            const id = `${this._name}_${(this._boolValue === true ? 'true' : 'false')}`;
            this._input.attr('id', id);
            this._label.attr('for', id);
        }

        private _boolValue: boolean;
        public get BoolValue(): boolean {
            return (this._boolValue === true);
        }
        public set BoolValue(value: boolean) {
            this.SetValue(value === true ? 'true' : 'false');
        }

        public get Value(): string {
            return (this.BoolValue)
                ? 'true'
                : 'false';
        }
        public set Value(value: string) {
            this.SetValue(value);
        }

        public SetValue(value: string, eventDispatch: boolean = true): void {
            const changed = (this._boolValue !== (value === 'true'));
            this._boolValue = (value === 'true');
            this._input.prop('checked', this._boolValue);

            if (changed && eventDispatch) {
                this.DispatchEvent(Events.Changed, this.Value);
            }
        }

        private _input: JQuery;
        private _label : JQuery;

        constructor() {
            super($('<div></div>'));

            this.SetClassName('CheckBoxInputView');
            this.Elem.addClass(this.ClassName);

            this._input = $('<input type="checkbox" class="CheckBoxInputViewProperty"></input>');
            this._label = $('<label class="CheckBoxInputViewProperty"></label >');
            this.Elem.append(this._input);
            this.Elem.append(this._label);

            this._name = '';
            this._boolValue = false;
            this._text = '';
            this.BackgroundColor = 'transparent';
            this.SetStyle('borderWidth', '0');
            this._input.prop('checked', false);

            this._input.on('propertychange change keyup paste input', () => {
                //this.Log('CheckBoxInputView.Changed');
                this.BoolValue = this._input.prop('checked');
            });

            this._input.on('focus', () => {
                //this.Log('CheckBoxInputView.Focused');
                this.DispatchEvent(Events.Focused);
            });

            this._input.on('blur', () => {
                //this.Log('CheckBoxInputView.Blurred');
                this.DispatchEvent(Events.Blurred);
            });
        }
    }
}
