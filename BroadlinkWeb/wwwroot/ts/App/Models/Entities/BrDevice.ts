/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Entities/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class BrDevice extends Fw.Models.Entities.EntityBase {
        public Id: number;
        public MacAddressString: string;
        public IpAddressString: string;
        public Port: number;
        public DeviceTypeDetailNumber: number;
        public IsActive: boolean;
        public DeviceTypeDetal: string;
        public DeviceType: string;
    }
}