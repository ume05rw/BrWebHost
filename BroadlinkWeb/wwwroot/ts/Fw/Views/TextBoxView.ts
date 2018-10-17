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

    export class TextBoxView extends ViewBase {

        private _text: string;
        public get Text(): string {
            return this._text;
        }
        public set Text(value: string) {
            this._text = value;
            this.Elem.text(this._text);
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
            super($('<input type="text"></input>'));

            this.SetClassName('TextBoxView');
            this.Elem.addClass(this.ClassName);

            this._text = '';
            this.BackgroundColor = '#FFFFFF';
        }

        //protected InnerRefresh(): void {
        //    try {
        //        super.InnerRefresh();


        //    } catch (e) {
        //        Dump.ErrorLog(e);
        //    }
        //}
    }
}