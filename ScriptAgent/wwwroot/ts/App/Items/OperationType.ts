/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Items {
    /**
     * 操作区分
     */
    export const enum OperationType {
        /**
         * IR/RF信号操作
         */
        RemoteControl = 1,

        /**
         * Broadlinkデバイス操作
         */
        BroadlinkDevice = 2,

        /**
         * Wake On LAN 操作
         */
        WakeOnLan = 3,

        /**
         * ローカルのスクリプト実行
         */
        Script = 4,

        /**
         * リモートBroadlinkWebホストのスクリプト
         */
        RemoteHostScript = 5,

        /**
         * 操作組み合わせ
         */
        Scene = 99
    }
}
