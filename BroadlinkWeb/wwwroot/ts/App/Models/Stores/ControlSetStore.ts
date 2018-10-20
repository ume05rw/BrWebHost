/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Xhr = Fw.Util.Xhr;

    export class ControlSetStore extends Fw.Models.StoreBase<ControlSet> {

        private static _instance: ControlSetStore = null;
        public static get Instance(): ControlSetStore {
            if (ControlSetStore._instance === null)
                ControlSetStore._instance = new ControlSetStore();

            return ControlSetStore._instance;
        }

        protected GetNewEntity(): ControlSet {
            return new ControlSet();
        }


        public async Write(entity: ControlSet): Promise<ControlSet> {

            const params = new Xhr.Params(
                'ControlSets',
                Xhr.MethodType.Post,
                entity
            );

            //delete params.Values['Controls'];

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                this.Merge(res.Values as ControlSet);

                return res.Values as ControlSet;
            } else {
                Dump.Log('Query Fail');
                Dump.Log(res.Errors);
                return null;
            }
        }
    }

    export const ControlSets: ControlSetStore = ControlSetStore.Instance;
}