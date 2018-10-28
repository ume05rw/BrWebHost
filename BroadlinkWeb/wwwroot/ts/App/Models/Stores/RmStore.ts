/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../Entities/RmCommand.ts" />
/// <reference path="../../Items/OperationType.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import RmCommand = App.Models.Entities.RmCommand;
    import OperationType = App.Items.OperationType;

    import Xhr = Fw.Util.Xhr;

    export class RmStore extends Fw.Models.StoreBase<RmCommand> {

        private static _instance: RmStore = null;
        public static get Instance(): RmStore {
            if (RmStore._instance === null)
                RmStore._instance = new RmStore();

            return RmStore._instance;
        }


        protected constructor() {
            super();

            this.SetClassName('RmStore');
            this.EnableLog = true;
        }

        public async GetLearnedCode(brDeviceId: number): Promise<RmCommand> {
            this.Log('GetLearnedCode');

            const params = new Xhr.Params(
                `Rms/GetLearnedCode/${brDeviceId}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var rmCommand = res.Values as RmCommand;

                return rmCommand;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async CancelLearning(brDeviceId: number): Promise<boolean> {
            this.Log('CancelLearning');

            const params = new Xhr.Params(
                `Rms/CancelLearning/${brDeviceId}`,
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

        public async Exec(controlSet: ControlSet, control: Control): Promise<boolean> {
            this.Log('Exec');

            // 渡し値がヘン
            if (
                !controlSet
                || !controlSet.BrDeviceId
                || !control
                || !control.Code
                || control.Code === ''
                || controlSet.OperationType !== OperationType.RemoteControl
            ) {
                return false;
            }

            const params = new Xhr.Params(
                `Rms/Exec/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Post,
                {
                    Code: control.Code
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


        protected GetNewEntity(): RmCommand {
            return new RmCommand();
        }
        public Write(entity: RmCommand): void {
            throw new Error('Not Supported');
        }
    }

    export const Rms: RmStore = RmStore.Instance;
}
