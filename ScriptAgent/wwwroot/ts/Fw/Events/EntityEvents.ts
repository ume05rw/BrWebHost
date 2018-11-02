/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="EventableEvents.ts" />

namespace Fw.Events {
    export class EntityEventsClass extends EventableEventsClass {
        public readonly Changed: string = 'Changed';
    }
    export const EntityEvents: EntityEventsClass = new EntityEventsClass();
}
