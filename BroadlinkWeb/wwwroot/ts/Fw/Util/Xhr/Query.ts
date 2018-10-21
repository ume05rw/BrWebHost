/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Obj.ts" />
/// <reference path="../../Config.ts" />

namespace Fw.Util.Xhr {
    import Dump = Fw.Util.Dump;
    import Config = Fw.Config;
    import Obj = Fw.Util.Obj;

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

                const data = (params.Values)
                    ? Obj.FormatSilializable(params.Values)
                    : null;

                $.ajax({
                    url: Config.XhrBaseUrl + params.Url,
                    method: method,
                    data: JSON.stringify(data),
                    cache: false,

                    // リクエストのbodyフォーマットをJSONにする。
                    contentType: 'application/json',

                    // 応答をJSONとしてパースする。
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
    }
}
