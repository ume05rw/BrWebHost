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
    Fw.Util.Xhr.UrlBase = 'http://localhost:20776/api/';
    App.Main.StartUp();
});
