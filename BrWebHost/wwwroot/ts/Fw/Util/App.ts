/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />
/// <reference path="../ObjectBase.ts" />

namespace Fw.Util {
    import Dump = Fw.Util.Dump;
    import ObjectBase = Fw.ObjectBase;

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

        // 単純な待機
        public static async Wait(msec: number): Promise<boolean> {
            return new Promise<boolean>((resolve: (value: boolean) => void) => {
                setTimeout(() => {
                    resolve(true);
                }, msec);
            });
        }
    }
}
