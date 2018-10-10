/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Stores/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import Xhr = Fw.Util.Xhr;

    export class BrDeviceStore extends Fw.Models.Stores.StoreBase {
        public Discover(callback: (brDevices: BrDevice[]) => void): void {
            var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
            params.Callback = (data) => {
                Dump.Log('Disover:');

                const rows: BrDevice[] = [];
                _.each(data, (row) => {
                    rows.push(row as BrDevice);
                });
                if (_.isFunction(callback))
                    callback(rows);
            }
            Xhr.Query.Invoke(params);
        }
    }
}