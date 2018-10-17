/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;
    import Number = Fw.Util.Number;

    export class CheckBoxView extends ViewBase {

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
            this._input.attr('id', `${this._name}_${this._value}`);
            this._label.attr('for', `${this._name}_${this._value}`);
        }

        private _value: string;
        public get Value(): string {
            return this._value;
        }
        public set Value(value: string) {
            this._value = value;
            this._input.attr('value', this._value);
            this._input.attr('id', `${this._name}_${this._value}`);
            this._label.attr('for', `${this._name}_${this._value}`);
        }

        private _input: JQuery;
        private _label : JQuery;

        constructor() {
            super($('<div></div>'));

            this.SetClassName('CheckBoxView');
            this.Elem.addClass(this.ClassName);

            this._input = $('<input type="checkbox" class="CheckBoxViewProperty"></input>');
            this._label = $('<label class="CheckBoxViewProperty"></label >');
            this.Elem.append(this._input);
            this.Elem.append(this._label);

            this._text = '';
            this._value = '';
            this.BackgroundColor = 'transparent';
            this.SetStyle('borderWidth', '0');
        }
    }
}