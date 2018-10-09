/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="./Util/Dump.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;

    export class Startup {
        public static Init(): void {

            // ↓App.Mainで書き換える。
            Fw.Util.Xhr.Config.BaseUrl
                = location.protocol
                    + '//' + location.hostname
                    + ':' + location.port
                    + '/';
        }
    }
}