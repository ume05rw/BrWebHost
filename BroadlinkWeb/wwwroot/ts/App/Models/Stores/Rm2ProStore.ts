/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import RmCommand = App.Models.Entities.RmCommand;
    import Xhr = Fw.Util.Xhr;

    export class Rm2ProStore extends Fw.Models.StoreBase<RmCommand> {

        private static _instance: Rm2ProStore = null;
        public static get Instance(): Rm2ProStore {
            if (Rm2ProStore._instance === null)
                Rm2ProStore._instance = new Rm2ProStore();

            return Rm2ProStore._instance;
        }


        protected constructor() {
            super();
            
            this.SetClassName('Rm2ProStore');
            this.EnableLog = true;
        }


        public async GetTemperature(controlSet: ControlSet): Promise<number> {
            this.Log('GetTemperature');

            const params = new Xhr.Params(
                `Rm2Pro/GetTemperature/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as number;

                controlSet.Controls[0].Value = String(result);
                controlSet.DispatchChanged();

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        /**
         * !未実装!
         * @param brDeviceId
         */
        public async GetRfLearnedCode(brDeviceId: number): Promise<RmCommand> {
            this.Log('GetRfLearnedCode');

            const params = new Xhr.Params(
                `Rm2Pro/GetRfLearnedCode/${brDeviceId}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var rmCommand = this.Merge(res.Values);

                return rmCommand;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        /**
         * !未実装!
         * @param brDeviceId
         */
        public async CancelLearning(brDeviceId: number): Promise<boolean> {
            this.Log('CancelLearning');

            // RFとIR、キャンセルコマンドは共通なので、同じAPIを使う。
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


        protected GetNewEntity(): RmCommand {
            return new RmCommand();
        }
        public Write(entity: RmCommand): void {
            throw new Error('Not Supported');
        }
    }

    export const Rm2Pros: Rm2ProStore = Rm2ProStore.Instance;
}
