/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ControlView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlEvents;

    export class PanelControlView extends ControlView {

        constructor() {
            super();
            this.ClassName = 'PanelView';
        }

        protected Init(): void {
            super.Init();

            this.HasBorder = false;
            this.BorderRadius = 0;
            this.Elem.addClass('PanelView');
        }
    }
}