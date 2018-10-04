/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />

namespace Fw.Util.Xhr {
    // まだ使わない。
    // API仕様が固まったら、やろうかな。
    export class Result {
        public Succeeded: boolean;
        public Values: any;
        public Errors: any;
    }
}