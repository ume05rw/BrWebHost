/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />

namespace App {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;

    export class Color {
        // ライトブラウン - 女っぽいからターゲット外
        //public static Main: string = '#FFFFFF';
        //public static MainBackground: string = '#D4B16A';
        //public static MainHover: string = '#D9BA7C';
        //public static HeaderButtonBackground = '#C79B41';
        //public static HeaderButtonHover = '#CDA555';

        public static Transparent: string = 'transparent';

        /**
         * メイン文字／枠線色
         */
        public static Main: string = '#000000';

        /**
         * メイン背景色
         */
        public static MainBackground: string = '#f5f5f5';

        /**
         * メインホバー色
         */
        public static MainHover: string = '#e0e0e0';

        /**
         * ヘッダ配置ボタンの背景色
         */
        public static HeaderButtonBackground: string = '#ececec';

        /**
         * ヘッダ配置ボタンのホバー色
         */
        public static HeaderButtonHover: string = '#e0e0e0';

        /**
         * 反転した文字／枠線色
         */
        public static ReverseMain: string = '#FFFFFF';

        /**
         * ボタン色配列
         */
        public static ButtonColors: Array<string> = [
            '#9d9e9e',
            '#84bde8',
            '#81c03b',
            '#ccdc4b',
            '#fcc91f',
            '#F92068',
            '#6545C6',
            '#B5743B',
        ];

        /**
         * ボタン色名配列
         */
        public static ButtonColorNames: Array<string> = [
            'gray',
            'light blue',
            'green',
            'light green',
            'orange',
            'red',
            'purple',
            'brown'
        ];

        /**
         * ボタンのホバー色配列
         */
        public static ButtonHoverColors: Array<string> = [
            '#b4b4b4',
            '#8fcfff',
            '#9bde50',
            '#dcec5e',
            '#ffd856',
            '#ff538c',
            '#8463e6',
            '#d88e4e'
        ];
    }
}
