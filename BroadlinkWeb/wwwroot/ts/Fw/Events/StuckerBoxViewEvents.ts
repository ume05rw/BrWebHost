/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="BoxViewEvents.ts" />

namespace Fw.Events {
    export class StuckerBoxViewEventsClass extends BoxViewEventsClass {
        public readonly OrderChanged: string = 'OrderChanged';
    }
    export const StuckerBoxViewEvents: StuckerBoxViewEventsClass = new StuckerBoxViewEventsClass();
}
