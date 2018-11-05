/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="OperationTemplate.ts" />

namespace App.Items {
    import Dump = Fw.Util.Dump;
    import OperationTemplate = App.Items.OperationTemplate;

    export class Icon {

        public static GetByOperationTemplate(template: OperationTemplate, isLarge: boolean = false): string {
            const idx = template as number;
            const name = Icon.Operations[idx];

            if (!name)
                return null;

            return (isLarge)
                ? 'images/icons/operation/large/' + name
                : 'images/icons/operation/small/' + name;
        }

        public static Operations: Array<string> = [
            /**
             * 空
             */
            '',

            /**
             * 1.シーン
             */
            'scene.png',

            /**
             * 2.TV
             */
            'tv.png',

            /**
             * 3.AV
             */
            'av.png',

            /**
             * 4.Light
             */
            'light.png',

            /**
             * 5.Light
             */
            'av.png',

            /**
             * 6.Free
             */
            'free.png',

            /**
             * 7.WoL
             */
            'wol.png',

            /**
             * 8.Script
             */
            'script.png',

            /**
             * 9.RemoteHostScript
             */
            'remote.png',

            /**
             * 10.Schedule
             */
            'schedule.png'
        ];


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

            'bag.png',
            'battery.png',
            'bell.png',
            'bookmark.png',
            'briefcase.png',
            'calendar.png',
            'cancel.png',
            'clip.png',
            'clock2.png',
            'cloud.png',

            'creditcard.png',
            'cursor.png',
            'cursor2.png',
            'cut.png',
            'cutlery.png',
            'download.png',
            'envelope.png',
            'export.png',
            'file.png',
            'folder.png',

            'gallery.png',
            'gamepad.png',
            'help.png',
            'hourglass.png',
            'link.png',
            'logout.png',
            'magnet.png',
            'padnote.png',
            'paint.png',
            'photocamera.png',

            'placeholder.png',
            'presentation.png',
            'printer.png',
            'puzzle.png',
            'screen.png',
            'search.png',
            'setting3.png',
            'share.png',
            'shield.png',
            'shoppingcart.png',

            'shutter.png',
            'smartphone.png',
            'speedometer.png',
            'stats.png',
            'store.png',
            'switch.png',
            'tag.png',
            'timer.png',
            'unlock.png',
            'upload.png',

            'visible.png',
            'waiting.png',
            'wifi.png',
            'zoomin.png',
            'zoomout.png',
        ];
    }
}
