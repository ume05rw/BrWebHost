/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Entities/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class ControlSet extends Fw.Models.Entities.EntityBase {
        public Id: number;
        public BrDeviceId: number;
        public Name: string;

        public Controls: Array<Control>;
    }
}