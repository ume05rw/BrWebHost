/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/Icon.ts" />
/// <reference path="../../Items/OperationType.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;
    import OperationTemplate = App.Items.OperationTemplate;

    export class Schedule extends Fw.Models.EntityBase {

        public Name: string = 'New Timer';

        public SceneId: number;

        public ControlSetId: number;

        public ControlId: number;

        public CurrentJobId: number;

        public Enabled: boolean;

        public StartTime: Date;

        public WeekdayFlags: string = '1111111';

        public NextDateTime: Date;

        public Order: number = 99999;
    }
}
