/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ObjectEvents.ts" />

namespace Fw.Events {
    export class StoreEventsClass extends ObjectEventsClass {
    }
    export const StoreEvents: StoreEventsClass = new StoreEventsClass();
}