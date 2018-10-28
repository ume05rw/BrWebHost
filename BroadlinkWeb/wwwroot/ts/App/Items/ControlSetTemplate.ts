/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Items {
    /**
     * リモコン機能とボタン配置のテンプレート
     * 注) controlsetテーブルのIDと連動している。
     */
    export enum ControlSetTemplate {
        Tv = 1,
        Av = 2,
        Light = 3,
        AirComplessor = 4,

        SingleControl = 8,
        NoControl = 9,

        /**
         * 以下、UI側では使用しない。
         */
        A1Sensor = 5,
        Sp2Switch = 6,
        Sp1Switch = 7,
    }
}
