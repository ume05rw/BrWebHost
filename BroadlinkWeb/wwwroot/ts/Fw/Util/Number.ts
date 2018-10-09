/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />

namespace Fw.Util {
    import Dump = Fw.Util.Dump;

    export class Number {
        /**
         * @see ビルトインisNaNでは、isNaN(null) === true になってしまう。
         * @param value
         */
        public static IsNaN(value: number) {
            return (value !== value);
        }
    }
}