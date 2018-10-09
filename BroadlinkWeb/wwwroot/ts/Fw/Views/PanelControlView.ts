/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ControlView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class PanelControlView extends ControlView {

        protected Init(): void {
            super.Init();

            this.SetClassName('PanelView');
            this.Elem.addClass(this.ClassName);
            this.HasBorder = false;
            this.BorderRadius = 0;
        }
    }
}