/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var XhrParams = /** @class */ (function () {
            function XhrParams(url, method, values) {
                if (method === void 0) { method = null; }
                if (values === void 0) { values = null; }
                this.Method = Util.XhrMethodType.Post;
                this.Values = {};
                this.Callback = function () { };
                this.Url = url;
                this.Method = method || Util.XhrMethodType.Post;
                this.Values = values || {};
            }
            return XhrParams;
        }());
        Util.XhrParams = XhrParams;
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=XhrParams.js.map