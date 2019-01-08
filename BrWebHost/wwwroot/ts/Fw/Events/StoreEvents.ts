/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="EventableEvents.ts" />

namespace Fw.Events {
    export class StoreEventsClass extends EventableEventsClass {
    }
    export const StoreEvents: StoreEventsClass = new StoreEventsClass();
}
