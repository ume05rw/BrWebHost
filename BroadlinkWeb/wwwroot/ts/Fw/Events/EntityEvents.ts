/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Events {
    export class EntityEventsClass {
        public readonly Changed: string = 'Changed';
    }
    export const EntityEvents: EntityEventsClass = new EntityEventsClass();
}