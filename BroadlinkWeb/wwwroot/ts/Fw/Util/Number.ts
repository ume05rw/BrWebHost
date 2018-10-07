/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
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