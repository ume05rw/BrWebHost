/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class Control extends Fw.Models.EntityBase {
        public ControlSetId: number = 0;
        public Name: string = '';
        public PositionLeft: number = 0;
        public PositionTop: number = 0;
        public Color: string = '';
        public HoverColor: string = '';
        public IconUrl: string = '';
        public Code: string = '';
        public IsAssignToggleOn: boolean = false;
        public IsAssignToggleOff: boolean = false;
    }
}