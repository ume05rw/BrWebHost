/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Num.ts" />
/// <reference path="InputViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;

    export class SelectBoxInputView extends InputViewBase {

        constructor() {
            super($('<select></select>'));

            this.SetClassName('SelectBoxInputView');
            this.Elem.addClass(this.ClassName);

            this.AddItem('', '');
        }

        public AddItem(name: string, value: string): void {
            //this.Log('name: ' + name);
            //this.Log(`<option value="${value}">${name}</option>`);
            const option = $(`<option value="${value}"></option>`);
            option.html(name);
            this.Elem.append(option);
        }
    }
}
