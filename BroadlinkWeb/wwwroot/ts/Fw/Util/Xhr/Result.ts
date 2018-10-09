/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />

namespace Fw.Util.Xhr {
    import Dump = Fw.Util.Dump;

    // まだ使わない。
    // API仕様が固まったら、やろうかな。
    export class Result {
        public static CreateSucceeded(values: any): Result {
            return new Result(true, values, {});
        }
        public static CreateError(errors: any): Result {
            return new Result(false, {}, errors);
        }

        public readonly Succeeded: boolean;
        public readonly Values: any;
        public readonly Errors: any;

        constructor(succeeded: boolean, values: any, errors: any) {
            this.Succeeded = succeeded;
            this.Values = values;
            this.Errors = errors;
        }
    }
}