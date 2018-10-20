/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ObjectEvents.ts" />

namespace Fw.Events {
    export class ViewEventsClass extends ObjectEventsClass {
        public readonly Shown: string = 'Shown';
        public readonly Hidden: string = 'Hidden';
        public readonly Attached: string = 'Attached';
        public readonly Detached: string = 'Detached';
        public readonly SizeChanged: string = 'SizeChanged';
        public readonly PositionChanged: string = 'PositionChanged';
        public readonly PositionPolicyChanged: string = 'PositionPolicyChanged';
        public readonly AnchorChanged: string = 'AnchorChanged';
        public readonly Initialized: string = 'Initialized';
    }
    export const ViewEvents: ViewEventsClass = new ViewEventsClass();
}