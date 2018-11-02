/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class Script extends Fw.Models.EntityBase {
        public ControlId: number = 0;
        public Name: string = '';
        public RemoteHostId: number;
    }
}
