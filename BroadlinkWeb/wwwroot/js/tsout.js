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
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Dump = /** @class */ (function () {
            function Dump() {
            }
            Dump.Log = function (value) {
                var dump = _.isObject(value)
                    ? '\n' + JSON.stringify(value, null, "\t")
                    : value;
                console.log(Dump.GetTimestamp() + " :: " + Dump.GetDumpedString(value));
            };
            Dump.ErrorLog = function (value, message) {
                console.log('');
                console.log('########################################');
                console.log('########################################');
                console.log(Dump.GetTimestamp() + " :: ERROR!! " + (message ? '[ ' + message + ' ]' : ''));
                console.log(Dump.GetDumpedString(value));
            };
            Dump.GetTimestamp = function () {
                var now = new Date();
                return ('0' + now.getHours()).slice(-2) + ":" + ('0' + now.getMinutes()).slice(-2) + ":" + ('0' + now.getSeconds()).slice(-2) + "." + ('000' + now.getMilliseconds()).slice(3);
            };
            Dump.GetDumpedString = function (value) {
                return _.isObject(value)
                    ? '\n' + JSON.stringify(value, null, "\t")
                    : String(value);
            };
            return Dump;
        }());
        Util.Dump = Dump;
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Util/Dump.ts" />
/* /// <reference path="Views/Root.ts" /> */
var Fw;
(function (Fw) {
    var Config = /** @class */ (function () {
        function Config() {
        }
        /**
         * @description Xhrクエリ時の基礎URL
         */
        Config.XhrBaseUrl = location.protocol
            + '//' + location.hostname
            + ':' + location.port
            + '/';
        /**
         * @description ページ用div.attr識別子
         */
        Config.PageIdAttribute = 'data-pageid';
        /**
         * @description 起動ページdiv.attr識別子
         * @see <div data-default="true"></div>
         */
        Config.DefaultPageAttribute = 'data-default';
        return Config;
    }());
    Fw.Config = Config;
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var ViewEventsClass = /** @class */ (function () {
            function ViewEventsClass() {
                this.Shown = 'Shown';
                this.Hidden = 'Hidden';
                this.Attached = 'Attached';
                this.Detached = 'Detached';
                this.SizeChanged = 'SizeChanged';
                this.PositionChanged = 'PositionChanged';
                this.AnchorChanged = 'AnchorChanged';
                this.Initialized = 'Initialized';
            }
            return ViewEventsClass;
        }());
        Events.ViewEventsClass = ViewEventsClass;
        Events.ViewEvents = new ViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Number = /** @class */ (function () {
            function Number() {
            }
            /**
             * @see ビルトインisNaNでは、isNaN(null) === true になってしまう。
             * @param value
             */
            Number.IsNaN = function (value) {
                return (value !== value);
            };
            return Number;
        }());
        Util.Number = Number;
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            var Events = Fw.Events.ViewEvents;
            var Number = Fw.Util.Number;
            var Anchor = /** @class */ (function () {
                function Anchor(view) {
                    if (view === void 0) { view = null; }
                    this._view = null;
                    this._isAnchoredTop = false;
                    this._marginTop = 0;
                    this._isAnchoredLeft = false;
                    this._marginLeft = 0;
                    this._isAnchoredRight = false;
                    this._marginRight = 0;
                    this._isAnchoredBottom = false;
                    this._marginBottom = 0;
                    this._view = view;
                }
                Object.defineProperty(Anchor.prototype, "IsAnchoredTop", {
                    get: function () {
                        return this._isAnchoredTop;
                    },
                    set: function (value) {
                        // null, undefinedは例外
                        if (value === undefined || value === null)
                            throw new Error("value type not allowed");
                        var changed = (this._isAnchoredTop !== value);
                        this._isAnchoredTop = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "MarginTop", {
                    get: function () {
                        return this._marginTop;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._marginTop !== value);
                        this._marginTop = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "IsAnchoredLeft", {
                    get: function () {
                        return this._isAnchoredLeft;
                    },
                    set: function (value) {
                        // null, undefinedは例外
                        if (value === undefined || value === null)
                            throw new Error("value type not allowed");
                        var changed = (this._isAnchoredLeft !== value);
                        this._isAnchoredLeft = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "MarginLeft", {
                    get: function () {
                        return this._marginLeft;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._marginLeft !== value);
                        this._marginLeft = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "IsAnchoredRight", {
                    get: function () {
                        return this._isAnchoredRight;
                    },
                    set: function (value) {
                        // null, undefinedは例外
                        if (value === undefined || value === null)
                            throw new Error("value type not allowed");
                        var changed = (this._isAnchoredRight !== value);
                        this._isAnchoredRight = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "MarginRight", {
                    get: function () {
                        return this._marginRight;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._marginRight !== value);
                        this._marginRight = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "IsAnchoredBottom", {
                    get: function () {
                        return this._isAnchoredBottom;
                    },
                    set: function (value) {
                        // null, undefinedは例外
                        if (value === undefined || value === null)
                            throw new Error("value type not allowed");
                        var changed = (this._isAnchoredBottom !== value);
                        this._isAnchoredBottom = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "MarginBottom", {
                    get: function () {
                        return this._marginBottom;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._marginBottom !== value);
                        this._marginBottom = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.AnchorChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Anchor.prototype.Dispose = function () {
                    this._view = null;
                    this._isAnchoredTop = null;
                    this._isAnchoredLeft = null;
                    this._isAnchoredRight = null;
                    this._isAnchoredBottom = null;
                    this._marginTop = null;
                    this._marginLeft = null;
                    this._marginRight = null;
                    this._marginBottom = null;
                };
                return Anchor;
            }());
            Property.Anchor = Anchor;
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../IObject.ts" />
/// <reference path="Property/Anchor.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Views/IView.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="IController.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Factory = /** @class */ (function () {
            function Factory() {
            }
            // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
            Factory.Create = function (name, elem, manager) {
                // 文字列からクラスを取得
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
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="Factory.ts" />
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Config = Fw.Config;
        var Manager = /** @class */ (function () {
            function Manager() {
                var ctrs = [];
                $("div[" + Config.PageIdAttribute + "]").each(function (i, el) {
                    var $elem = $(el);
                    var name = $elem.attr(Config.PageIdAttribute);
                    var instance = Controllers.Factory.Create(name, $elem, this);
                    ctrs.push(instance);
                }.bind(this));
                this._controllers = ctrs;
            }
            Object.defineProperty(Manager, "Instance", {
                get: function () {
                    if (!Manager._instance)
                        throw new Error('Manager.Init() has not been executed.');
                    return Manager._instance;
                },
                enumerable: true,
                configurable: true
            });
            Manager.Init = function () {
                Manager._instance = new Manager();
            };
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
            Manager._instance = null;
            return Manager;
        }());
        Controllers.Manager = Manager;
    })(Controllers = Fw.Controllers || (Fw.Controllers = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="IController.ts" />
/// <reference path="Manager.ts" />
/* /// <reference path="../Views/PageView.ts" /> */
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Config = Fw.Config;
        /**
         * @see コントローラはイベント等の実装が無いので、IObjectを実装しない。
         * */
        var ControllerBase = /** @class */ (function () {
            function ControllerBase(jqueryElem) {
                this.View = new Fw.Views.PageView(jqueryElem);
                this.Id = this.View.Elem.attr(Config.PageIdAttribute);
                this.IsDefaultView = (this.View.Elem.attr(Config.DefaultPageAttribute) === "true");
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
/// <reference path="ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var ControlViewEventsClass = /** @class */ (function (_super) {
            __extends(ControlViewEventsClass, _super);
            function ControlViewEventsClass() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.SingleClick = 'SingleClick';
                _this.LongClick = 'LongClick';
                return _this;
            }
            return ControlViewEventsClass;
        }(Events.ViewEventsClass));
        Events.ControlViewEventsClass = ControlViewEventsClass;
        Events.ControlViewEvents = new ControlViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var MainController = /** @class */ (function (_super) {
            __extends(MainController, _super);
            function MainController(elem) {
                var _this = _super.call(this, elem) || this;
                _this.Init();
                return _this;
            }
            MainController.prototype.Init = function () {
                var _this = this;
                var btnGoSub1 = new Fw.Views.ControlView();
                btnGoSub1.Label = 'Go Sub1';
                btnGoSub1.SetSize(80, 30);
                btnGoSub1.SetAnchor(null, 10, null, null);
                btnGoSub1.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub1");
                });
                this.View.Add(btnGoSub1);
                var btnGoSub2 = new Fw.Views.ControlView();
                btnGoSub2.Label = 'Go Sub2';
                btnGoSub2.SetSize(80, 30);
                btnGoSub2.Position.Y = 40;
                btnGoSub2.SetAnchor(null, 10, null, null);
                btnGoSub2.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub2");
                });
                this.View.Add(btnGoSub2);
                this._centerControl = new Fw.Views.ControlView();
                this._centerControl.SetPosition(0, 0);
                this._centerControl.SetSize(100, 50);
                this._centerControl.Color = '#1155FF';
                this._centerControl.Label = 'はろー<br/>どうよ？';
                this.View.Add(this._centerControl);
                var tmpCtl = new Fw.Views.ControlView();
                tmpCtl.SetPosition(-100, -100);
                tmpCtl.SetSize(200, 200);
                tmpCtl.Color = '#666666';
                tmpCtl.Label = 'くりっく';
                tmpCtl.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Dump.Log('LONG CLICK!!');
                    if (_this._centerControl.IsVisible()) {
                        Dump.Log('みえてんで！');
                        _this._centerControl.Hide();
                    }
                    else {
                        Dump.Log('みえへんで...？');
                        _this._centerControl.Show();
                    }
                });
                this.View.Add(tmpCtl);
                this.View.AddEventListener(Events.PageViewEvents.Shown, function () {
                    Dump.Log('MainView.Shown');
                });
                var ancCtl1 = new Fw.Views.ControlView();
                ancCtl1.Label = '右下';
                ancCtl1.SetSize(200, 50);
                ancCtl1.SetAnchor(null, null, 40, 5);
                this.View.Add(ancCtl1);
                var ancCtl2 = new Fw.Views.ControlView();
                ancCtl2.Label = '右上';
                ancCtl2.SetSize(200, 50);
                ancCtl2.SetAnchor(3, null, 3, null);
                this.View.Add(ancCtl2);
                var ancCtl3 = new Fw.Views.ControlView();
                ancCtl3.Label = '左下';
                ancCtl3.SetSize(300, 100);
                ancCtl3.SetAnchor(null, 3, null, 3);
                this.View.Add(ancCtl3);
                var img = new Fw.Views.ImageView();
                img.SetSize(100, 70);
                img.Source = 'images/icons/home.png';
                ancCtl3.Add(img);
                var ancCtl4 = new Fw.Views.ControlView();
                ancCtl4.Label = '左上';
                ancCtl4.SetSize(200, 50);
                ancCtl4.SetAnchor(60, 3, null, null);
                this.View.Add(ancCtl4);
                //const ancCtl5 = new Fw.Views.ControlView();
                //ancCtl5.Label = '左右';
                //ancCtl5.Size.Height = 50;
                //ancCtl5.SetAnchor(null, 150, 300, 100);
                //this.View.Add(ancCtl5);
                //const ancCtl6 = new Fw.Views.ControlView();
                //ancCtl6.Label = '上下';
                //ancCtl6.SetAnchor(200, null, null, 40);
                //ancCtl6.Size.Width = 30;
                //this.View.Add(ancCtl6);
            };
            return MainController;
        }(Fw.Controllers.ControllerBase));
        Controllers.MainController = MainController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Config.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            var Dump = Fw.Util.Dump;
            var Config = Fw.Config;
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
                        Dump.Log('fail');
                        Dump.Log(data);
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
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var Xhr = Fw.Util.Xhr; // <- モデルを実装後は削除する予定
        var Sub1Controller = /** @class */ (function (_super) {
            __extends(Sub1Controller, _super);
            function Sub1Controller(elem) {
                var _this = _super.call(this, elem) || this;
                _this.Init();
                return _this;
            }
            Sub1Controller.prototype.Init = function () {
                var header = new Fw.Views.ControlView();
                header.Label = 'ヘッダ';
                header.Size.Height = 50;
                header.SetAnchor(0, 0, 0, null);
                header.BackgroundColor = '#555555';
                header.Color = '#FFFFFF';
                header.HasBorder = false;
                header.BorderRadius = 0;
                this.View.Add(header);
                var back = new Fw.Views.ControlView();
                back.Size.Width = 40;
                back.Size.Height = 40;
                back.Label = '戻る';
                back.SetAnchor(null, null, 5, null);
                back.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Manager.Instance.Show("Main");
                });
                header.Add(back);
                var devices = new Fw.Views.ControlView();
                devices.SetPosition(0, -400);
                devices.SetSize(60, 60);
                devices.Color = '#8844FF';
                devices.Label = 'デバイス走査';
                devices.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        Dump.Log('Disover:');
                        Dump.Log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
                this.View.Add(devices);
                var slider = new Fw.Views.SlidablePanelControlView(Fw.Views.Direction.Horizontal);
                slider.SetSize(100, 50);
                slider.InnerPanelCount = 2.5;
                slider.SetAnchor(60, 20, null, null);
                this.View.Add(slider);
            };
            return Sub1Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub1Controller = Sub1Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Dump = Fw.Util.Dump;
        var Xhr = Fw.Util.Xhr;
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var Sub2Controller = /** @class */ (function (_super) {
            __extends(Sub2Controller, _super);
            function Sub2Controller(elem) {
                var _this = _super.call(this, elem) || this;
                _this.Init();
                return _this;
            }
            Sub2Controller.prototype.Init = function () {
                var btnGoMain = new Fw.Views.ControlView();
                btnGoMain.Label = 'Back Main';
                btnGoMain.SetSize(80, 30);
                btnGoMain.SetAnchor(30, 10, null, null);
                btnGoMain.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Main");
                });
                this.View.Add(btnGoMain);
                var btnA1Value = new Fw.Views.ControlView();
                btnA1Value.Label = 'A1 Value';
                btnA1Value.SetSize(80, 30);
                btnA1Value.SetAnchor(80, 10, null, null);
                btnA1Value.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Dump.Log('btnA1Value.click');
                    var params = new Xhr.Params('BrDevices/GetA1SensorValues', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        Dump.Log('GetA1SensorValues:');
                        Dump.Log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
                this.View.Add(btnA1Value);
                var btnMove = new Fw.Views.RelocatableControlView();
                btnMove.SetDisplayParams(60, 60, 0, -200, '#1188FF');
                btnMove.BackgroundColor = '#FF9900';
                btnMove.Label = '動く？';
                btnMove.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Dump.Log('btnMove.SingleClick');
                });
                this.View.Add(btnMove);
                var btnReset = new Fw.Views.ControlView();
                btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
                btnReset.SetAnchor(5, null, 5, null);
                btnReset.Label = 'リセット';
                btnReset.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Dump.Log('btnReset.SingleClick');
                    if (btnMove.IsRelocatable)
                        btnMove.SetRelocatable(false);
                });
                this.View.Add(btnReset);
            };
            return Sub2Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub2Controller = Sub2Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />
var App;
(function (App) {
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.StartUp = function () {
            // フレームワーク初期化
            Fw.Startup.Init();
            // API仕様に応じて、クエリ先URLの土台を作っておく。
            var proto = location.protocol;
            var host = location.hostname;
            var port = location.port;
            Fw.Config.XhrBaseUrl = proto + '//' + host + ':' + port + '/api/';
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
/// <reference path="../../Util/Dump.ts" />
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
/// <reference path="../../Util/Dump.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var Xhr;
        (function (Xhr) {
            // まだ使わない。
            // API仕様が固まったら、やろうかな。
            var Result = /** @class */ (function () {
                function Result(succeeded, values, errors) {
                    this.Succeeded = succeeded;
                    this.Values = values;
                    this.Errors = errors;
                }
                Result.CreateSucceeded = function (values) {
                    return new Result(true, values, {});
                };
                Result.CreateError = function (errors) {
                    return new Result(false, {}, errors);
                };
                return Result;
            }());
            Xhr.Result = Result;
        })(Xhr = Util.Xhr || (Util.Xhr = {}));
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/*/// <reference path="../IView.ts" />*/
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
                    result.Width = view.Size.Width;
                    result.Height = view.Size.Height;
                    result.Opacity = Number(view.Dom.style.opacity || 1);
                    return result;
                };
                Params.GetResized = function (view, resizeRate) {
                    var result = new Params();
                    result.X = 0;
                    result.Y = 0;
                    result.Width = (view.Size.Width * resizeRate);
                    result.Height = (view.Size.Height * resizeRate);
                    result.Opacity = 0.0;
                    return result;
                };
                Params.GetSlided = function (view, xRate, yRate) {
                    if (xRate === void 0) { xRate = 0; }
                    if (yRate === void 0) { yRate = 0; }
                    var result = new Params();
                    var width = view.Size.Width;
                    var height = view.Size.Height;
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
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="Params.ts" />
/*/// <reference path="../IView.ts" /> */
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
                    this.FromParams = Animation.Params.GetCurrent(view);
                    this.ToParams = (toParams)
                        ? toParams
                        : Animation.Params.GetCurrent(view);
                }
                Animator.prototype.Invoke = function (duration) {
                    var _this = this;
                    if (duration === void 0) { duration = 200; }
                    if (!duration)
                        duration = 200;
                    if (!this.FromParams)
                        this.FromParams = Animation.Params.GetCurrent(this._view);
                    var parent = $(this._view.Elem.parent());
                    var parentWidth = (this._view.Parent)
                        ? this._view.Parent.Size.Width
                        : parent.width();
                    var parentHeight = (this._view.Parent)
                        ? this._view.Parent.Size.Height
                        : parent.height();
                    var pHalfWidth = (parentWidth / 2);
                    var pHalfHeight = (parentHeight / 2);
                    var dom = this._view.Elem.get(0);
                    var fromX = this._view.Position.X + this.FromParams.X;
                    var fromY = this._view.Position.Y + this.FromParams.Y;
                    var fromLeft = pHalfWidth + fromX - (this.FromParams.Width / 2);
                    var fromTop = pHalfHeight + fromY - (this.FromParams.Height / 2);
                    var toX = this._view.Position.X + this.ToParams.X;
                    var toY = this._view.Position.Y + this.ToParams.Y;
                    var toLeft = pHalfWidth + toX - (this.ToParams.Width / 2);
                    var toTop = pHalfHeight + toY - (this.ToParams.Height / 2);
                    //Dump.Log({
                    //    name: 'center',
                    //    left: pHalfWidth,
                    //    top: pHalfHeight
                    //});
                    //Dump.Log({
                    //    name: 'from',
                    //    x: fromX,
                    //    y: fromY,
                    //    left: fromLeft,
                    //    top: fromTop,
                    //    width: this.FromParams.Width,
                    //    height: this.FromParams.Height
                    //});
                    //Dump.Log({
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
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Util/Dump.ts" />
var Fw;
(function (Fw) {
    var ObjectBase = /** @class */ (function () {
        function ObjectBase() {
            this._elem = $(this);
            this._suppressedEvents = new Array();
        }
        Object.defineProperty(ObjectBase.prototype, "Elem", {
            get: function () {
                return this._elem;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectBase.prototype, "ClassName", {
            get: function () {
                return this._className;
            },
            enumerable: true,
            configurable: true
        });
        ObjectBase.prototype.SetClassName = function (name) {
            this._className = name;
        };
        ObjectBase.prototype.SetElem = function (jqueryElem) {
            if (!jqueryElem)
                return;
            this._elem = jqueryElem;
        };
        ObjectBase.prototype.AddEventListener = function (name, handler) {
            this.Elem.on(name, handler);
        };
        ObjectBase.prototype.RemoveEventListener = function (name, handler) {
            this.Elem.off(name, handler);
        };
        ObjectBase.prototype.DispatchEvent = function (name) {
            if (this.IsSuppressedEvent(name))
                return;
            //Dump.Log(`${this.ClassName}.DispatchEvent: ${name}`);
            this.Elem.trigger(name);
        };
        ObjectBase.prototype.SuppressEvent = function (name) {
            if (this.IsSuppressedEvent(name))
                return;
            this._suppressedEvents.push(name);
        };
        ObjectBase.prototype.IsSuppressedEvent = function (name) {
            return (this._suppressedEvents.indexOf(name) !== -1);
        };
        ObjectBase.prototype.ResumeEvent = function (name) {
            if (!this.IsSuppressedEvent(name))
                return;
            var idx = this._suppressedEvents.indexOf(name);
            this._suppressedEvents.splice(idx, 1);
        };
        ObjectBase.prototype.Dispose = function () {
            this._elem.remove();
            this._elem = null;
            this._className = null;
            this._suppressedEvents = null;
        };
        return ObjectBase;
    }());
    Fw.ObjectBase = ObjectBase;
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            var Events = Fw.Events.ViewEvents;
            var Number = Fw.Util.Number;
            var Size = /** @class */ (function () {
                function Size(view) {
                    if (view === void 0) { view = null; }
                    this._view = null;
                    this._width = 0;
                    this._height = 0;
                    this._view = view;
                }
                Object.defineProperty(Size.prototype, "Width", {
                    get: function () {
                        return this._width;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._width !== value);
                        this._width = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.SizeChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Size.prototype, "Height", {
                    get: function () {
                        return this._height;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._height !== value);
                        this._height = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.SizeChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Size.prototype.Dispose = function () {
                    this._view = null;
                    this._width = null;
                    this._height = null;
                };
                return Size;
            }());
            Property.Size = Size;
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../ObjectBase.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Property = Fw.Views.Property;
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.ViewEvents;
        var ViewBase = /** @class */ (function (_super) {
            __extends(ViewBase, _super);
            function ViewBase(jqueryElem) {
                var _this = _super.call(this) || this;
                _this._initialized = false;
                // Properties
                _this._dom = null;
                _this._color = '#000000';
                _this._backgroundColor = '#FFFFFF';
                _this.SetElem(jqueryElem);
                _this._children = new Array();
                _this.Init();
                return _this;
            }
            Object.defineProperty(ViewBase.prototype, "Dom", {
                get: function () {
                    return this._dom;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            ;
            Object.defineProperty(ViewBase.prototype, "Children", {
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Size", {
                get: function () {
                    return this._size;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Position", {
                get: function () {
                    return this._position;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Anchor", {
                get: function () {
                    return this._anchor;
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
            Object.defineProperty(ViewBase.prototype, "BackgroundColor", {
                get: function () {
                    return this._backgroundColor;
                },
                set: function (value) {
                    this._backgroundColor = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            ViewBase.prototype.SetElem = function (jqueryElem) {
                if (!jqueryElem)
                    return;
                _super.prototype.SetElem.call(this, jqueryElem);
                this._dom = jqueryElem.get(0);
            };
            ViewBase.prototype.Init = function () {
                var _this = this;
                this.SetClassName('ViewBase');
                this.Elem.addClass('IView');
                this._size = new Property.Size(this);
                this._position = new Property.Position(this);
                this._anchor = new Property.Anchor(this);
                this._size.Width = this.Elem.width();
                this._size.Height = this.Elem.height();
                this.AddEventListener(Events.SizeChanged, function () {
                    _this.Refresh();
                });
                this.AddEventListener(Events.PositionChanged, function () {
                    _this.Refresh();
                });
                this.AddEventListener(Events.AnchorChanged, function () {
                    _this.Refresh();
                });
                this._color = '#000000';
                this.IsVisible()
                    ? this.DispatchEvent(Events.Shown)
                    : this.DispatchEvent(Events.Hidden);
                // 画面リサイズ時に再描画
                Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, function () {
                    _this.Refresh();
                });
            };
            ViewBase.prototype.SetParent = function (parent) {
                this._parent = parent;
            };
            ViewBase.prototype.SetSize = function (width, height) {
                this.Size.Width = width;
                this.Size.Height = height;
            };
            ViewBase.prototype.SetPosition = function (x, y) {
                this.Position.X = x;
                this.Position.Y = y;
            };
            ViewBase.prototype.SetAnchor = function (top, left, right, bottom) {
                if (_.isNumber(top)) {
                    this.Anchor.IsAnchoredTop = true;
                    this.Anchor.MarginTop = top;
                }
                else {
                    this.Anchor.IsAnchoredTop = false;
                    this.Anchor.MarginTop = null;
                }
                if (_.isNumber(left)) {
                    this.Anchor.IsAnchoredLeft = true;
                    this.Anchor.MarginLeft = left;
                }
                else {
                    this.Anchor.IsAnchoredLeft = false;
                    this.Anchor.MarginLeft = null;
                }
                if (_.isNumber(right)) {
                    this.Anchor.IsAnchoredRight = true;
                    this.Anchor.MarginRight = right;
                }
                else {
                    this.Anchor.IsAnchoredRight = false;
                    this.Anchor.MarginRight = null;
                }
                if (_.isNumber(bottom)) {
                    this.Anchor.IsAnchoredBottom = true;
                    this.Anchor.MarginBottom = bottom;
                }
                else {
                    this.Anchor.IsAnchoredBottom = false;
                    this.Anchor.MarginBottom = null;
                }
            };
            ViewBase.prototype.SetPositionByLeftTop = function (left, top) {
                var parent = $(this.Elem.parent());
                var parentWidth = (this.Parent)
                    ? this.Parent.Size.Width
                    : parent.width();
                var parentHeight = (this.Parent)
                    ? this.Parent.Size.Height
                    : parent.height();
                var pHalfLeft = (parentWidth / 2);
                var pHalfTop = (parentHeight / 2);
                var myHalfLeft = (this.Size.Width / 2);
                var myHalfTop = (this.Size.Height / 2);
                if (_.isNumber(left))
                    this.Position.X = myHalfLeft - pHalfLeft + left;
                if (_.isNumber(top))
                    this.Position.Y = myHalfTop - pHalfTop + top;
            };
            ViewBase.prototype.SetDisplayParams = function (width, height, x, y, color, backgroundColor) {
                if (x === void 0) { x = undefined; }
                if (y === void 0) { y = undefined; }
                if (color === void 0) { color = undefined; }
                if (backgroundColor === void 0) { backgroundColor = undefined; }
                if (width !== undefined)
                    this.Size.Width = width;
                if (height !== undefined)
                    this.Size.Height = height;
                if (x !== undefined)
                    this.Position.X = x;
                if (y !== undefined)
                    this.Position.Y = y;
                if (color !== undefined)
                    this.Color = color;
                if (backgroundColor !== undefined)
                    this.BackgroundColor = backgroundColor;
            };
            ViewBase.prototype.Add = function (view) {
                if (this.Children.indexOf(view) == -1) {
                    view.Parent = this;
                    this.Children.push(view);
                    this.Elem.append(view.Elem);
                    view.Refresh();
                    view.DispatchEvent(Events.Attached);
                }
            };
            ViewBase.prototype.Remove = function (view) {
                var index = this.Children.indexOf(view);
                if (index != -1) {
                    view.Parent = null;
                    this.Children.splice(index, 1);
                    view.Elem.detach();
                    view.DispatchEvent(Events.Detached);
                }
            };
            ViewBase.prototype.Show = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                if (this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetResized(this, 0.8);
                animator.FromParams.Opacity = 0;
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = function () {
                    _this.Dom.style.display = "block";
                    _this.Refresh();
                    _this.DispatchEvent(Events.Shown);
                };
                animator.Invoke(duration);
            };
            ViewBase.prototype.Hide = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                if (!this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetResized(this, 0.8);
                animator.ToParams.Opacity = 0.0;
                animator.OnComplete = function () {
                    _this.Dom.style.display = "none";
                    _this.Refresh();
                    _this.DispatchEvent(Events.Hidden);
                };
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
                    if (!this._lastRefreshedTime)
                        this._lastRefreshedTime = new Date();
                    var now = new Date();
                    var elapsed = (now.getTime() - this._lastRefreshedTime.getTime());
                    // 描画抑止中でも、300msに一度は描画する。
                    if (elapsed > 300) {
                        this.InnerRefresh();
                        return;
                    }
                }
                this._lastRefreshTimer = setTimeout(function () {
                    _this.InnerRefresh();
                }, 10);
            };
            ViewBase.prototype.InnerRefresh = function () {
                try {
                    //Dump.Log(`${this.ClassName}.InnerRefresh`);
                    var parent_1 = $(this.Elem.parent());
                    if (parent_1.length <= 0)
                        return;
                    // 最初の描画開始直前を初期化終了とする。
                    if (!this._initialized) {
                        this.DispatchEvent(Events.Initialized);
                        this._initialized = true;
                    }
                    this.SuppressEvent(Events.SizeChanged);
                    this.SuppressEvent(Events.PositionChanged);
                    var parentWidth = (this.Parent)
                        ? this.Parent.Size.Width
                        : parent_1.width();
                    var parentHeight = (this.Parent)
                        ? this.Parent.Size.Height
                        : parent_1.height();
                    var pHalfWidth = (parentWidth / 2);
                    var pHalfHeight = (parentHeight / 2);
                    if (this.Anchor.IsAnchoredLeft && this.Anchor.IsAnchoredRight) {
                        this.Size.Width = parentWidth - this.Anchor.MarginLeft - this.Anchor.MarginRight;
                        this.Position.X = this.Anchor.MarginLeft - pHalfWidth + (this.Size.Width / 2);
                    }
                    else {
                        this.Size.Width = _.isNumber(this.Size.Width)
                            ? this.Size.Width
                            : 30;
                        if (this.Anchor.IsAnchoredLeft) {
                            this.Position.X = this.Anchor.MarginLeft - pHalfWidth + (this.Size.Width / 2);
                        }
                        else if (this.Anchor.IsAnchoredRight) {
                            var left = parentWidth - this.Anchor.MarginRight - this.Size.Width;
                            this.Position.X = left - pHalfWidth + (this.Size.Width / 2);
                        }
                    }
                    if (this.Anchor.IsAnchoredTop && this.Anchor.IsAnchoredBottom) {
                        this.Size.Height = parentHeight - this.Anchor.MarginTop - this.Anchor.MarginBottom;
                        this.Position.Y = this.Anchor.MarginTop - pHalfHeight + (this.Size.Height / 2);
                    }
                    else {
                        this.Size.Height = _.isNumber(this.Size.Height)
                            ? this.Size.Height
                            : 30;
                        if (this.Anchor.IsAnchoredTop) {
                            this.Position.Y = this.Anchor.MarginTop - pHalfHeight + (this.Size.Height / 2);
                        }
                        else if (this.Anchor.IsAnchoredBottom) {
                            var top_1 = parentHeight - this.Anchor.MarginBottom - this.Size.Height;
                            this.Position.Y = top_1 - pHalfHeight + (this.Size.Height / 2);
                        }
                    }
                    var myHalfWidth = this.Size.Width / 2;
                    var myHalfHeight = this.Size.Height / 2;
                    var elemLeft = pHalfWidth - myHalfWidth + this.Position.X;
                    var elemTop = pHalfHeight - myHalfHeight + this.Position.Y;
                    //Dump.Log({
                    //    left: this.Position.Left,
                    //    pHalfWidth: pHalfWidth,
                    //    myHalfWidth: myHalfWidth,
                    //    positionX: this.Position.X,
                    //    elemLeft: elemLeft
                    //});
                    this.Dom.style.left = elemLeft + "px";
                    this.Dom.style.top = elemTop + "px";
                    this.Dom.style.width = this.Size.Width + "px";
                    this.Dom.style.height = this.Size.Height + "px";
                    this.Dom.style.color = "" + this._color;
                    this.Dom.style.backgroundColor = "" + this._backgroundColor;
                    this._lastRefreshedTime = new Date();
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeEvent(Events.SizeChanged);
                    this.ResumeEvent(Events.PositionChanged);
                }
            };
            ViewBase.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                _.each(this.Children, function (view) {
                    view.Dispose();
                });
                this._children = null;
                this._dom = null;
                this._size.Dispose();
                this._size = null;
                this._position.Dispose();
                this._position = null;
                this._anchor.Dispose();
                this._anchor = null;
                this._color = null;
                this._backgroundColor = null;
            };
            return ViewBase;
        }(Fw.ObjectBase));
        Views.ViewBase = ViewBase;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="./ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ControlViewEvents;
        var Number = Fw.Util.Number;
        var ControlView = /** @class */ (function (_super) {
            __extends(ControlView, _super);
            function ControlView() {
                var _this = _super.call(this, $('<a></a>')) || this;
                _this._tapEventTimer = null;
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
            Object.defineProperty(ControlView.prototype, "HasBorder", {
                get: function () {
                    return this._hasBorder;
                },
                set: function (value) {
                    this.Dom.style.borderWidth = (value)
                        ? '1px'
                        : '0';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ControlView.prototype, "BorderRadius", {
                get: function () {
                    return this._borderRadius;
                },
                set: function (value) {
                    if (Number.IsNaN(value) || value === null || value === undefined)
                        value = 0;
                    if (value < 0)
                        value = 0;
                    if (value > 50)
                        value = 50;
                    this._borderRadius = value;
                    this.Dom.style.borderRadius = this._borderRadius + "%";
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @description Initialize
             */
            ControlView.prototype.Init = function () {
                var _this = this;
                _super.prototype.Init.call(this);
                this.SetClassName('ControlView');
                this.Elem.addClass(this.ClassName);
                // プロパティsetterを一度通しておく。
                this.HasBorder = true;
                this.BorderRadius = 5;
                this._label = $('<span class="ControlViewProperty"></span>');
                this.Elem.append(this._label);
                this.Elem.on('touchstart mousedown', function (e) {
                    if (_this._tapEventTimer != null)
                        clearTimeout(_this._tapEventTimer);
                    _this._tapEventTimer = setTimeout(function () {
                        // ロングタップイベント
                        _this._tapEventTimer = null;
                        //Dump.Log('longtapped');
                        _this.DispatchEvent(Events.LongClick);
                    }, 1000);
                    e.preventDefault();
                });
                this.Elem.on('touchend mouseup', function (e) {
                    if (_this._tapEventTimer != null) {
                        // ロングタップ検出中のとき
                        clearTimeout(_this._tapEventTimer);
                        _this._tapEventTimer = null;
                        // 以降、シングルタップイベント処理
                        //Dump.Log('singletapped');
                        _this.DispatchEvent(Events.SingleClick);
                    }
                    else {
                    }
                    e.preventDefault();
                });
                this.Elem.on('mouseout', function (e) {
                    if (_this._tapEventTimer != null) {
                        // ロングタップ検出中のとき
                        clearTimeout(_this._tapEventTimer);
                        _this._tapEventTimer = null;
                        //Dump.Log('tap canceled');
                    }
                    e.preventDefault();
                });
            };
            ControlView.prototype.InnerRefresh = function () {
                _super.prototype.InnerRefresh.call(this);
                this.Dom.style.borderColor = "" + this.Color;
            };
            ControlView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._label = null;
                this._tapEventTimer = null;
                this._hasBorder = null;
                this._borderRadius = null;
            };
            return ControlView;
        }(Views.ViewBase));
        Views.ControlView = ControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./Dump.ts" />
var Fw;
(function (Fw) {
    var Util;
    (function (Util) {
        var App = /** @class */ (function () {
            function App() {
            }
            App.CreateId = function () {
                var id;
                for (;;) {
                    id = new Date().getTime().toString(16)
                        + Math.floor(Math.random() * 1000).toString(16);
                    if (App._ids.indexOf(id) === -1)
                        break;
                }
                App._ids.push(id);
                return id;
            };
            App._ids = new Array();
            return App;
        }());
        Util.App = App;
    })(Util = Fw.Util || (Fw.Util = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/App.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.ViewEvents;
        var App = Fw.Util.App;
        var Config = Fw.Config;
        var PageView = /** @class */ (function (_super) {
            __extends(PageView, _super);
            function PageView(jqueryElem) {
                return _super.call(this, jqueryElem) || this;
            }
            Object.defineProperty(PageView.prototype, "Id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            PageView.prototype.Init = function () {
                _super.prototype.Init.call(this);
                this.SetClassName('PageView');
                if (this.Dom) {
                    this._id = this.Elem.data('');
                }
                else {
                    this._id = App.CreateId();
                    var elem = $("<div class=\"IController\" " + Config.PageIdAttribute + "=\"" + this._id + "\"></div>");
                    Fw.Root.Instance.Elem.append(elem);
                    this.SetElem(elem);
                }
                this.Elem.addClass(this.ClassName);
            };
            PageView.prototype.Show = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                //Dump.Log(`PageView.Show: ${this.Elem.data('controller')}`);
                if (this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
                animator.FromParams.Opacity = 0.5;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = function () {
                    _this.Dom.style.display = "block";
                    _this.Refresh();
                    _this.DispatchEvent(Events.Shown);
                };
                animator.Invoke(duration);
            };
            PageView.prototype.Hide = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                //Dump.Log(`PageView.Hide: ${this.Elem.data('controller')}`);
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
                    _this.DispatchEvent(Events.Hidden);
                };
                animator.Invoke(duration);
            };
            PageView.prototype.InnerRefresh = function () {
                this.Dom.style.left = "0px";
                this.Dom.style.top = "0px";
                this.Dom.style.width = "100%";
                this.Dom.style.height = "100%";
            };
            PageView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._id = null;
            };
            return PageView;
        }(Views.ViewBase));
        Views.PageView = PageView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="ControlView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ControlViewEvents;
        var RelocatableControlView = /** @class */ (function (_super) {
            __extends(RelocatableControlView, _super);
            function RelocatableControlView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._isRelocatable = false;
                _this._isMouseMoveEventListened = false;
                _this._isDragging = false;
                _this._gridSize = 60;
                _this._delayedResumeMouseEventsTimer = null;
                return _this;
            }
            Object.defineProperty(RelocatableControlView.prototype, "IsRelocatable", {
                get: function () {
                    return this._isRelocatable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RelocatableControlView.prototype, "GridSize", {
                get: function () {
                    return this._gridSize;
                },
                set: function (value) {
                    this._gridSize = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            RelocatableControlView.prototype.Init = function () {
                var _this = this;
                _super.prototype.Init.call(this);
                this.SetClassName('RelocatableControlView');
                this.Elem.addClass(this.ClassName);
                this._shadow = $('<div class="IView ControlView Shadow"></div>');
                this.AddEventListener(Events.LongClick, function () {
                    if (!_this._isRelocatable)
                        _this.SetRelocatable(true);
                });
                this.Elem.on('touchstart mousedown', function (e) {
                    if (!_this._isRelocatable) {
                        _this._isDragging = false;
                    }
                    else {
                        _this._isDragging = true;
                        _this.Refresh();
                    }
                });
                // ↓mouseoutイベントは捕捉しない。途切れまくるので。
                this.Elem.on('touchend mouseup', function (e) {
                    if (!_this._isRelocatable) {
                        _this._isDragging = false;
                    }
                    else {
                        _this._isDragging = false;
                        _this.Position.X = Math.round(_this.Position.X / _this.GridSize) * _this.GridSize;
                        _this.Position.Y = Math.round(_this.Position.Y / _this.GridSize) * _this.GridSize;
                        _this.Refresh();
                    }
                });
                var onMouseMove = this.OnMouseMove.bind(this);
                this.AddEventListener(Events.Attached, function () {
                    var parent = $(_this.Elem.parent());
                    if (parent.length <= 0 || _this._isMouseMoveEventListened)
                        return;
                    parent.on('touchmove mousemove', onMouseMove);
                    _this._isMouseMoveEventListened = true;
                });
                this.AddEventListener(Events.Detached, function () {
                    var parent = $(_this.Elem.parent());
                    if (parent.length <= 0 || !_this._isMouseMoveEventListened)
                        return;
                    parent.off('touchmove mousemove', onMouseMove);
                    _this._isMouseMoveEventListened = false;
                });
            };
            RelocatableControlView.prototype.OnMouseMove = function (e) {
                if (this._isRelocatable && this._isDragging) {
                    var left = e.clientX - (this.Size.Width / 2);
                    var top_2 = e.clientY - (this.Size.Height / 2);
                    this.SetPositionByLeftTop(left, top_2);
                    // マウスボタン押下中のクリックイベント発火を抑止する。
                    if (!this.IsSuppressedEvent(Events.LongClick))
                        this.SuppressEvent(Events.LongClick);
                    if (!this.IsSuppressedEvent(Events.SingleClick))
                        this.SuppressEvent(Events.SingleClick);
                    this.DelayedResumeMouseEvents();
                }
            };
            RelocatableControlView.prototype.DelayedResumeMouseEvents = function () {
                var _this = this;
                if (this._delayedResumeMouseEventsTimer !== null) {
                    clearTimeout(this._delayedResumeMouseEventsTimer);
                    this._delayedResumeMouseEventsTimer = null;
                }
                this._delayedResumeMouseEventsTimer = setTimeout(function () {
                    //Dump.Log('ResumeMouseEvents');
                    if (_this.IsSuppressedEvent(Events.LongClick))
                        _this.ResumeEvent(Events.LongClick);
                    if (_this.IsSuppressedEvent(Events.SingleClick))
                        _this.ResumeEvent(Events.SingleClick);
                }, 100);
            };
            RelocatableControlView.prototype.SetRelocatable = function (relocatable) {
                if (this._isRelocatable) {
                    // 固定する。
                    this._isRelocatable = false;
                    this._shadow.detach();
                }
                else {
                    // 移動可能にする。
                    //this._beforeX = this.Position.X;
                    //this._beforeY = this.Position.Y;
                    this._isRelocatable = true;
                    this.Elem.parent().append(this._shadow);
                }
                this.Refresh();
            };
            RelocatableControlView.prototype.InnerRefresh = function () {
                var parent = $(this.Elem.parent());
                if (parent.length <= 0)
                    return;
                if (!this._isRelocatable) {
                    this.Position.X = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                    this.Position.Y = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
                }
                _super.prototype.InnerRefresh.call(this);
                var shadowDom = this._shadow.get(0);
                if (!this._isRelocatable) {
                    shadowDom.style.display = 'none';
                    this.Dom.style.opacity = '1.0';
                    return;
                }
                this.Dom.style.opacity = '0.7';
                if (this._isDragging) {
                    var parentWidth = (this.Parent)
                        ? this.Parent.Size.Width
                        : parent.width();
                    var parentHeight = (this.Parent)
                        ? this.Parent.Size.Height
                        : parent.height();
                    var centerLeft = (parentWidth / 2);
                    var centerTop = (parentHeight / 2);
                    var sX = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                    var sY = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
                    var sLeft = centerLeft + sX - (this.Size.Width / 2);
                    var sTop = centerTop + sY - (this.Size.Height / 2);
                    shadowDom.style.display = 'block';
                    shadowDom.style.left = sLeft + "px";
                    shadowDom.style.top = sTop + "px";
                    shadowDom.style.width = this.Size.Width + "px";
                    shadowDom.style.height = this.Size.Height + "px";
                    shadowDom.style.opacity = '0.4';
                    shadowDom.style.color = "" + this.Color;
                    shadowDom.style.borderColor = "" + this.Color;
                    shadowDom.style.borderStyle = 'dashed';
                    shadowDom.style.borderWidth = '2px';
                    shadowDom.style.backgroundColor = "" + this.BackgroundColor;
                }
                else {
                    shadowDom.style.display = 'none';
                }
            };
            RelocatableControlView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._isRelocatable = null;
                this._shadow.remove();
                this._shadow = null;
                this._isMouseMoveEventListened = null;
                this._isDragging = null;
                this._gridSize = null;
            };
            return RelocatableControlView;
        }(Views.ControlView));
        Views.RelocatableControlView = RelocatableControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var LabelView = /** @class */ (function (_super) {
            __extends(LabelView, _super);
            function LabelView() {
                return _super.call(this, $('<a></a>')) || this;
            }
            Object.defineProperty(LabelView.prototype, "Text", {
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
            LabelView.prototype.Init = function () {
                _super.prototype.Init.call(this);
                this.SetClassName('LabelView');
                this.Elem.addClass(this.ClassName);
                this._label = $('<span class="ImageViewProperty"></span>');
                this.Elem.append(this._label);
                this.Dom.style.borderWidth = '0';
                this.Dom.style.borderRadius = '0';
            };
            LabelView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._label.remove();
                this._label = null;
            };
            return LabelView;
        }(Views.ViewBase));
        Views.LabelView = LabelView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ControlView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var PanelControlView = /** @class */ (function (_super) {
            __extends(PanelControlView, _super);
            function PanelControlView() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PanelControlView.prototype.Init = function () {
                _super.prototype.Init.call(this);
                this.SetClassName('PanelView');
                this.Elem.addClass(this.ClassName);
                this.HasBorder = false;
                this.BorderRadius = 0;
            };
            return PanelControlView;
        }(Views.ControlView));
        Views.PanelControlView = PanelControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="PanelControlView.ts" />
/// <reference path="Property/Size.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Property = Fw.Views.Property;
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.ControlViewEvents;
        var Direction;
        (function (Direction) {
            Direction[Direction["Horizontal"] = 0] = "Horizontal";
            Direction[Direction["Vertical"] = 1] = "Vertical";
        })(Direction = Views.Direction || (Views.Direction = {}));
        var SlidablePanelControlView = /** @class */ (function (_super) {
            __extends(SlidablePanelControlView, _super);
            function SlidablePanelControlView(direction) {
                var _this = _super.call(this) || this;
                _this._innerBackgroundColor = '#F5F5F5';
                _this._innerPanelCount = 2;
                _this._isDragging = false;
                _this._mouseMoveSuppressor = false;
                _this._delayedResumeMouseEventsTimer = null;
                // nullやundefinedを入れさせない。
                _this.Direction = (direction === Direction.Horizontal)
                    ? Direction.Horizontal
                    : Direction.Vertical;
                return _this;
            }
            Object.defineProperty(SlidablePanelControlView.prototype, "InnerBackgroundColor", {
                get: function () {
                    return this._innerBackgroundColor;
                },
                set: function (value) {
                    this._innerBackgroundColor = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SlidablePanelControlView.prototype, "InnerPanelCount", {
                get: function () {
                    return this._innerPanelCount;
                },
                set: function (value) {
                    this._innerPanelCount = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            SlidablePanelControlView.prototype.Init = function () {
                var _this = this;
                _super.prototype.Init.call(this);
                this.SetClassName('SlidablePanelView');
                this.Elem.addClass(this.ClassName);
                this._dragStartMousePosition = new Property.Position();
                this._dragStartPanelPosition = new Property.Position();
                this.HasBorder = false;
                this.BorderRadius = 0;
                this._innerPanel = new Views.PanelControlView();
                this.Add(this._innerPanel);
                this.AddEventListener(Events.Initialized, function () {
                    _this.InitView();
                });
                this._innerPanel.Elem.addClass('SlidablePanelInnerView');
                this._innerPanel.Elem.on('touchstart mousedown', function (e) {
                    _this._isDragging = true;
                    _this._dragStartMousePosition.X = e.clientX;
                    _this._dragStartMousePosition.Y = e.clientY;
                    _this._dragStartPanelPosition.X = _this._innerPanel.Position.X;
                    _this._dragStartPanelPosition.Y = _this._innerPanel.Position.Y;
                });
                this._innerPanel.Elem.on('touchmove mousemove', function (e) {
                    if (!_this._isDragging && !_this._mouseMoveSuppressor)
                        return;
                    if (e.eventPhase !== 2)
                        return;
                    var addX = e.clientX - _this._dragStartMousePosition.X;
                    var addY = e.clientY - _this._dragStartMousePosition.Y;
                    if (_this.Direction === Direction.Horizontal) {
                        // 横方向
                        _this._innerPanel.Position.X = _this._dragStartPanelPosition.X + addX;
                    }
                    else {
                        // 縦方向
                        _this._innerPanel.Position.Y = _this._dragStartPanelPosition.Y + addY;
                    }
                    _this.Refresh();
                    // マウスボタン押下中のクリックイベント発火を抑止する。
                    if (!_this.IsSuppressedEvent(Events.LongClick))
                        _this.SuppressEvent(Events.LongClick);
                    if (!_this.IsSuppressedEvent(Events.SingleClick))
                        _this.SuppressEvent(Events.SingleClick);
                    _this.DelayedResumeMouseEvents();
                });
                this._innerPanel.Elem.on('touchend mouseup mouseout', function () {
                    _this._isDragging = false;
                    _.delay(function () {
                        _this.AdjustSlidePosition();
                    }, 200);
                });
            };
            SlidablePanelControlView.prototype.DelayedResumeMouseEvents = function () {
                var _this = this;
                if (this._delayedResumeMouseEventsTimer !== null) {
                    clearTimeout(this._delayedResumeMouseEventsTimer);
                    this._delayedResumeMouseEventsTimer = null;
                }
                this._delayedResumeMouseEventsTimer = setTimeout(function () {
                    //Dump.Log('ResumeMouseEvents');
                    if (_this.IsSuppressedEvent(Events.LongClick))
                        _this.ResumeEvent(Events.LongClick);
                    if (_this.IsSuppressedEvent(Events.SingleClick))
                        _this.ResumeEvent(Events.SingleClick);
                }, 100);
            };
            SlidablePanelControlView.prototype.InitView = function () {
                if (this.Direction === Direction.Horizontal) {
                    // 横方向
                    this.Dom.style.overflowX = 'scroll';
                    this.Dom.style.overflowY = 'hidden';
                    this._innerPanel.Size.Width = this.Size.Width * this.InnerPanelCount;
                    this._innerPanel.Size.Height = this.Size.Height;
                    this._innerPanel.Position.X = (this._innerPanel.Size.Width - this.Size.Width) / 2;
                    this._innerPanel.Position.Y = 0;
                }
                else {
                    // 縦方向
                    this.Dom.style.overflowY = 'scroll';
                    this.Dom.style.overflowX = 'hidden';
                    this._innerPanel.Size.Height = this.Size.Height * this.InnerPanelCount;
                    this._innerPanel.Size.Width = this.Size.Width;
                    this._innerPanel.Position.Y = (this._innerPanel.Size.Height - this.Size.Height) / 2;
                    this._innerPanel.Position.X = 0;
                }
            };
            SlidablePanelControlView.prototype.AdjustSlidePosition = function () {
                var _this = this;
                var unitWidth = this.Size.Width / 2;
                var unitHeight = this.Size.Height / 2;
                var maxLeft = 0;
                var maxTop = 0;
                var minLeft = this.Size.Width - this._innerPanel.Size.Width;
                var minTop = this.Size.Height - this._innerPanel.Size.Height;
                var left = this._innerPanel.Position.Left;
                var top = this._innerPanel.Position.Top;
                // 座標値がマイナスのため、floorでなくceilで切り捨てる。
                var toLeft = Math.ceil(left / unitWidth) * unitWidth;
                var toTop = Math.ceil(top / unitHeight) * unitHeight;
                if (toLeft < minLeft) {
                    toLeft = minLeft;
                }
                else if (maxLeft < toLeft) {
                    toLeft = maxLeft;
                }
                else {
                    var remainderLeft = Math.abs(left % unitWidth);
                    if (remainderLeft > (unitWidth / 2))
                        toLeft -= unitWidth;
                }
                if (toTop < minTop) {
                    toTop = minTop;
                }
                else if (maxTop < toTop) {
                    toTop = maxTop;
                }
                else {
                    var remainderTop = Math.abs(top % unitHeight);
                    if (remainderTop > (unitHeight / 2))
                        toTop -= unitHeight;
                }
                var animator = new Anim.Animator(this._innerPanel);
                if (this.Direction === Direction.Horizontal) {
                    animator.ToParams.X = (toLeft - left);
                }
                else {
                    animator.ToParams.Y = (toTop - top);
                }
                animator.OnComplete = function () {
                    if (_this.Direction === Direction.Horizontal) {
                        _this._innerPanel.SetPositionByLeftTop(toLeft, null);
                    }
                    else {
                        _this._innerPanel.SetPositionByLeftTop(null, toTop);
                    }
                    _this._mouseMoveSuppressor = false;
                };
                this._mouseMoveSuppressor = true;
                animator.Invoke(500);
            };
            SlidablePanelControlView.prototype.InnerRefresh = function () {
                try {
                    if (this.Direction === Direction.Horizontal) {
                        // 横方向
                        this.Dom.style.overflowX = 'scroll';
                        this.Dom.style.overflowY = 'hidden';
                        this._innerPanel.Size.Width = this.Size.Width * this.InnerPanelCount;
                        this._innerPanel.Size.Height = this.Size.Height;
                    }
                    else {
                        // 縦方向
                        this.Dom.style.overflowY = 'scroll';
                        this.Dom.style.overflowX = 'hidden';
                        this._innerPanel.Size.Height = this.Size.Height * this.InnerPanelCount;
                        this._innerPanel.Size.Width = this.Size.Width;
                    }
                    this._innerPanel.BackgroundColor = this._innerBackgroundColor;
                    _super.prototype.InnerRefresh.call(this);
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                }
            };
            SlidablePanelControlView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._innerBackgroundColor = null;
                this._innerPanelCount = null;
                this._innerPanel.Dispose();
                this._innerPanel = null;
                this._isDragging = null;
                this._mouseMoveSuppressor = null;
                this._dragStartMousePosition.Dispose();
                this._dragStartMousePosition = null;
                this._dragStartPanelPosition.Dispose();
                this._dragStartPanelPosition = null;
            };
            return SlidablePanelControlView;
        }(Views.PanelControlView));
        Views.SlidablePanelControlView = SlidablePanelControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            var Events = Fw.Events.ViewEvents;
            var Number = Fw.Util.Number;
            var Position = /** @class */ (function () {
                function Position(view) {
                    if (view === void 0) { view = null; }
                    this._view = null;
                    this._x = 0;
                    this._y = 0;
                    this._view = view;
                }
                Object.defineProperty(Position.prototype, "X", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._x !== value);
                        this._x = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = (this._y !== value);
                        this._y = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Left", {
                    get: function () {
                        if (!this._view)
                            return null;
                        var parent = $(this._view.Elem.parent());
                        var parentWidth = (this._view.Parent)
                            ? this._view.Parent.Size.Width
                            : parent.width();
                        var pHalfWidth = (parentWidth / 2);
                        var myHalfWidth = (this._view.Size.Width / 2);
                        return pHalfWidth - myHalfWidth + this._x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Top", {
                    get: function () {
                        if (!this._view)
                            return null;
                        var parent = $(this._view.Elem.parent());
                        var parentHeight = (this._view.Parent)
                            ? this._view.Parent.Size.Height
                            : parent.height();
                        var pHalfHeight = (parentHeight / 2);
                        var myHalfHeight = (this._view.Size.Height / 2);
                        return pHalfHeight - myHalfHeight + this._y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Position.prototype.Dispose = function () {
                    this._view = null;
                    this._x = null;
                    this._y = null;
                };
                return Position;
            }());
            Property.Position = Position;
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var ImageView = /** @class */ (function (_super) {
            __extends(ImageView, _super);
            function ImageView() {
                return _super.call(this, $('<a></a>')) || this;
            }
            Object.defineProperty(ImageView.prototype, "Source", {
                get: function () {
                    return this._image.attr('src');
                },
                set: function (value) {
                    this._image.attr('src', value);
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            ImageView.prototype.Init = function () {
                var _this = this;
                _super.prototype.Init.call(this);
                this.SetClassName('ImageView');
                this.Elem.addClass(this.ClassName);
                this.Dom.style.borderWidth = '0';
                this.Dom.style.borderRadius = '0';
                this._image = $('<img class="ImageViewProperty"></img>');
                this._image.on('load', function () {
                    Dump.Log('Image Loaded!!');
                    _this.Refresh();
                });
                this.Elem.append(this._image);
            };
            ImageView.prototype.InnerRefresh = function () {
                _super.prototype.InnerRefresh.call(this);
                var imgDom = this._image.get(0);
                var imgWidth = imgDom.naturalWidth;
                var imgHeight = imgDom.naturalHeight;
                Dump.Log({
                    event: this.ClassName + '.InnerRefresh',
                    imgWidth: imgWidth,
                    imgHeight: imgHeight,
                });
            };
            ImageView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._image.remove();
                this._image = null;
            };
            return ImageView;
        }(Views.ViewBase));
        Views.ImageView = ImageView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Util/Dump.ts" />
/* /// <reference path="Views/Root.ts" /> */
var Fw;
(function (Fw) {
    var Startup = /** @class */ (function () {
        function Startup() {
        }
        Startup.Init = function () {
            // ↓API仕様に応じて、App.Mainで書き換える。
            Fw.Config.XhrBaseUrl
                = location.protocol
                    + '//' + location.hostname
                    + ':' + location.port
                    + '/';
            // 画面全体のコンテナを初期化
            Fw.Root.Init('div.body-content');
            // Controllers.Managerの初期化
            Fw.Controllers.Manager.Init();
        };
        return Startup;
    }());
    Fw.Startup = Startup;
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var PageViewEventsClass = /** @class */ (function (_super) {
            __extends(PageViewEventsClass, _super);
            function PageViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PageViewEventsClass;
        }(Events.ViewEventsClass));
        Events.PageViewEventsClass = PageViewEventsClass;
        Events.PageViewEvents = new PageViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../IObject.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../ObjectBase.ts" />
/// <reference path="IModel.ts" />
var Fw;
(function (Fw) {
    var Models;
    (function (Models) {
        var ModelBase = /** @class */ (function (_super) {
            __extends(ModelBase, _super);
            function ModelBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ModelBase;
        }(Fw.ObjectBase));
        Models.ModelBase = ModelBase;
    })(Models = Fw.Models || (Fw.Models = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var RootEventsClass = /** @class */ (function () {
            function RootEventsClass() {
                this.Resized = 'Resized';
            }
            return RootEventsClass;
        }());
        Events.RootEventsClass = RootEventsClass;
        Events.RootEvents = new RootEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Events/RootEvents.ts" />
/// <reference path="Util/Dump.ts" />
/// <reference path="Views/Property/Size.ts" />
var Fw;
(function (Fw) {
    var Events = Fw.Events.RootEvents;
    var Property = Fw.Views.Property;
    var Root = /** @class */ (function (_super) {
        __extends(Root, _super);
        function Root(jqueryElem) {
            var _this = _super.call(this) || this;
            _this.SetElem(jqueryElem);
            _this.SetClassName('Root');
            _this._size = new Property.Size();
            _this._dom = jqueryElem.get(0);
            _this.Refresh();
            $(window).resize(function () {
                _this.Refresh();
                _this.DispatchEvent(Events.Resized);
            });
            return _this;
        }
        Object.defineProperty(Root, "Instance", {
            get: function () {
                if (!Root._instance)
                    throw new Error('Root.Init() has not been executed.');
                return Root._instance;
            },
            enumerable: true,
            configurable: true
        });
        Root.Init = function (selectorString) {
            Root._instance = new Root($(selectorString));
        };
        Object.defineProperty(Root.prototype, "Dom", {
            get: function () {
                return this._dom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Root.prototype, "Size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        Root.prototype.Refresh = function () {
            // this.Sizeのセッターが無いので、フィールドに直接書き込む。
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();
        };
        Root.prototype.Dispose = function () {
            _super.prototype.Dispose.call(this);
            this._dom = null;
            this._size.Dispose();
            this._size = null;
        };
        Root._instance = null;
        return Root;
    }(Fw.ObjectBase));
    Fw.Root = Root;
})(Fw || (Fw = {}));
//# sourceMappingURL=tsout.js.map