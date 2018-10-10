/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />

namespace Fw.Views.Property {
    /**
     * @description background-size
     */
    export enum FitPolicy {
        /**
         * 自動(と、containの違いがいまいちわからん)
         */
        Auto = 'auto',

        /**
         * コンテンツを全て表示しきる、最大サイズ
         */
        Contain = 'contain',

        /**
         * 枠に合わせてコンテンツの上下をカットした最大サイズ
         */
        Cover = 'cover'
    }
}