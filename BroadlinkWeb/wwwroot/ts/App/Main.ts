/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />
/// <reference path="../Fw/Util/Xhr/Config.ts" />

namespace App {
    import Dump = Fw.Util.Dump;

    export class Main {
        // 一応、参照を保持しておく。
        public static _controllerManager: Fw.Controllers.Manager;

        public static StartUp(): void {
            let proto = location.protocol;
            let host = location.hostname;
            let port = location.port;
            Fw.Util.Xhr.Config.BaseUrl = proto + '//' + host + ':' + port + '/api/';

            // コントローラを起動。
            Main._controllerManager = new Fw.Controllers.Manager();
        }
    }
}

// アプリケーションを起動する。
// 以下にはこれ以上書かないこと。
$(function () {
    App.Main.StartUp();
});
