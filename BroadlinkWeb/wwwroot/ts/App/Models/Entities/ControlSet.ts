/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class ControlSet extends Fw.Models.EntityBase {

        /**
         * BrDeviceID: null もセットしないでおく。
         * 何もセットしないことで、インスタンスにプロパティが存在しない状態を維持する。
         */
        public BrDeviceId: number; 

        /**
         * リモコン名
         */
        public Name: string = 'New Remote Control';

        /**
         * リモコン配置テンプレートか否か
         */
        public IsTemplate: boolean = false;

        /**
         * コントロールボタン配列
         */
        public Controls: Array<Control> = [];
    }
}
