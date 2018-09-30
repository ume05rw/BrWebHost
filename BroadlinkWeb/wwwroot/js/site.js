$(function () {
    $('button[name=Discover]').click(function () {
        //alert('hello!');

        console.log('query-1');

        query({
            url: "http://localhost:20776/api/BrDevices/Discover",
            method: 'GET',
            values: {},
            callback: function (res) {
                console.log('query-3');
                console.log(res);
            }
        });

        console.log('query-2');
    });

    var query = function (params) {
        params = params || {};

        $.ajax({
            url: params.url,
            method: params.method || 'POST',
            data: params.values || null,
            cache: false,
            dataType: 'json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
            }.bind(this),
        })
        .done(function (data, textStatus, jqXHR) {
            console.log(data);

            if (_.isFunction(params.callback))
                params.callback(data);
        }.bind(this))
        .fail(function (data, textStatus, errorThrown) {
            if (_.isFunction(params.callback)) {
                params.callback({
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
    };
});