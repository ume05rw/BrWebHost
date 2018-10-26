/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/Control.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import Control = App.Models.Entities.Control;
    import Xhr = Fw.Util.Xhr;

    export class ControlStore extends Fw.Models.StoreBase<Control> {

        private static _instance: ControlStore = null;
        public static get Instance(): ControlStore {
            if (ControlStore._instance === null)
                ControlStore._instance = new ControlStore();

            return ControlStore._instance;
        }


        protected constructor() {
            super();

            this.SetClassName('ControlStore');
            this.EnableLog = true;
        }

        protected GetNewEntity(): Control {
            return new Control();
        }

        public async Write(entity: Control): Promise<Control> {
            throw new Error('Not Supported');
        }

        public SetRange(entities: Control[]): void {
            _.each(entities, (c) => {
                this.Merge(c);
            });
        }

        public GetListByControlSetId(id: number): Array<Control> {
            const result = new Array<Control>();
            _.each(this.List, (entity: Control) => {
                if (entity.ControlSetId === id)
                    result.push(entity);
            });
            return result;
        }
    }

    export const Controls: ControlStore = ControlStore.Instance;
}
