/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../Entities/A1Values.ts" />
/// <reference path="../Entities/DateTimeRange.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import A1Values = App.Models.Entities.A1Values;
    import Xhr = Fw.Util.Xhr;
    import DateTimeRange = App.Models.Entities.DateTimeRange;
    import Lang = App.Items.Lang.Lang;

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
                //console.log(result);

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

        public async GetHourly(controlSet: ControlSet): Promise<A1Values[]> {
            this.Log('GetHourly');

            const range = new DateTimeRange();
            const start = new Date();
            start.setHours(start.getHours() - 24);
            range.SetStart(start);
            range.SetEnd(new Date());

            const params = new Xhr.Params(
                `A1s/GetHourly/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Post,
                range
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = new Array<A1Values>();
                _.each(res.Values as A1Values[], (v) => {
                    const val = new A1Values();
                    val.Temperature = v.Temperature;
                    val.Humidity = v.Humidity;
                    val.Voc = v.Voc;
                    val.Light = v.Light;
                    val.Noise = v.Noise;
                    val.Recorded = v.Recorded;
                    result.push(val);
                });

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async GetDaily(controlSet: ControlSet): Promise<A1Values[]> {
            this.Log('GetDaily');

            const range = new DateTimeRange();
            const start = new Date();
            start.setMonth(start.getMonth() - 1);
            range.SetStart(start);
            range.SetEnd(new Date());

            const params = new Xhr.Params(
                `A1s/GetDaily/${controlSet.BrDeviceId}`,
                Xhr.MethodType.Post,
                range
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                var result = new Array<A1Values>();
                _.each(res.Values as A1Values[], (v) => {
                    const val = new A1Values();
                    val.Temperature = v.Temperature;
                    val.Humidity = v.Humidity;
                    val.Voc = v.Voc;
                    val.Light = v.Light;
                    val.Noise = v.Noise;
                    val.Recorded = v.Recorded;
                    result.push(val);
                });

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }


        public GetVodString(voc: number): string {
            switch (voc) {
                case 0: return Lang.Excellent;
                case 1: return Lang.Good;
                case 2: return Lang.Normal;
                case 3: return Lang.Bad;
                default: return Lang.Unknown;
            }
        }

        public GetLightString(voc: number): string {
            switch (voc) {
                case 0: return Lang.Dark;
                case 1: return Lang.Dim;
                case 2: return Lang.Normal;
                case 3: return Lang.Bad;
                default: return Lang.Unknown;
            }
        }

        public GetNoiseString(voc: number): string {
            switch (voc) {
                case 0: return Lang.Quiet;
                case 1: return Lang.Normal;
                case 2: return Lang.Noisy;
                default: return Lang.Unknown;
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
