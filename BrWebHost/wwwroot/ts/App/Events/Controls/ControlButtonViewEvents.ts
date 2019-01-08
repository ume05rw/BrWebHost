/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Events/ButtonViewEvents.ts" />

namespace App.Events.Controls {
    export class ControlButtonViewEventsClass extends Fw.Events.ButtonViewEventsClass {
        public readonly EditOrdered: string = 'EditOrdered';
        public readonly ExecOrdered: string = 'ExecOrdered';
    }
    export const ControlButtonViewEvents: ControlButtonViewEventsClass = new ControlButtonViewEventsClass();
}