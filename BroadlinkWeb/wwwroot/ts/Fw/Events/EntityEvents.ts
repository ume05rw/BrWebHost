/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ObjectEvents.ts" />

namespace Fw.Events {
    export class EntityEventsClass extends ObjectEventsClass {
        public readonly Changed: string = 'Changed';
    }
    export const EntityEvents: EntityEventsClass = new EntityEventsClass();
}