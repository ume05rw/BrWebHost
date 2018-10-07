/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Events {
    export class ViewEventsClass {
        public readonly Shown: string = 'Shown';
        public readonly Hidden: string = 'Hidden';
        public readonly Attached: string = 'Attached';
        public readonly Detached: string = 'Detached';
    }
    export const ViewEvents: ViewEventsClass = new ViewEventsClass();
}