/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="ControlStore.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Controls = App.Models.Stores.Controls;
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

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                const id = (res.Values as ControlSet).Id;

                this.Merge(res.Values as ControlSet);

                const result = this.List[id];

                if (res.Values.Controls) {
                    Controls.SetRange(res.Values.Controls);
                    result.Controls = Controls.GetListByControlSetId(id);
                }

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Remove(entity: ControlSet): Promise<boolean> {

            const params = new Xhr.Params(
                `ControlSets/${entity.Id}`,
                Xhr.MethodType.Delete,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                _.each(entity.Controls, (c) => {
                    delete Controls.List[c.Id];
                });

                delete this.List[entity.Id];

                return true;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return false;
            }
        }
    }

    export const ControlSets: ControlSetStore = ControlSetStore.Instance;
}
