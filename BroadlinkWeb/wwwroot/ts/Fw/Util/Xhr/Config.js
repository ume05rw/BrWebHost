/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            var Config = /** @class */ (function () {
                function Config() {
                }
                // ↓App.Mainで書き換える。
                Config.BaseUrl = location.protocol
                    + '//' + location.hostname
                    + ':' + location.port
                    + '/';
                return Config;
            }());
            Xhr.Config = Config;
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Config.js.map