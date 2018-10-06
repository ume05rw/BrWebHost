var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var App;
(function (App) {
    var Models;
    (function (Models) {
        var Control = /** @class */ (function () {
            function Control() {
            }
            return Control;
        }());
        Models.Control = Control;
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var App;
(function (App) {
    var Models;
    (function (Models) {
        var ControlSet = /** @class */ (function () {
            function ControlSet() {
            }
            return ControlSet;
        }());
        Models.ControlSet = ControlSet;
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            var Config = /** @class */ (function () {
                function Config() {
                }
                // ↓App.Mainで書き換える。
                Config.BaseUrl = location.protocol
                    + '//' + location.hostname
                    + ':' + location.port
                    + '/';
                return Config;
            }());
            Xhr.Config = Config;
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Xhr/Config.ts" />
var App;
(function (App) {
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.StartUp = function () {
            var proto = location.protocol;
            var host = location.hostname;
            var port = location.port;
            Fw.Util.Xhr.Config.BaseUrl = proto + '//' + host + ':' + port + '/api/';
            // コントローラを起動。
            Main._controllerManager = new Fw.Controllers.Manager();
        };
        return Main;
    }());
    App.Main = Main;
})(App || (App = {}));
// アプリケーションを起動する。
// 以下にはこれ以上書かないこと。
$(function () {
    App.Main.StartUp();
});
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var ControllerBase = /** @class */ (function () {
            function ControllerBase(jqueryElem, manager) {
                this.View = new Fw.Views.PageView(jqueryElem);
                this.Manager = manager;
                this.Id = this.View.Elem.data("controller");
                this.IsDefaultView = (this.View.Elem.data("default"));
                if (this.IsDefaultView)
                    this.View.Show();
            }
            return ControllerBase;
        }());
        Controllers.ControllerBase = ControllerBase;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var MainController = /** @class */ (function (_super) {
            __extends(MainController, _super);
            function MainController(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            MainController.prototype.Init = function () {
                var _this = this;
                this._btnGoSub1 = this.View.Elem.find('button[name=GoSub1]');
                this._btnGoSub2 = this.View.Elem.find('button[name=GoSub2]');
                this._btnGoSub1.click(function () {
                    // イベント通知でなく、参照保持でよいか？
                    _this.Manager.Show("Sub1");
                });
                this._btnGoSub2.click(function () {
                    // イベント通知でなく、参照保持でよいか？
                    _this.Manager.Show("Sub2");
                });
                this._centerControl = new Fw.Views.ControlView();
                this._centerControl.SetDisplayParams(0, 0, 100, 50, '1155FF');
                this._centerControl.Label = 'はろー<br/>どうよ？';
                this.View.Add(this._centerControl);
            };
            return MainController;
        }(Fw.Controllers.ControllerBase));
        Controllers.MainController = MainController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Xhr/Config.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Xhr = Fw.Util.Xhr;
        var Sub1Controller = /** @class */ (function (_super) {
            __extends(Sub1Controller, _super);
            function Sub1Controller(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            Sub1Controller.prototype.Init = function () {
                var _this = this;
                this._btnGoMain = this.View.Elem.find('button[name=GoMain]');
                this._btnDevices = this.View.Elem.find('button[name=Discover]');
                this._btnGoMain.click(function () {
                    _this.Manager.Show("Main");
                });
                this._btnDevices.click(function () {
                    console.log('btnDevices.click');
                    var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        console.log('Disover:');
                        console.log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
            };
            return Sub1Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub1Controller = Sub1Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Xhr = Fw.Util.Xhr;
        var Sub2Controller = /** @class */ (function (_super) {
            __extends(Sub2Controller, _super);
            function Sub2Controller(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            Sub2Controller.prototype.Init = function () {
                var _this = this;
                this._btnGoMain = this.View.Elem.find('button[name=GoMain]');
                this._btnA1Value = this.View.Elem.find('button[name=A1Value]');
                this._btnGoMain.click(function () {
                    _this.Manager.Show("Main");
                });
                this._btnA1Value.click(function () {
                    console.log('btnA1Value.click');
                    var params = new Xhr.Params('BrDevices/GetA1SensorValues', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        console.log('GetA1SensorValues:');
                        console.log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
            };
            return Sub2Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub2Controller = Sub2Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var App;
(function (App) {
    var View;
    (function (View) {
        var CenterLine = /** @class */ (function () {
            function CenterLine() {
            }
            return CenterLine;
        }());
        View.CenterLine = CenterLine;
    })(View = App.View || (App.View = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Factory = /** @class */ (function () {
            function Factory() {
            }
            // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
            Factory.Create = function (name, elem, manager) {
                var classObject = Function('return (App.Controllers.' + name + 'Controller)')();
                var instance = new classObject(elem, manager);
                return instance;
            };
            return Factory;
        }());
        Controllers.Factory = Factory;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Manager = /** @class */ (function () {
            function Manager() {
                var ctrs = [];
                $("div[data-controller]").each(function (i, el) {
                    var $elem = $(el);
                    var name = $elem.data('controller');
                    var instance = Controllers.Factory.Create(name, $elem, this);
                    ctrs.push(instance);
                }.bind(this));
                this._controllers = ctrs;
            }
            Manager.prototype.Show = function (id) {
                var target = _.find(this._controllers, function (c) {
                    return (c.Id === id);
                });
                if (!target)
                    throw new Error("id not found: " + id);
                _.each(this._controllers, function (c) {
                    if (c !== target && c.View.IsVisible())
                        c.View.Hide();
                });
                target.View.Show();
            };
            return Manager;
        }());
        Controllers.Manager = Manager;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
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
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            var MethodType;
            (function (MethodType) {
                MethodType[MethodType["Get"] = 1] = "Get";
                MethodType[MethodType["Post"] = 2] = "Post";
                MethodType[MethodType["Put"] = 3] = "Put";
                MethodType[MethodType["Delete"] = 4] = "Delete";
            })(MethodType = Xhr.MethodType || (Xhr.MethodType = {}));
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            var Params = /** @class */ (function () {
                function Params(url, method, values) {
                    if (method === void 0) { method = null; }
                    if (values === void 0) { values = null; }
                    this.Method = Xhr.MethodType.Post;
                    this.Values = {};
                    this.Callback = function () { };
                    this.Url = url;
                    this.Method = method || Xhr.MethodType.Post;
                    this.Values = values || {};
                }
                return Params;
            }());
            Xhr.Params = Params;
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
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
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Animation;
        (function (Animation) {
            var Animator = /** @class */ (function () {
                function Animator(view, toParams) {
                    this.FromParams = null;
                    this.ToParams = null;
                    this.OnComplete = null;
                    this._view = view;
                    this.ToParams = toParams;
                }
                Animator.prototype.Invoke = function (duration) {
                    var _this = this;
                    if (duration === void 0) { duration = 200; }
                    if (!duration)
                        duration = 200;
                    if (!this.FromParams)
                        this.FromParams = Animation.Params.GetCurrent(this._view);
                    var parent = $(this._view.Elem.parent());
                    var centerLeft = (parent.width() / 2);
                    var centerTop = (parent.height() / 2);
                    var dom = this._view.Elem.get(0);
                    var fromX = this._view.X + this.FromParams.X;
                    var fromY = this._view.Y + this.FromParams.Y;
                    var fromLeft = centerLeft + fromX - (this.FromParams.Width / 2);
                    var fromTop = centerTop + fromY - (this.FromParams.Height / 2);
                    var toX = this._view.X + this.ToParams.X;
                    var toY = this._view.Y + this.ToParams.Y;
                    var toLeft = centerLeft + toX - (this.ToParams.Width / 2);
                    var toTop = centerTop + toY - (this.ToParams.Height / 2);
                    //console.log({
                    //    name: 'center',
                    //    left: centerLeft,
                    //    top: centerTop
                    //});
                    //console.log({
                    //    name: 'from',
                    //    x: fromX,
                    //    y: fromY,
                    //    left: fromLeft,
                    //    top: fromTop,
                    //    width: this.FromParams.Width,
                    //    height: this.FromParams.Height
                    //});
                    //console.log({
                    //    name: 'to',
                    //    x: toX,
                    //    y: toY,
                    //    left: toLeft,
                    //    top: toTop,
                    //    width: this.ToParams.Width,
                    //    height: this.ToParams.Height
                    //});
                    // アニメーション開始時点の値をセット
                    dom.style.display = "block";
                    dom.style.position = "absolute";
                    dom.style.left = fromLeft + "px";
                    dom.style.top = fromTop + "px";
                    dom.style.width = this.FromParams.Width + "px";
                    dom.style.height = this.FromParams.Height + "px";
                    dom.style.opacity = "" + this.FromParams.Opacity;
                    // アニメーション終了時点の値をセット
                    this._view.Elem.animate({
                        'left': toLeft + "px",
                        'top': toTop + "px",
                        'width': this.ToParams.Width + "px",
                        'height': this.ToParams.Height + "px",
                        'opacity': this.ToParams.Opacity
                    }, {
                        'duration': duration,
                        'complete': function () {
                            if (_.isFunction(_this.OnComplete))
                                _this.OnComplete();
                        }
                    });
                };
                Animator.prototype.Dispose = function () {
                    this._view = null;
                    this.FromParams = null;
                    this.ToParams = null;
                    this.OnComplete = null;
                };
                return Animator;
            }());
            Animation.Animator = Animator;
        })(Animation = Views.Animation || (Views.Animation = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Animation;
        (function (Animation) {
            var Params = /** @class */ (function () {
                function Params() {
                    this.X = 0;
                    this.Y = 0;
                    this.Width = 0;
                    this.Height = 0;
                    this.Opacity = 1;
                }
                Params.GetCurrent = function (view) {
                    var result = new Params();
                    result.X = 0;
                    result.Y = 0;
                    result.Width = view.Elem.width();
                    result.Height = view.Elem.height();
                    result.Opacity = Number(view.Elem.get(0).style.opacity);
                    return result;
                };
                Params.GetResized = function (view, resizeRate) {
                    var result = new Params();
                    result.X = 0;
                    result.Y = 0;
                    result.Width = (view.Elem.width() * resizeRate);
                    result.Height = (view.Elem.height() * resizeRate);
                    result.Opacity = 0.0;
                    return result;
                };
                Params.GetSlided = function (view, xRate, yRate) {
                    if (xRate === void 0) { xRate = 0; }
                    if (yRate === void 0) { yRate = 0; }
                    var result = new Params();
                    var width = view.Elem.width();
                    var height = view.Elem.height();
                    result.X = (width * xRate);
                    result.Y = (height * yRate);
                    result.Width = width;
                    result.Height = height;
                    result.Opacity = 0.8;
                    return result;
                };
                return Params;
            }());
            Animation.Params = Params;
        })(Animation = Views.Animation || (Views.Animation = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Anim = Fw.Views.Animation;
        var ViewBase = /** @class */ (function () {
            function ViewBase(jqueryElem) {
                this.Children = new Array();
                this.Elem = jqueryElem;
                this.Dom = jqueryElem.get(0);
                this._width = this.Elem.width();
                this._height = this.Elem.height();
                this._x = 0;
                this._y = 0;
                this._color = '000000';
                this.Elem.addClass('IView');
            }
            Object.defineProperty(ViewBase.prototype, "X", {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    this._x = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Y", {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    this._y = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Width", {
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    this._width = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Height", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Heght", {
                set: function (value) {
                    this._height = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Color", {
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._color = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            ViewBase.prototype.Init = function () {
            };
            ViewBase.prototype.SetDisplayParams = function (x, y, width, height, color) {
                if (x != undefined && x != null)
                    this._x = x;
                if (y != undefined && y != null)
                    this._y = y;
                if (width != undefined && width != null)
                    this._width = width;
                if (height != undefined && height != null)
                    this._height = height;
                if (color != undefined && color != null)
                    this._color = color;
                this.Refresh();
            };
            ViewBase.prototype.Add = function (view) {
                if (this.Children.indexOf(view) == -1) {
                    this.Children.push(view);
                    this.Elem.append(view.Elem);
                    view.Refresh();
                }
            };
            ViewBase.prototype.Remove = function (view) {
                var index = this.Children.indexOf(view);
                if (index != -1) {
                    this.Children.splice(index, 1);
                    view.Elem.detach();
                }
            };
            ViewBase.prototype.Show = function (duration) {
                if (duration === void 0) { duration = 200; }
                if (this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.FromParams = Anim.Params.GetResized(this, 0.8);
                animator.FromParams.Opacity = 0;
                animator.Invoke(duration);
            };
            ViewBase.prototype.Hide = function (duration) {
                if (duration === void 0) { duration = 200; }
                if (!this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.ToParams = Anim.Params.GetResized(this, 0.8);
                animator.ToParams.Opacity = 0.0;
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.Invoke(duration);
            };
            ViewBase.prototype.IsVisible = function () {
                return this.Elem.is(':visible');
            };
            ViewBase.prototype.Refresh = function () {
                var _this = this;
                if (this._lastRefreshTimer != null) {
                    clearTimeout(this._lastRefreshTimer);
                    this._lastRefreshTimer = null;
                }
                this._lastRefreshTimer = setTimeout(function () {
                    _this.InnerRefresh();
                }, 10);
            };
            ViewBase.prototype.InnerRefresh = function () {
                var parent = $(this.Elem.parent());
                if (!parent)
                    return;
                var centerLeft = (parent.width() / 2);
                var centerTop = (parent.height() / 2);
                var elemLeft = centerLeft + this._x - (this.Width / 2);
                var elemTop = centerTop + this._y - (this.Height / 2);
                this.Dom.style.left = elemLeft + "px";
                this.Dom.style.top = elemTop + "px";
                this.Dom.style.width = this._width + "px";
                this.Dom.style.height = this._height + "px";
                this.Dom.style.color = "#" + this._color;
            };
            ViewBase.prototype.Dispose = function () {
                _.each(this.Children, function (view) {
                    view.Dispose();
                });
                this.Children = null;
                this.Elem.remove();
                this.Elem = null;
            };
            return ViewBase;
        }());
        Views.ViewBase = ViewBase;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var ControlView = /** @class */ (function (_super) {
            __extends(ControlView, _super);
            function ControlView() {
                var _this = _super.call(this, $('<div></div>')) || this;
                _this.Init();
                return _this;
            }
            Object.defineProperty(ControlView.prototype, "Label", {
                get: function () {
                    return this._label.html();
                },
                set: function (value) {
                    this._label.html(value);
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            ControlView.prototype.Init = function () {
                _super.prototype.Init.call(this);
                this.Elem.addClass('ControlView');
                this._label = $('<span></span>');
                this.Elem.append(this._label);
            };
            ControlView.prototype.InnerRefresh = function () {
                _super.prototype.InnerRefresh.call(this);
                var dom = this.Elem.get(0);
                dom.style.borderColor = "#" + this.Color;
            };
            return ControlView;
        }(Views.ViewBase));
        Views.ControlView = ControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Anim = Fw.Views.Animation;
        var PageView = /** @class */ (function (_super) {
            __extends(PageView, _super);
            function PageView(jqueryElem) {
                var _this = _super.call(this, jqueryElem) || this;
                if (PageView.RootElem === null) {
                    PageView.RootElem = jqueryElem.parent();
                    PageView.RefreshRoot();
                    $(window).resize(function () {
                        PageView.RefreshRoot();
                    });
                }
                return _this;
            }
            PageView.RefreshRoot = function () {
                if (PageView.RootElem === null)
                    return;
                PageView.RootWidth = PageView.RootElem.width();
                PageView.RootHeight = PageView.RootElem.height();
            };
            PageView.prototype.Show = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                //console.log(`PageView.Show: ${this.Elem.data('controller')}`);
                if (this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
                animator.FromParams.Opacity = 0.5;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = function () {
                    _this.Refresh();
                };
                animator.Invoke(duration);
            };
            PageView.prototype.Hide = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                //console.log(`PageView.Hide: ${this.Elem.data('controller')}`);
                if (!this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, -1, 0);
                animator.ToParams.Opacity = 0.5;
                animator.OnComplete = function () {
                    _this.Dom.style.display = "none";
                    _this.Refresh();
                };
                animator.Invoke(duration);
            };
            PageView.prototype.InnerRefresh = function () {
                this.Dom.style.left = "0px";
                this.Dom.style.top = "0px";
                this.Dom.style.width = "100%";
                this.Dom.style.height = "100%";
            };
            PageView.RootElem = null;
            PageView.RootWidth = -1;
            PageView.RootHeight = -1;
            return PageView;
        }(Views.ViewBase));
        Views.PageView = PageView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=tsout.js.map