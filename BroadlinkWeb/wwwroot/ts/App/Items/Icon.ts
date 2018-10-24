/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />

namespace App.Items {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;

    export class Icon {
        public static Scene: string = 'images/icons/operation/scene.png';
        public static Tv: string = 'images/icons/operation/tv.png';
        public static Av: string = 'images/icons/operation/av.png';
        public static Light: string = 'images/icons/operation/light.png';

        public static Free: string = 'images/icons/operation/free.png';
        public static WoL: string = 'images/icons/operation/magicpacket.png';
        public static Script: string = 'images/icons/operation/script.png';
        public static Remote: string = 'images/icons/operation/remote.png';

        // TODO: 以下、ソレっぽいアイコンを用意する。
        public static Air: string = 'images/icons/operation/layout.png'; 
        public static BrA1: string = 'images/icons/operation/rocket.png';
        public static BrSp2: string = 'images/icons/operation/rocket.png';
        public static BrSc1: string = 'images/icons/operation/rocket.png';
        public static BrS1c: string = 'images/icons/operation/rocket.png';


        public static Names: Array<string> = [
            'arrow1_down.png',
            'arrow1_left.png',
            'arrow1_right.png',
            'arrow1_up.png',
            'arrow2_down.png',
            'arrow2_left.png',
            'arrow2_right.png',
            'arrow2_up.png',
            'bluetooth.png',
            'circle_check.png',

            'circle_cross.png',
            'circle_info.png',
            'circle_minus.png',
            'circle_pause.png',
            'circle_play.png',
            'circle_plus.png',
            'circle_prohibition.png',
            'clock.png',
            'darrow_down.png',
            'darrow_left.png',
            'darrow_right.png',
            'darrow_up.png',

            'dustbox.png',
            'edit.png',
            'favorite.png',
            'headphones.png',
            'heart.png',
            'home.png',
            'layer.png',
            'layout.png',
            'lightning.png',
            'menu.png',

            'mic.png',
            'monitor.png',
            'moon.png',
            'photo_camera.png',
            'pin.png',
            'power.png',
            'profile.png',
            'refresh.png',
            'rocket.png',
            'settings1.png',

            'settings2.png',
            'sound.png',
            'speech.png',
            'sun.png',
            'target.png',
            'video_camera.png',
            'video_film.png',

            'num_0.png',
            'num_1.png',
            'num_2.png',
            'num_3.png',
            'num_4.png',
            'num_5.png',
            'num_6.png',
            'num_7.png',
            'num_8.png',
            'num_9.png',
            'num_10.png',
            'num_11.png',
            'num_12.png',
            'num_aster.png',
            'num_sharp.png',
        ];

        public static Mains: Array<string> = [
            'main_free.png',            // 0 自由割当
            'main_tv.png',              // 1 TV
            'main_av.png',              // 2 AV
            'main_light.png',           // 3 Light
            'main_aircompressor.png',   // 4 Air Compressor
            'main_a1.png',              // 5 A1 Sensor
            'main_sp2.png',             // 6 Sp2 Switch
        ];
    }
}
