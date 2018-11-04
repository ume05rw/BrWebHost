/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class DateTimeRange extends Fw.Models.EntityBase {
        public Start: string;
        public End: string;

        public SetStart(date: Date): void {
            this.Start = date.toISOString();
        }

        public SetEnd(date: Date): void {
            this.End = date.toISOString();
        }
    }
}
