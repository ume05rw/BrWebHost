/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class A1Values extends Fw.Models.EntityBase {

        public BrDeviceId: number;

        public Temperature: number = 0;
        public Humidity: number = 0;
        public Voc: number = 0;
        public Light: number = 0;
        public Noise: number = 0;

        public Recorded: string;
        public Created: string;
        public Updated: string;

        public get RecordedDate(): Date {
            return Fw.Util.DateTime.GetDate(this.Recorded);
        }

        public get CreatedDate(): Date {
            return Fw.Util.DateTime.GetDate(this.Created);
        }

        public get UpdatedDate(): Date {
            return Fw.Util.DateTime.GetDate(this.Updated);
        }
    }
}
