/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Itmes {
    /**
     * メイン画面機能
     */
    export enum Operation {
        Scene = 1,
        Tv = 2,
        Av = 3,
        Light = 4,
        Free = 6,

        // 以下、そのうち暇なら実装すっべ系
        Air = 5,
        WoL = 7,
        Script = 8,
        Remote = 9,
        BrA1 = 101,
        BrSp2 = 102,
        BrSc1 = 103,
        BrS1c = 104
    }
}
