﻿/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Stores/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import Xhr = Fw.Util.Xhr;

    export class BrDeviceStore extends Fw.Models.Stores.StoreBase<BrDevice> {

        public async Discover(): Promise<BrDevice[]> {

            const params = new Xhr.Params(
                'BrDevices/Discover',
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);
            if (res.Succeeded) {
                _.each(res.Values, (row: BrDevice) => {
                    if (_.findIndex(this.List, { Id: row.Id }) === -1)
                        this.List.push(row);
                });

                return res.Values as BrDevice[];
            } else {
                Dump.Log('Query Fail');
                Dump.Log(res.Errors);
                return null;
            }
        }
    }
}