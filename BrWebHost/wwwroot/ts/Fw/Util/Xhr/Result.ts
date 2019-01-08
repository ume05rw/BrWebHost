/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />

namespace Fw.Util.Xhr {
    import Dump = Fw.Util.Dump;

    export class Error {
        public readonly Message: string = '';
        public readonly Name: string = '';

        constructor(message: string, name?: string) {
            this.Message = message;
            this.Name = name || '';
        }
    }

    // まだ使わない。
    // API仕様が固まったら、やろうかな。
    export class Result {
        public static CreateSucceeded(values: any): Result {
            return new Result(true, values, []);
        }
        public static CreateError(errors: Array<Error>): Result {
            return new Result(false, {}, errors);
        }

        public readonly Succeeded: boolean;
        public readonly Values: any;
        public readonly Errors: Array<Error>;

        constructor(succeeded: boolean, values: any, errors: Array<any>) {
            this.Succeeded = succeeded;
            this.Values = values;
            this.Errors = errors;
        }
    }


}