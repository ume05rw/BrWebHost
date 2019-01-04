/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />

namespace App {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;

    export class Main {
        public static StartUp(): void {
            // フレームワーク初期化
            Fw.Startup.Init();

            // ログ出力をウインドウ表示するとき。
            //Fw.Util.Dump.LogMode = Fw.Util.LogMode.Window;

            // API仕様に応じて、クエリ先URLの土台を作っておく。
            const proto = location.protocol;
            const host = location.hostname;
            const port = location.port;
            Fw.Config.XhrBaseUrl = proto + '//' + host + ':' + port + '/api/';

            App.Items.Lang.InitLang();

            const main = new App.Controllers.MainController();
            Manager.Instance.SetController(main);

            Dump.Log('Show');
        }
    }
}

// アプリケーションを起動する。
// 以下にはこれ以上書かないこと。
$(function () {
    Fw.Util.Dump.Log('Start');
    App.Main.StartUp();
});
