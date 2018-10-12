/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
    export class Dump {
        public static Log(value: any) {
            try {
                console.log(`${Dump.GetTimestamp()} :: ${Dump.GetDumpedString(value)}`);
            } catch (e) {
                // 引数の循環参照など
                console.log(`${Dump.GetTimestamp()} ::`);
                console.log(value);
            }
        }

        public static ErrorLog(value: any, message?: string) {
            console.log('');
            console.log('########################################');
            console.log('########################################');
            console.log(`${Dump.GetTimestamp()} :: ERROR!! ${(message ? '[ ' + message + ' ]' : '')}`);
            console.log(value);

            // なぜか、Firefoxで例外オブジェクトがシリアライズ出来ず、例外も出ない。
            //try {
            //    console.log(Dump.GetDumpedString(value));
            //} catch (e) {
            //    console.log(value);
            //}
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