/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/ControlSetTemplate.ts" />
/// <reference path="../../Items/OperationType.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;
    import ControlSetTemplate = App.Items.ControlSetTemplate;
    import OperationType = App.Items.OperationType;

    export class SceneDetail extends Fw.Models.EntityBase {

        public SceneId: number;

        public ControlSetId: number;

        public ControlId: number;

        public WaitSecond: number;

        public Order: number;
    }
}
