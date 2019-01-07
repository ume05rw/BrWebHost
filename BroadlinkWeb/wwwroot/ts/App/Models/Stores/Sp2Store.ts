/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../Entities/Sp2Status.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Sp2Status = App.Models.Entities.Sp2Status;
    import Xhr = Fw.Util.Xhr;

    export class Sp2Store extends Fw.Models.StoreBase<Sp2Status> {

        private static _instance: Sp2Store = null;
        public static get Instance(): Sp2Store {
            if (Sp2Store._instance === null)
                Sp2Store._instance = new Sp2Store();

            return Sp2Store._instance;
        }


        protected constructor() {
            super();

            this.SetClassName('Sp2Store');
            //this.EnableLog = true;
        }

        public async Get(controlSet: ControlSet): Promise<Sp2Status> {
            this.Log('Get');

            const params = new Xhr.Params(
                `Sp2s/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as Sp2Status;

                controlSet.GetControlByCode('PowerOn').Value = (result.Power) ? 'true' : 'false';
                controlSet.GetControlByCode('PowerOff').Value = (result.Power) ? 'false' : 'true';
                controlSet.GetControlByCode('LightOn').Value = (result.NightLight) ? 'true' : 'false';
                controlSet.GetControlByCode('LightOff').Value = (result.NightLight) ? 'false' : 'true';
                controlSet.ToggleState = result.Power;
                controlSet.DispatchChanged();

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Set(controlSet: ControlSet, control: Control): Promise<Sp2Status> {
            this.Log('Set');

            const status = new Sp2Status();
            status.Power = (controlSet.GetControlByCode('PowerOn').Value === 'true');
            status.NightLight = (controlSet.GetControlByCode('LightOn').Value === 'true');

            switch (control.Code) {
                case 'PowerOn':
                    status.Power = true;
                    break;
                case 'PowerOff':
                    status.Power = false;
                    break;
                case 'LightOn':
                    status.NightLight = true;
                    break;
                case 'LightOff':
                    status.NightLight = false;
                    break;
                default:
                    break;
            }

            const params = new Xhr.Params(
                `Sp2s/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Post,
                status
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as Sp2Status;

                controlSet.GetControlByCode('PowerOn').Value = (result.Power) ? 'true' : 'false';
                controlSet.GetControlByCode('PowerOff').Value = (result.Power) ? 'false' : 'true';
                controlSet.GetControlByCode('LightOn').Value = (result.NightLight) ? 'true' : 'false';
                controlSet.GetControlByCode('LightOff').Value = (result.NightLight) ? 'false' : 'true';
                controlSet.ToggleState = result.Power;
                controlSet.DispatchChanged();

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }


        protected GetNewEntity(): Sp2Status {
            return new Sp2Status();
        }
        public Write(entity: Sp2Status): void {
            throw new Error('Not Supported');
        }
    }

    export const Sp2s: Sp2Store = Sp2Store.Instance;
}
