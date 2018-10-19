/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Config.ts" />

namespace Fw.Util.Xhr {
    import Dump = Fw.Util.Dump;
    import Config = Fw.Config;

    export class Query {
        /**
         * async/await方式
         * @param params
         */
        public static async Invoke(params: Params): Promise<Result> {
            return new Promise<Result>((resolve: (value: Result) => void) => {

                // 数値になってしまう。
                //let methodToString: string = params.Method.toString().toUpperCase();

                let method: string;
                switch (params.Method) {
                    case MethodType.Get: method = 'GET'; break;
                    case MethodType.Post: method = 'POST'; break;
                    case MethodType.Put: method = 'PUT'; break;
                    case MethodType.Delete: method = 'DELETE'; break;
                    default: method = 'POST';
                }

                $.ajax({
                    url: Config.XhrBaseUrl + params.Url,
                    method: method,
                    data: params.Values || null,
                    cache: false,
                    dataType: 'json',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
                    }.bind(this),
                })
                .done(function (data, textStatus, jqXHR) {
                    try {
                        const casted = (data as Result);
                        resolve(casted);
                    } catch (e) {
                        const res = Result.CreateSucceeded(data);
                        resolve(res);
                    }
                }.bind(this))
                .fail(function (data, textStatus, errorThrown) {
                    const err = Result.CreateError([new Error('通信エラーが発生しました。') ]);
                    resolve(err);

                    Dump.Log('fail');
                    Dump.Log(data);
                });
            });
        }

        ///**
        // * コールバック方式
        // * @param params Params
        // * @deprecated そのうち削除する予定。
        // */
        //public static Invoke(params: Params): any {
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
        //        url: Config.XhrBaseUrl + params.Url,
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

        //        Dump.Log('fail');
        //        Dump.Log(data);
        //    });
        //}
    }

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
    //        url: Config.XhrBaseUrl + params.Url,
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
    //        Dump.Log('fail');
    //        Dump.Log(data);
    //    });
    //}
}