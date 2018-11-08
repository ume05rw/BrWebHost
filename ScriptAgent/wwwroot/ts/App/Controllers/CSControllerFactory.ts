/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/ObjectBase.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/DeviceType.ts" />


namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;
    import Stores = App.Models.Stores;

    export class ControlSetControllerFactory {

        private static _instance: ControlSetControllerFactory = null;
        public static get Instance(): ControlSetControllerFactory {
            if (ControlSetControllerFactory._instance === null)
                ControlSetControllerFactory._instance = new ControlSetControllerFactory();

            return ControlSetControllerFactory._instance;
        }


        private _manager: Fw.Controllers.Manager;

        private constructor() {
            this._manager = Fw.Controllers.Manager.Instance;
        }

        public Get(controlSet: ControlSet): IControlSetController {
            if (!controlSet)
                throw new Error("ControlSet Cot Found");

            switch (controlSet.OperationType) {
                case OperationType.RemoteControl:
                    return this._manager.Get('ControlSet') as ControlSetController;
                    break;
                case OperationType.BroadlinkDevice:
                    //const brDev = Stores.BrDevices.Get(controlSet.BrDeviceId);
                    //switch (brDev.DeviceType) {
                    //    case DeviceType.A1:
                    //        return this._manager.Get('A1Set') as A1SetController;
                    //    case DeviceType.Sp2:
                    //        //return this._manager.Get('Sp2Set') as Sp2SetController;
                    //        return this._manager.Get('ControlSet') as ControlSetController;

                    //    case DeviceType.Rm2Pro:
                    //        //return this._manager.Get('Rm2Pro') as Rm2ProSetController;
                    //        return this._manager.Get('ControlSet') as ControlSetController;

                    //    case DeviceType.Sp1:
                    //    case DeviceType.Rm:
                    //    case DeviceType.Mp1:
                    //    case DeviceType.Hysen:
                    //    case DeviceType.S1c:
                    //    case DeviceType.Dooya:
                    //        break;
                    //}

                    break;

                // 以下、実装検討中。
                case OperationType.WakeOnLan:
                    //return this._manager.Get('Wol') as WolSetController;
                    return this._manager.Get('ControlSet') as ControlSetController;
                case OperationType.Script:
                    //return this._manager.Get('Script') as ScriptSetController;
                    return this._manager.Get('ControlSet') as ControlSetController;
                case OperationType.RemoteHostScript:
                    //return this._manager.Get('RemoteHostScript') as RemoteHostScriptSetController;
                    return this._manager.Get('ControlSet') as ControlSetController;
                case OperationType.Scene:
                detault:
                    break;
            }

            throw new Error("Controller Cot Found");
        }

    }

    export const CSControllerFactory: ControlSetControllerFactory = ControlSetControllerFactory.Instance;
}
