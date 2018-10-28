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

    export class OperationStore extends Fw.Models.StoreBase<null> {

        private static _instance: OperationStore = null;
        public static get Instance(): OperationStore {
            if (OperationStore._instance === null)
                OperationStore._instance = new OperationStore();

            return OperationStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('OperationStore');
            this.EnableLog = true;
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
            ) {
                return false;
            }

            let result = false;

            switch (controlSet.OperationType) {
                case OperationType.RemoteControl:
                    result = await Stores.Rms.Exec(controlSet, control);
                    break;
                case OperationType.BroadlinkDevice:
                    result = await Stores.BrDevices.Exec(controlSet, control);
                    break;
                case OperationType.WakeOnLan:
                    result = await Stores.Wols.Exec(controlSet, control);
                    break;
                case OperationType.Script:
                    result = await Stores.Scripts.Exec(controlSet, control);
                    break;
                case OperationType.RemoteHostScript:
                    result = await Stores.Remotes.Exec(controlSet, control);
                    break;
                case OperationType.Scene:
                    alert('Not Implements!');
                    break;
                default:
                    break;
            }

            if (
                result === true
                && (control.IsAssignToggleOn || control.IsAssignToggleOff)
            ) {
                this.EnsureToggles(controlSet, control);
            }

            return result;
        }

        private EnsureToggles(controlSet: ControlSet, control: Control): void {
            // コマンド送信成功、かつトグルがアサインされているとき
            if (control.IsAssignToggleOn && control.IsAssignToggleOff) {
                // On/Off 両方アサインされているボタンのとき

                // 一旦Onにし、しばらく置いてOffに戻す。
                const changed = (controlSet.ToggleState !== true);
                controlSet.ToggleState = true;
                if (changed)
                    controlSet.DispatchChanged();

                _.delay(() => {
                    const changed2 = (controlSet.ToggleState !== false);
                    controlSet.ToggleState = false;
                    if (changed2)
                        controlSet.DispatchChanged();

                    Stores.ControlSets.UpdateHeader(controlSet);

                }, 1000);

            } else if (control.IsAssignToggleOn) {
                // Onだけがアサインされているボタンのとき
                // トグルをOnにする。
                const changed3 = (controlSet.ToggleState !== true);
                controlSet.ToggleState = true;
                if (changed3)
                    controlSet.DispatchChanged();

                Stores.ControlSets.UpdateHeader(controlSet);

            } else if (control.IsAssignToggleOff) {
                // Offだけがアサインされているボタンのとき
                // トグルをOffにする。
                const changed4 = (controlSet.ToggleState !== false);
                controlSet.ToggleState = false;
                if (changed4)
                    controlSet.DispatchChanged();

                Stores.ControlSets.UpdateHeader(controlSet);

            } else {
                // ここには来ない
                throw new Error('そんなばかなー！');
            }
        }


        protected GetNewEntity(): null {
            throw new Error('Not Supported');
        }
        public Write(entity: BrDevice): void {
            throw new Error('Not Supported');
        }
    }

    export const Operations: OperationStore = OperationStore.Instance;
}
