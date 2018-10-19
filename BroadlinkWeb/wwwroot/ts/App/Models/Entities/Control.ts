/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Entities/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class Control extends Fw.Models.Entities.EntityBase {
        public Id: number;
        public ControlSetId: number;
        public Name: string;
        public PositionLeft: number;
        public PositionTop: number;
        public Color: string;
        public HoverColor: string;
        public IconUrl: string;
        public Code: string;
        public IsAssignToggleOn: boolean;
        public IsAssignToggleOff: boolean;
    }
}