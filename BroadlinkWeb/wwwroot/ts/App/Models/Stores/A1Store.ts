/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../Entities/A1Values.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import A1Values = App.Models.Entities.A1Values;
    import Xhr = Fw.Util.Xhr;

    export class A1Store extends Fw.Models.StoreBase<A1Values> {

        private static _instance: A1Store = null;
        public static get Instance(): A1Store {
            if (A1Store._instance === null)
                A1Store._instance = new A1Store();

            return A1Store._instance;
        }


        protected constructor() {
            super();

            this.SetClassName('A1Store');
            this.EnableLog = true;
        }

        public async Get(controlSet: ControlSet): Promise<A1Values> {
            this.Log('Get');

            const params = new Xhr.Params(
                `A1s/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = res.Values as A1Values;

                controlSet.GetControlByCode('Temp').Value = result.Temperature.toFixed(1);
                controlSet.GetControlByCode('Humidity').Value = result.Humidity.toFixed(1);
                controlSet.GetControlByCode('Voc').Value = this.GetVodString(result.Voc);
                controlSet.GetControlByCode('Light').Value = this.GetLightString(result.Light);
                controlSet.GetControlByCode('Noise').Value = this.GetNoiseString(result.Noise);
                controlSet.DispatchChanged();

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public GetVodString(voc: number): string {
            switch (voc) {
                case 0: return 'Excellent';
                case 1: return 'Good';
                case 2: return 'Normal';
                case 3: return 'Bad';
                default: return 'Unknown';
            }
        }

        public GetLightString(voc: number): string {
            switch (voc) {
                case 0: return 'Dark';
                case 1: return 'Dim';
                case 2: return 'Normal';
                case 3: return 'Bright';
                default: return 'Unknown';
            }
        }

        public GetNoiseString(voc: number): string {
            switch (voc) {
                case 0: return 'Quiet';
                case 1: return 'Normal';
                case 2: return 'Noisy';
                default: return 'Unknown';
            }
        }

        protected GetNewEntity(): A1Values {
            return new A1Values();
        }
        public Write(entity: A1Values): void {
            throw new Error('Not Supported');
        }
    }

    export const A1s: A1Store = A1Store.Instance;
}
