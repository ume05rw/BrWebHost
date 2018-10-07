/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
    export class Dump {
        public static Log(value: any) {
            const dump = _.isObject(value)
                ? '\n' + JSON.stringify(value, null, "\t")
                : value;
            console.log(`${Dump.GetTimestamp()} :: ${Dump.GetDumpedString(value)}`);
        }

        public static ErrorLog(value: any, message?: string) {
            console.log('');
            console.log('########################################');
            console.log('########################################');
            console.log(`${Dump.GetTimestamp()} :: ERROR!! ${(message ? '[ ' + message + ' ]' : '')}`);
            console.log(Dump.GetDumpedString(value));
        }

        private static GetTimestamp(): string {
            const now = new Date();
            return `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}.${('000' + now.getMilliseconds()).slice(3)}`;
        }

        private static GetDumpedString(value: any): string {
            return _.isObject(value)
                ? '\n' + JSON.stringify(value, null, "\t")
                : String(value);
        }
    }
}