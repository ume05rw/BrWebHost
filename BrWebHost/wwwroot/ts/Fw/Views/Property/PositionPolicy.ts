/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />

namespace Fw.Views.Property {
    /**
     * @description 配置基準
     */
    export enum PositionPolicy {
        /**
         * 中央ポリシー：親Viewの中心位置からの差分を X, Y で表現する。
         */
        Centering = 1,

        /**
         * 左上ポリシー：親Viewの左上からの差分を、Left, Top で表現する。
         */
        LeftTop = 2
    }
}