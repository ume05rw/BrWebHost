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

    export class RemoteStore extends Fw.Models.StoreBase<null> {

        private static _instance: RemoteStore = null;
        public static get Instance(): RemoteStore {
            if (RemoteStore._instance === null)
                RemoteStore._instance = new RemoteStore();

            return RemoteStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('RemoteStore');
            this.EnableLog = true;
        }

        public async Exec(controlSet: ControlSet, control: Control): Promise<boolean> {
            this.Log('Exec');
            alert('Not Implements!');
            return true;
        }


        protected GetNewEntity(): null {
            throw new Error('Not Supported');
        }
        public Write(entity: null): void {
            throw new Error('Not Supported');
        }

    }

    export const Remotes: RemoteStore = RemoteStore.Instance;
}
