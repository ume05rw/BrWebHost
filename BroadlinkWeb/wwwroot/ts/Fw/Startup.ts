/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Util/Dump.ts" />
/* /// <reference path="Views/Root.ts" /> */

namespace Fw {
    import Dump = Fw.Util.Dump;

    export class Startup {
        public static Init(): void {

            // ↓API仕様に応じて、App.Mainで書き換える。
            Fw.Util.Xhr.Config.BaseUrl
                = location.protocol
                + '//' + location.hostname
                + ':' + location.port
                + '/';

            // 画面全体のコンテナを初期化
            Fw.Root.Init('div.body-content');

            // Controllers.Managerの初期化
            Fw.Controllers.Manager.Init();
        }
    }
}