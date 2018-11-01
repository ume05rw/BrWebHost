/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;

    export class Job extends Fw.Models.EntityBase {
        public Name: string = '';
        public IsCompleted: boolean = false;
        public IsError: boolean = false;
        public Progress: number = 0;
        public Message: string = '';
        public Json: string = '';
        public Created: string;
        public Updated: string;

        public GetJsonObject(): any {
            if (!this.Json)
                return null;

            //Dump.Log(this.Json);
            return JSON.parse(this.Json);
        }
    }
}
