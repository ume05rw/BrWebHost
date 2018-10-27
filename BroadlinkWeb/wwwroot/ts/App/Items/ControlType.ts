/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace App.Items {
    /**
     * 操作区分
     */
    export const enum ControlType {
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
         * フリースクリプト操作
         */
        Script = 4,

        /**
         * リモートBroadlinkWebホストのスクリプト
         */
        RemoteHost = 5
    }
}
