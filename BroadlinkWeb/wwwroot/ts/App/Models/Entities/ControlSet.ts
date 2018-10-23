/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;

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
         * 背景色
         */
        public get Color(): string {
            return this._color;
        }
        public set Color(value: string) {
            if (this._color !== value) {
                this._color = value;
                this._hoverColor = Color.GetButtonHoverColor(this._color);
            }
        }
        private _color: string = Color.ButtonColors[0];

        /**
         * ホバー色
         */
        public get HoverColor(): string {
            return this._hoverColor;
        }
        private _hoverColor: string = Color.ButtonHoverColors[0];

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
