/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="BoxViewEvents.ts" />

namespace Fw.Events {
    export class StuckerBoxViewEventsClass extends BoxViewEventsClass {
        public readonly RelocationStarted: string = 'RelocationStarted';
        public readonly RelocationEnded: string = 'RelocationEnded';
        public readonly OrderChanged: string = 'OrderChanged';
        public readonly OrderUncommitChanged: string = 'OrderUncommitChanged';
    }
    export const StuckerBoxViewEvents: StuckerBoxViewEventsClass = new StuckerBoxViewEventsClass();
}
