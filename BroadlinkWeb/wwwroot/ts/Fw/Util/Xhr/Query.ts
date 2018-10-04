/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />

namespace Fw.Util.Xhr {
    export class Query {
        // ↓App.Mainで書き換える。
        public static BaseUrl: string = 'http://localhost/';

        public static Invoke(params: Params): any {

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
                url: Query.BaseUrl + params.Url,
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
                };

                console.log('fail');
                console.log(data);
            });
        }
    }
}