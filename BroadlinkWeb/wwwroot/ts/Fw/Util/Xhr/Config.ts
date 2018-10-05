/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />

namespace Fw.Util.Xhr {
    export class Config {

        // ↓App.Mainで書き換える。
        public static BaseUrl: string
            = location.protocol
            + '//' + location.hostname
            + ':' + location.port
            + '/';
    }
}