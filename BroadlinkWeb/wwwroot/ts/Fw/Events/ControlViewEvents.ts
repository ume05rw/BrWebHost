/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />

namespace Fw.Events {
    export class ControlViewEventsClass extends ViewEventsClass {
        public readonly SingleClick: string = 'SingleClick';
        public readonly LongClick: string = 'LongClick';
    }
    export const ControlViewEvents: ControlViewEventsClass = new ControlViewEventsClass();
}