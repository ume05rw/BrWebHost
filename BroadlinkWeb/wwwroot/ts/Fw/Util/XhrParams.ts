/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
    export class XhrParams {
        public Url: string;
        public Method: XhrMethodType = XhrMethodType.Post;
        public Values: any = {};
        public Callback: any = function () { };

        constructor(url: string, method: XhrMethodType = null, values: any = null) {
            this.Url = url;
            this.Method = method || XhrMethodType.Post;
            this.Values = values || {};
        }
    }
}