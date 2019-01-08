/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/DeviceType.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import BrDevice = App.Models.Entities.BrDevice;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Xhr = Fw.Util.Xhr;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;

    export class WolStore extends Fw.Models.StoreBase<null> {

        private static _instance: WolStore = null;
        public static get Instance(): WolStore {
            if (WolStore._instance === null)
                WolStore._instance = new WolStore();

            return WolStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('WolStore');
            //this.EnableLog = true;
        }

        public async Exec(controlSet: ControlSet, control: Control): Promise<boolean> {
            this.Log('Exec');

            // 渡し値がヘン
            if (
                !controlSet
                || !control
                || !control.Code
                || control.Code === ''
                || controlSet.OperationType !== OperationType.WakeOnLan
            ) {
                return false;
            }

            const params = new Xhr.Params(
                `Wols/${control.Id}`,
                Xhr.MethodType.Post
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as boolean;

                // Suceededのときはtrue以外返ってこない。
                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return false;
            }
        }


        protected GetNewEntity(): null {
            throw new Error('Not Supported');
        }
        public Write(entity: null): void {
            throw new Error('Not Supported');
        }

    }

    export const Wols: WolStore = WolStore.Instance;
}
