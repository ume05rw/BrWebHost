/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="./ControlView.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ControlEvents;
    import Dump = Fw.Util.Dump;

    export class PanelView extends ControlView {

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