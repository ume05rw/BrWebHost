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

        constructor() {
            super($('<input type="text"></input>'));

            this.SetClassName('TextBoxInputView');
            this.Elem.addClass(this.ClassName);
        }
    }
}