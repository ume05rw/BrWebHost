/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../ObjectBase.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/EntityEvents.ts" />
/// <reference path="IEntity.ts" />

namespace Fw.Models {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.EntityEvents;

    export abstract class EntityBase extends Fw.ObjectBase implements IEntity {
        public Id: number;

        public DispatchChanged(): void {
            this.DispatchEvent(Events.Changed);
        }
    }
}
