/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Xhr/Config.ts" />
import Xhr = Fw.Util.Xhr;

namespace App {
    export class Main {
        public static StartUp(): void {
            var pager = new Fw.Controllers.Manager();
        }
    }
}

$(function () {
    let proto = location.protocol;
    let host = location.hostname;
    let port = location.port;
    Fw.Util.Xhr.Config.BaseUrl = proto + '//' + host + ':' + port + '/api/';
    App.Main.StartUp();
});
