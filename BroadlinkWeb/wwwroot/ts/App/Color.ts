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
        public static Main: string = '#000000';
        public static MainBackground: string = '#f5f5f5';
        public static MainHover: string = '#e0e0e0';
        public static HeaderButtonBackground: string = '#ececec';
        public static HeaderButtonHover: string = '#e0e0e0';
        public static ReverseMain: string = '#FFFFFF';


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

        public static ButtonHoverColors: Array<string> = [
            '#b4b4b4',
            '#8fcfff',
            '#9bde50',
            '#ebff4a',
            '#ffd856',
            '#ff3f7f',
            '#8463e6',
            '#d88e4e'
        ];
    }
}