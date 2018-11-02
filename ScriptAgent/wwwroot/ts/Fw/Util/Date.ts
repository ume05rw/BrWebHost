/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />

namespace Fw.Util {
    import Dump = Fw.Util.Dump;

    export class DateTime {
        public static GetDate(dateString: string): Date {
            if (!dateString || dateString === '')
                return null;

            try {
                return new Date( Date.parse(dateString) );
            } catch (e) {
                return null;
            }
        }
    }
}
