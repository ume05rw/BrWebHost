/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Items {
    /**
     * Broadlinkデバイス種
     * SharpBroadlink.Devices.DeviceType を、そのまま持ってくる。
     */
    export const enum DeviceType {
        Unknown = 0,
        Sp1 = 1,
        Sp2 = 2,
        Rm = 3,
        A1 = 4,
        Mp1 = 5,
        Hysen = 6,
        S1c = 7,
        Dooya = 8,
        Rm2Pro = 9
    }
}
