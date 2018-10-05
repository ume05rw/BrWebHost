/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

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
    Fw.Util.Xhr.Query.BaseUrl = proto + '//' + host + ':' + port + '/api/';
    App.Main.StartUp();
});
