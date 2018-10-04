/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var XhrMethodType;
        (function (XhrMethodType) {
            XhrMethodType[XhrMethodType["Get"] = 1] = "Get";
            XhrMethodType[XhrMethodType["Post"] = 2] = "Post";
            XhrMethodType[XhrMethodType["Put"] = 3] = "Put";
            XhrMethodType[XhrMethodType["Delete"] = 4] = "Delete";
        })(XhrMethodType = Util.XhrMethodType || (Util.XhrMethodType = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=XhrMethodType.js.map