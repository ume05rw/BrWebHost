/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/Icon.ts" />
/// <reference path="../../Items/Weekday.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;
    import Weekday = App.Items.Weekday;
    import OperationTemplate = App.Items.OperationTemplate;
    import Lang = App.Items.Lang.Lang;

    export class Schedule extends Fw.Models.EntityBase {

        public Name: string = Lang.NewTimer;

        public IconUrl: string = Icon.GetByOperationTemplate(OperationTemplate.Schedule, true);

        public SceneId: number = null;

        public ControlSetId: number = null;

        public ControlId: number = null;

        public CurrentJobId: number = null;

        public Enabled: boolean = true;

        //public StartTime: Date = new Date(2000, 1, 1, 10, 0, 0);

        public WeekdayFlags: string = '1111111';

        //public NextDateTime: Date; // 初期化しないでおく。

        public Color: string = Color.ButtonColors[9];

        public Order: number = 99999;


        public StartTimeString: string = '';

        public NextDateTimeString: string; // 初期化しないでおく。


        public GetWeekdayFlag(weekday: Weekday): boolean {
            if (this.WeekdayFlags.length !== 7)
                throw new Error('WeekdayFlags Fromat Failure');

            const index = weekday as number;
            return (this.WeekdayFlags[index] === '1');
        }

        public SetWeekdayFlag(weekday: Weekday, enable: boolean) {
            if (this.WeekdayFlags.length !== 7)
                throw new Error('WeekdayFlags Fromat Failure');

            const index = weekday as number;
            const flagString = (enable) ? '1' : '0';

            let flags = this.WeekdayFlags;
            if (index === 0) {
                flags = flagString + flags.substr(index + 1);
            } else if (0 < index && index < 6) {
                flags = flags.substr(0, index)
                    + flagString
                    + flags.substr(index + 1);
            } else if (index === 6) {
                flags = flags.substr(0, index) + flagString;
            } else {
                throw new Error('なぜなんだー');
            }

            this.WeekdayFlags = flags;
        }
    }
}
