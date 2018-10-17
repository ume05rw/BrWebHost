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

    export class SelectBoxView extends ViewBase {

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

        constructor() {
            super($('<select></select>'));

            this.SetClassName('SelectBoxView');
            this.Elem.addClass(this.ClassName);

            this.BackgroundColor = '#FFFFFF';
            this.AddItem('', '');
        }

        public AddItem(name: string, value: string): void {
            this.Elem.append(`<option value="${value}">${name}</option>`);
        }
    }
}