/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class BrDevice extends Fw.Models.EntityBase {
        public MacAddressString: string;
        public IpAddressString: string;
        public Port: number;
        public DeviceTypeDetailNumber: number;
        public IsActive: boolean;
        public DeviceTypeDetal: string;
        public DeviceType: App.Items.DeviceType;
    }
}
