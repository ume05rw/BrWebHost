/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;

    export class SceneStatus extends Fw.Models.EntityBase {
        public Step: number = 0;
        public TotalStep: number = 0;
        public Error: string = '';
    }
}
