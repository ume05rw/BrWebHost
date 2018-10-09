/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlEvents;
    import Number = Fw.Util.Number;

    export class LabelView extends ViewBase {
        private _label: JQuery;

        public get Text(): string {
            return this._label.html();
        }
        public set Text(value: string) {
            this._label.html(value);
            this.Refresh();
        }

        constructor() {
            super($('<a></a>'));
            this.ClassName = 'LabelView';
        }

        protected Init(): void {
            super.Init();

            this.Elem.addClass('LabelView');
            this._label = $('<span class="ControlViewProperty"></span>');
            this.Elem.append(this._label);

            this.Dom.style.borderWidth = '0';
            this.Dom.style.borderRadius = '0';
        }
    }
}