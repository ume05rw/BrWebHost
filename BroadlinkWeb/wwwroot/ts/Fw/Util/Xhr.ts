/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
    export class Xhr {
        public static UrlBase: string = 'http://localhost/';

        public static Query(params: XhrParams): any {

            let method: string;
            switch (params.Method) {
                case XhrMethodType.Get: method = 'GET'; break;
                case XhrMethodType.Post: method = 'POST'; break;
                case XhrMethodType.Put: method = 'PUT'; break;
                case XhrMethodType.Delete: method = 'DELETE'; break;
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
                };

                console.log('fail');
                console.log(data);
            });
        }
    }
}