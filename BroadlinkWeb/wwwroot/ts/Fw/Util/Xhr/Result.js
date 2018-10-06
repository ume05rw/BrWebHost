/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            // まだ使わない。
            // API仕様が固まったら、やろうかな。
            var Result = /** @class */ (function () {
                function Result() {
                }
                return Result;
            }());
            Xhr.Result = Result;
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Result.js.map