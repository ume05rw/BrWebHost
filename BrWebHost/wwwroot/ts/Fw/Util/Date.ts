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

        /**
         * 時差情報付きISO8601文字列を取得する。
         * @param date
         */
        public static GetIso8601(date: Date): string {

            const offset = date.getTimezoneOffset() * -1; // 時差符号は逆転させる。
            const offsetHour = Math.ceil( Math.abs(offset) / 60);
            const offsetMinute = Math.abs(offset) % 60;

            const offsetString = (offset === 0)
                ? 'Z'
                : (((offset > 0) ? '+' : '-')
                    + ('0' + offsetHour).slice(-2)
                    + ':' + ('0' + offsetMinute).slice(-2));

            const result = date.getFullYear()
                + '-' + ('0' + (date.getMonth() + 1)).slice(-2)
                + '-' + ('0' + date.getDate()).slice(-2)
                + 'T' + ('0' + date.getHours()).slice(-2)
                + ':' + ('0' + date.getMinutes()).slice(-2)
                + ':' + ('0' + date.getSeconds()).slice(-2)
                + '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
                + offsetString;

            return result;
        }
    }
}
