/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/ControlSetTemplate.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;
    import ControlSetTemplate = App.Items.ControlSetTemplate;

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
         * メインパネルボタン用アイコンURL
         */
        public IconUrl: string = 'images/icons/main_av.png';

        /**
         * 背景色
         */
        public Color: string = Color.ButtonColors[0];

        /**
         * メインパネル表示順
         */
        public Order: number = 99999;

        /**
         * ホバー色
         */
        public get HoverColor(): string {
            return Color.GetButtonHoverColor(this.Color);
        }

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
