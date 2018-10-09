/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />

namespace App {
    import Dump = Fw.Util.Dump;

    export class Main {
        public static StartUp(): void {
            // フレームワーク初期化
            Fw.Startup.Init();

            // API仕様に応じて、クエリ先URLの土台を作っておく。
            let proto = location.protocol;
            let host = location.hostname;
            let port = location.port;
            Fw.Config.XhrBaseUrl = proto + '//' + host + ':' + port + '/api/';
        }
    }
}

// アプリケーションを起動する。
// 以下にはこれ以上書かないこと。
$(function () {
    App.Main.StartUp();
});
