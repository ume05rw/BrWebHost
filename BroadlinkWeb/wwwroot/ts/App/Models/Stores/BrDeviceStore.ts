/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import Xhr = Fw.Util.Xhr;

    export class BrDeviceStore extends Fw.Models.StoreBase<BrDevice> {

        private static _instance: BrDeviceStore = null;
        public static get Instance(): BrDeviceStore {
            if (BrDeviceStore._instance === null)
                BrDeviceStore._instance = new BrDeviceStore();

            return BrDeviceStore._instance;
        }

        protected GetNewEntity(): BrDevice {
            return new BrDevice();
        }

        public async Discover(): Promise<BrDevice[]> {

            const params = new Xhr.Params(
                'BrDevices/Discover',
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                for (let i = 0; i < res.Values.length; i++)
                    this.Merge(res.Values[i] as BrDevice);

                return res.Values as BrDevice[];
            } else {
                Dump.Log('Query Fail');
                Dump.Log(res.Errors);
                return null;
            }
        }

        public Write(entity: BrDevice): void {
            throw new Error('Only Server can add BrDevices.');
        }
    }

    export const BrDevices: BrDeviceStore = BrDeviceStore.Instance;
}