/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />

namespace Fw.Util.Xhr {
    import Dump = Fw.Util.Dump;

    export class Params {
        public Url: string;
        public Method: MethodType = MethodType.Post;
        public Values: any = {};
        public Callback: any = function () { };

        constructor(url: string, method: MethodType = null, values: any = null) {
            this.Url = url;
            this.Method = method || MethodType.Post;
            this.Values = values || {};
        }
    }
}