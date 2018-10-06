/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            var Query = /** @class */ (function () {
                function Query() {
                }
                Query.Invoke = function (params) {
                    // 数値になってしまう。
                    //let methodToString: string = params.Method.toString().toUpperCase();
                    var method;
                    switch (params.Method) {
                        case Xhr.MethodType.Get:
                            method = 'GET';
                            break;
                        case Xhr.MethodType.Post:
                            method = 'POST';
                            break;
                        case Xhr.MethodType.Put:
                            method = 'PUT';
                            break;
                        case Xhr.MethodType.Delete:
                            method = 'DELETE';
                            break;
                        default: method = 'POST';
                    }
                    $.ajax({
                        url: Xhr.Config.BaseUrl + params.Url,
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
                return Query;
            }());
            Xhr.Query = Query;
            // functionのexportはやめ。
            // 全処理をclass記述で行うようにした。
            //export function Invoke(params: Params): any {
            //    // 数値になってしまう。
            //    //let methodToString: string = params.Method.toString().toUpperCase();
            //    let method: string;
            //    switch (params.Method) {
            //        case MethodType.Get: method = 'GET'; break;
            //        case MethodType.Post: method = 'POST'; break;
            //        case MethodType.Put: method = 'PUT'; break;
            //        case MethodType.Delete: method = 'DELETE'; break;
            //        default: method = 'POST';
            //    }
            //    $.ajax({
            //        url: Config.BaseUrl + params.Url,
            //        method: method,
            //        data: params.Values || null,
            //        cache: false,
            //        dataType: 'json',
            //        beforeSend: function (xhr) {
            //            xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
            //        }.bind(this),
            //    })
            //    .done(function (data, textStatus, jqXHR) {
            //        if (_.isFunction(params.Callback))
            //            params.Callback(data);
            //    }.bind(this))
            //    .fail(function (data, textStatus, errorThrown) {
            //        if (_.isFunction(params.Callback)) {
            //            params.Callback({
            //                succeeded: false,
            //                errors: [
            //                    {
            //                        name: '',
            //                        message: '通信エラーが発生しました。'
            //                    }
            //                ]
            //            });
            //        };
            //        console.log('fail');
            //        console.log(data);
            //    });
            //}
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=Query.js.map