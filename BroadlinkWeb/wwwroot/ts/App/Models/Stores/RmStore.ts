/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import RmCommand = App.Models.Entities.RmCommand;

    import Xhr = Fw.Util.Xhr;

    export class RmStore extends Fw.Models.StoreBase<BrDevice> {

        private static _instance: RmStore = null;
        public static get Instance(): RmStore {
            if (RmStore._instance === null)
                RmStore._instance = new RmStore();

            return RmStore._instance;
        }


        protected constructor() {
            super();
            this.EnableLog = true;
        }

        public async GetLearnedCode(brDeviceId: number): Promise<RmCommand> {

            const params = new Xhr.Params(
                `Rm/GetLearnedCode/${brDeviceId}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var rCom = res.Values as RmCommand;

                return rCom;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async CancelLearning(brDeviceId: number): Promise<boolean> {

            const params = new Xhr.Params(
                `Rm/CancelLearning/${brDeviceId}`,
                Xhr.MethodType.Post
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as boolean;

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Exec(brDeviceId: number, code: string): Promise<boolean> {

            const params = new Xhr.Params(
                `Rm/Exec/${brDeviceId}`,
                Xhr.MethodType.Post,
                {
                    Code: code
                }
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as boolean;

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }


        protected GetNewEntity(): BrDevice {
            return new BrDevice();
        }
        public Write(entity: BrDevice): void {
            throw new Error('Only Server can add BrDevices.');
        }
    }

    export const Rms: RmStore = RmStore.Instance;
}
