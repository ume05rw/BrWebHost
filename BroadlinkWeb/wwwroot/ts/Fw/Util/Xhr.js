/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr = /** @class */ (function () {
            function Xhr() {
            }
            Xhr.Query = function (params) {
                var method;
                switch (params.Method) {
                    case Util.XhrMethodType.Get:
                        method = 'GET';
                        break;
                    case Util.XhrMethodType.Post:
                        method = 'POST';
                        break;
                    case Util.XhrMethodType.Put:
                        method = 'PUT';
                        break;
                    case Util.XhrMethodType.Delete:
                        method = 'DELETE';
                        break;
                    default: method = 'POST';
                }
                $.ajax({
                    url: Xhr.UrlBase + params.Url,
                    method: method,
                    data: params.Values || null,
                    cache: false,
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
                    }.bind(this),
                })
                    .done(function (data, textStatus, jqXHR) {
                    if (_.isFunction(params.Callback))
                        params.Callback(data);
                }.bind(this))
                    .fail(function (data, textStatus, errorThrown) {
                    if (_.isFunction(params.Callback)) {
                        params.Callback({
                            succeeded: false,
                            errors: [
                                {
                                    name: '',
                                    message: '通信エラーが発生しました。'
                                }
                            ]
                        });
                    }
                    ;
                    console.log('fail');
                    console.log(data);
                });
            };
            Xhr.UrlBase = 'http://localhost/';
            return Xhr;
        }());
        Util.Xhr = Xhr;
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Xhr.js.map