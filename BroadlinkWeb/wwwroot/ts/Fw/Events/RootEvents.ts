/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ObjectEvents.ts" />

namespace Fw.Events {
    export class RootEventsClass extends ObjectEventsClass {
        public readonly Resized: string = 'Resized';
        public readonly MaskClicked: string = 'MaskClicked';
    }
    export const RootEvents: RootEventsClass = new RootEventsClass();
}