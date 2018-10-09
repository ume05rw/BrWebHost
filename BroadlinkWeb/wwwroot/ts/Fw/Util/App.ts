/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />

namespace Fw.Util {
    import Dump = Fw.Util.Dump;

    export class App {
        private static _ids: Array<string> = new Array<string>();
        public static CreateId(): string {
            let id: string;
            for (; ;) {
                id = new Date().getTime().toString(16)
                    + Math.floor(Math.random() * 1000).toString(16);
                if (App._ids.indexOf(id) === -1)
                    break;
            }
            App._ids.push(id);
            return id;
        }
    }
}