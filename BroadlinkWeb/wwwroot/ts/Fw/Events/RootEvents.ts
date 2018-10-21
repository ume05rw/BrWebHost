/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="EventableEvents.ts" />

namespace Fw.Events {
    export class RootEventsClass extends EventableEventsClass {
        public readonly Resized: string = 'Resized';
        public readonly MaskClicked: string = 'MaskClicked';
    }
    export const RootEvents: RootEventsClass = new RootEventsClass();
}
