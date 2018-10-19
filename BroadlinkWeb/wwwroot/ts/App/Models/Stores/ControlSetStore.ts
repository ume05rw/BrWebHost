/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Stores/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Xhr = Fw.Util.Xhr;

    export class ControlSetStore extends Fw.Models.Stores.StoreBase<ControlSet> {

        public async Write(ent: ControlSet): Promise<ControlSet> {

            const params = new Xhr.Params(
                'ControlSet/Write',
                Xhr.MethodType.Post,
                ent
            );

            const res = await Xhr.Query.Invoke(params);
            if (res.Succeeded) {
                _.each(res.Values, (row: ControlSet) => {
                    if (_.findIndex(this.List, { Id: row.Id }) === -1)
                        this.List.push(row);
                });

                return res.Values as ControlSet;
            } else {
                Dump.Log('Query Fail');
                Dump.Log(res.Errors);
                return null;
            }
        }
    }
}