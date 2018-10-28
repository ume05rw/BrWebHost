/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Items {
    /**
     * 操作テンプレート
     */
    export const enum OperationTemplate {
        /**
         * 操作組み合わせ
         */
        Scene = 1,

        /**
         * TVリモコン
         */
        Tv = 2,

        /**
         * AVリモコン
         */
        Av = 3,

        /**
         * 照明リモコン
         */
        Light = 4,

        /**
         * 自由編集リモコン
         */
        Free = 6,

        /**
         * Wake on LAN
         */
        WoL = 7,

        /**
         * ローカルのスクリプト実行
         */
        Script = 8,



        //
        // 以下、そのうち暇なら実装すっべ系
        //

        /**
         * エアコンリモコン
         */
        AirComplessor = 5, 

        /**
         * リモートホストスクリプト
         */
        RemoteHostScript = 9,
    } 
}
