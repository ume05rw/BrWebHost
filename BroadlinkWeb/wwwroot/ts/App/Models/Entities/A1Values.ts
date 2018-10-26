/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class A1Values extends Fw.Models.EntityBase {
        public Temperature: number = 0;
        public Humidity: number = 0;
        public Voc: number = 0;
        public Light: number = 0;
        public Noise: number = 0;
    }
}
