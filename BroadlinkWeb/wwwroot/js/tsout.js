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
                try {
                    console.log(Dump.GetTimestamp() + " :: " + Dump.GetDumpedString(value));
                }
                catch (e) {
                    // 引数の循環参照など
                    console.log(Dump.GetTimestamp() + " ::");
                    console.log(value);
                }
            };
            Dump.ErrorLog = function (value, message) {
                console.log('');
                console.log('########################################');
                console.log('########################################');
                console.log(Dump.GetTimestamp() + " :: ERROR!! " + (message ? '[ ' + message + ' ]' : ''));
                console.log(value);
                // なぜか、Firefoxで例外オブジェクトがシリアライズ出来ず、例外も出ない。
                //try {
                //    console.log(Dump.GetDumpedString(value));
                //} catch (e) {
                //    console.log(value);
                //}
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
                this.PositionPolicyChanged = 'PositionPolicyChanged';
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
                    this._hasAnchorX = false;
                    this._hasAnchorY = false;
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
                Object.defineProperty(Anchor.prototype, "HasAnchorX", {
                    get: function () {
                        return this._hasAnchorX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Anchor.prototype, "HasAnchorY", {
                    get: function () {
                        return this._hasAnchorY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Anchor.prototype.SetHasAnchor = function (hasAnchorX, hasAnchorY) {
                    this._hasAnchorX = hasAnchorX;
                    this._hasAnchorY = hasAnchorY;
                };
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
/*/// <reference path="IController.ts" />*/
var Fw;
(function (Fw) {
    var Controllers;
    (function (Controllers) {
        var Factory = /** @class */ (function () {
            function Factory() {
            }
            // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
            Factory.Create = function (id, elem) {
                // 文字列からクラスを取得
                var classObject = Function('return (App.Controllers.' + id + 'Controller)')();
                var instance = new classObject(id, elem);
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
                this._controllers = {};
                $("div[" + Config.PageIdAttribute + "]").each(function (i, el) {
                    var $elem = $(el);
                    var id = $elem.attr(Config.PageIdAttribute);
                    var instance = Controllers.Factory.Create(id, $elem);
                    this._controllers[id] = instance;
                }.bind(this));
            }
            Object.defineProperty(Manager, "Instance", {
                get: function () {
                    if (!Manager._instance) {
                        Manager.Init();
                    }
                    return Manager._instance;
                },
                enumerable: true,
                configurable: true
            });
            // TODO: ↓そのうち削除予定
            Manager.Init = function () {
                if (!Manager._instance)
                    Manager._instance = new Manager();
            };
            Manager.prototype.Add = function (controller) {
                if (this._controllers[controller.Id])
                    throw new Error("Id[" + controller.Id + "] already exists");
                this._controllers[controller.Id] = controller;
            };
            Manager.prototype.Show = function (id) {
                var target = this._controllers[id];
                if (!target)
                    throw new Error("id not found: " + id);
                _.each(this._controllers, function (c) {
                    if (c !== target && c.View.IsVisible)
                        c.View.Hide();
                });
                target.View.Show();
            };
            Manager.prototype.ShowOnce = function (controller) {
                _.each(this._controllers, function (c) {
                    c.View.Hide();
                });
                controller.View.Show();
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
            function ControllerBase(id, jqueryElem) {
                this.View = null;
                if (!id)
                    throw new Error('need Id');
                this.Id = id;
                if (jqueryElem) {
                    this.SetPageViewByJQuery(jqueryElem);
                }
                this._className = 'ControllerBase';
            }
            Object.defineProperty(ControllerBase.prototype, "ClassName", {
                get: function () {
                    return this._className;
                },
                enumerable: true,
                configurable: true
            });
            ControllerBase.prototype.SetClassName = function (name) {
                this._className = name;
            };
            ControllerBase.prototype.SetPageViewByJQuery = function (elem) {
                this.View = new Fw.Views.PageView(elem);
                this.IsDefaultView = (this.View.Elem.attr(Config.DefaultPageAttribute) === "true");
                if (this.IsDefaultView)
                    this.View.Show();
            };
            ControllerBase.prototype.Dispose = function () {
                this.View.Dispose();
                this.View = null;
                this.Id = null;
                this.IsDefaultView = null;
                this._className = null;
            };
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
        var BoxViewEventsClass = /** @class */ (function (_super) {
            __extends(BoxViewEventsClass, _super);
            function BoxViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return BoxViewEventsClass;
        }(Events.ViewEventsClass));
        Events.BoxViewEventsClass = BoxViewEventsClass;
        Events.BoxViewEvents = new BoxViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="BoxViewEvents.ts" />
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
        }(Events.BoxViewEventsClass));
        Events.ControlViewEventsClass = ControlViewEventsClass;
        Events.ControlViewEvents = new ControlViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            /**
             * @description background-size
             */
            var FitPolicy;
            (function (FitPolicy) {
                /**
                 * 自動(と、containの違いがいまいちわからん)
                 */
                FitPolicy["Auto"] = "auto";
                /**
                 * コンテンツを全て表示しきる、最大サイズ
                 */
                FitPolicy["Contain"] = "contain";
                /**
                 * 枠に合わせてコンテンツの上下をカットした最大サイズ
                 */
                FitPolicy["Cover"] = "cover";
            })(FitPolicy = Property.FitPolicy || (Property.FitPolicy = {}));
        })(Property = Views.Property || (Views.Property = {}));
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
/// <reference path="ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var PageViewEventsClass = /** @class */ (function (_super) {
            __extends(PageViewEventsClass, _super);
            function PageViewEventsClass() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.Dragging = 'Dragging';
                return _this;
            }
            return PageViewEventsClass;
        }(Events.ViewEventsClass));
        Events.PageViewEventsClass = PageViewEventsClass;
        Events.PageViewEvents = new PageViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
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
                    result.Opacity = Number(view.Opacity || 1);
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
                    var hasTransAnimation = this._view.HasTransAnimation();
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
                    if (hasTransAnimation)
                        this._view.SetTransAnimation(false);
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
                            if (hasTransAnimation)
                                _this._view.SetTransAnimation(true);
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
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var EventReference = /** @class */ (function () {
            function EventReference() {
            }
            return EventReference;
        }());
        Events.EventReference = EventReference;
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Events/EventReference.ts" />
/// <reference path="Util/Dump.ts" />
var Fw;
(function (Fw) {
    var EventReference = Fw.Events.EventReference;
    var ObjectBase = /** @class */ (function () {
        function ObjectBase() {
            this._elem = $(this);
            this._suppressedEvents = new Array();
            this._eventHandlers = new Array();
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
            if (this._elem)
                this._elem.remove();
            this._elem = jqueryElem;
        };
        ObjectBase.prototype.AddEventListener = function (name, handler, bindObject) {
            if (bindObject === void 0) { bindObject = null; }
            if (!bindObject)
                bindObject = this;
            var eRef = new EventReference();
            eRef.Name = name;
            eRef.Handler = handler;
            eRef.BindedHandler = handler.bind(bindObject);
            this._eventHandlers.push(eRef);
            this.Elem.on(name, eRef.BindedHandler);
        };
        ObjectBase.prototype.RemoveEventListener = function (name, handler) {
            var _this = this;
            if (handler) {
                var key_1;
                var eRef = _.find(this._eventHandlers, function (er, idx) {
                    key_1 = idx;
                    return (er.Name === name && er.Handler === handler);
                });
                if (!eRef) {
                    //throw new Error(`${this.ClassName}.${name} event not found.`);
                    return;
                }
                this.Elem.off(eRef.Name, eRef.BindedHandler);
                this._eventHandlers.splice(key_1, 1);
            }
            else {
                var eRefs_1 = new Array();
                _.each(this._eventHandlers, function (er) {
                    if (er.Name !== name)
                        return;
                    eRefs_1.push(er);
                });
                _.each(eRefs_1, function (er) {
                    _this.Elem.off(er.Name, er.BindedHandler);
                    var idx = _this._eventHandlers.indexOf(er);
                    _this._eventHandlers.splice(idx, 1);
                });
            }
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
            var _this = this;
            _.each(this._eventHandlers, function (eRef) {
                _this.RemoveEventListener(eRef.Name, eRef.Handler);
            });
            this._elem.remove();
            this._elem = null;
            this._className = null;
            this._suppressedEvents = null;
        };
        return ObjectBase;
    }());
    Fw.ObjectBase = ObjectBase;
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
                _this._isSuppressLayout = false;
                // Properties
                _this._dom = null;
                _this._zIndex = 0;
                _this._color = '#000000';
                _this._backgroundColor = '#FFFFFF';
                _this._opacity = 1.0;
                _this._isVisible = true;
                _this._isInitialized = false;
                _this._lastApplyTimer = null;
                _this._lastAppliedTime = null;
                _this._innerApplyCount = 0;
                _this._latestStyles = {};
                _this._newStyles = {};
                _this.SetElem(jqueryElem);
                _this._children = new Array();
                _this._size = new Property.Size(_this);
                _this._position = new Property.Position(_this);
                _this._anchor = new Property.Anchor(_this);
                _this.SetClassName('ViewBase');
                _this.Elem.addClass('IView TransAnimation');
                _this._page = null;
                _this._parent = null;
                _this._color = '#000000';
                _this._size.Width = _this.Elem.width();
                _this._size.Height = _this.Elem.height();
                _this.AddEventListener(Events.SizeChanged, function () {
                    _this.Refresh();
                });
                _this.AddEventListener(Events.PositionChanged, function () {
                    _this.Refresh();
                });
                _this.AddEventListener(Events.AnchorChanged, function () {
                    _this.Refresh();
                });
                _this.AddEventListener(Events.Attached, function () {
                    _this.InitPage();
                    _this.InitHasAnchor();
                });
                _this.AddEventListener(Events.Detached, function () {
                    _this._page = null;
                    _this.InitHasAnchor();
                });
                _this.AddEventListener(Events.Initialized, function () {
                    _this.InitPage();
                    _this.InitHasAnchor();
                });
                //this.IsVisible
                //    ? this.DispatchEvent(Events.Shown)
                //    : this.DispatchEvent(Events.Hidden);
                // 画面リサイズ時に再描画
                Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, function () {
                    _this.Refresh();
                });
                _.defer(function () {
                    // 初期化終了イベント
                    if (!_this._isInitialized) {
                        _this._isInitialized = true;
                        _this.DispatchEvent(Events.Initialized);
                        _this.Refresh();
                    }
                });
                return _this;
            }
            Object.defineProperty(ViewBase.prototype, "Dom", {
                get: function () {
                    return this._dom;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Page", {
                get: function () {
                    return this._page;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "Parent", {
                get: function () {
                    return this._parent;
                },
                set: function (value) {
                    this._parent = value;
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
            Object.defineProperty(ViewBase.prototype, "ZIndex", {
                get: function () {
                    return this._zIndex;
                },
                set: function (value) {
                    this._zIndex = value;
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
            Object.defineProperty(ViewBase.prototype, "Opacity", {
                get: function () {
                    return this._opacity;
                },
                set: function (value) {
                    this._opacity = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "IsVisible", {
                get: function () {
                    return this._isVisible;
                },
                set: function (value) {
                    this._isVisible = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "IsInitialized", {
                get: function () {
                    return this._isInitialized;
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
            ViewBase.prototype.InitPage = function () {
                var get = function (view) {
                    if (!view)
                        return null;
                    else if (view instanceof Views.PageView)
                        return view;
                    else
                        return get(view.Parent);
                };
                this._page = get(this);
            };
            ViewBase.prototype.SetParent = function (parent) {
                this._parent = parent;
            };
            ViewBase.prototype.SetSize = function (width, height) {
                this.Size.Width = width;
                this.Size.Height = height;
            };
            ViewBase.prototype.SetXY = function (x, y, updatePolicy) {
                if (updatePolicy === void 0) { updatePolicy = true; }
                if (updatePolicy)
                    this.Position.Policy = Property.PositionPolicy.Centering;
                this.Position.X = x;
                this.Position.Y = y;
            };
            ViewBase.prototype.SetLeftTop = function (left, top, updatePolicy) {
                if (updatePolicy === void 0) { updatePolicy = true; }
                if (updatePolicy)
                    this.Position.Policy = Property.PositionPolicy.LeftTop;
                this.Position.Left = left;
                this.Position.Top = top;
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
            ViewBase.prototype.SetTransAnimation = function (enable) {
                if (enable) {
                    // アニメーション有効化
                    if (!this.Elem.hasClass('TransAnimation'))
                        this.Elem.addClass('TransAnimation');
                    if (this.Elem.hasClass('NoTransAnimation'))
                        this.Elem.removeClass('NoTransAnimation');
                }
                else {
                    // アニメーション無効化
                    if (this.Elem.hasClass('TransAnimation'))
                        this.Elem.removeClass('TransAnimation');
                    if (!this.Elem.hasClass('NoTransAnimation'))
                        this.Elem.addClass('NoTransAnimation');
                }
            };
            ViewBase.prototype.HasTransAnimation = function () {
                return this.Elem.hasClass('TransAnimation');
            };
            ViewBase.prototype.InitHasAnchor = function () {
                var hasAnchorX = (this.Anchor.IsAnchoredLeft || this.Anchor.IsAnchoredRight);
                var hasAnchorY = (this.Anchor.IsAnchoredTop || this.Anchor.IsAnchoredBottom);
                var recAnchor = function (view) {
                    if (!view)
                        return;
                    if (!hasAnchorX) {
                        hasAnchorX = (view.Anchor.IsAnchoredLeft || view.Anchor.IsAnchoredRight);
                    }
                    if (!hasAnchorY) {
                        hasAnchorY = (view.Anchor.IsAnchoredTop || view.Anchor.IsAnchoredBottom);
                    }
                    recAnchor(view.Parent);
                };
                recAnchor(this.Parent);
                this.Anchor.SetHasAnchor(hasAnchorX, hasAnchorY);
            };
            ViewBase.prototype.Add = function (view) {
                if (this.Children.indexOf(view) == -1) {
                    view.SetParent(this);
                    this.Children.push(view);
                    this.Elem.append(view.Elem);
                    view.Refresh();
                    view.DispatchEvent(Events.Attached);
                }
            };
            ViewBase.prototype.Remove = function (view) {
                var index = this.Children.indexOf(view);
                if (index != -1) {
                    view.SetParent(null);
                    this.Children.splice(index, 1);
                    view.Elem.detach();
                    view.DispatchEvent(Events.Detached);
                }
            };
            ViewBase.prototype.Refresh = function () {
                var _this = this;
                //Dump.Log(`${this.ClassName}.Refresh`);
                if (this._isSuppressLayout || !this._isInitialized)
                    return;
                //Dump.Log(`${this.ClassName}.Refresh`);
                // 子ViewもRefreshさせる。
                _.each(this.Children, function (view) {
                    view.Refresh();
                });
                if (this._lastRefreshTimer != null) {
                    clearTimeout(this._lastRefreshTimer);
                    this._lastRefreshTimer = null;
                    if (!this._lastRefreshedTime)
                        this._lastRefreshedTime = new Date();
                    var now = new Date();
                    var elapsed = (now.getTime() - this._lastRefreshedTime.getTime());
                    // 描画抑止中でも、100msに一度は描画する。
                    if (elapsed > Fw.Root.Instance.ViewRefreshInterval) {
                        this.InnerRefresh();
                        return;
                    }
                }
                this._lastRefreshTimer = setTimeout(function () {
                    _this.InnerRefresh();
                }, 10);
            };
            ViewBase.prototype.InnerRefresh = function () {
                var _this = this;
                try {
                    //Dump.Log(`${this.ClassName}.InnerRefresh`);
                    var parent_1 = $(this.Elem.parent());
                    if (parent_1.length <= 0)
                        return;
                    if (!this._page && !(this instanceof Views.PageView))
                        this.InitPage();
                    this.SuppressEvent(Events.SizeChanged);
                    this.SuppressEvent(Events.PositionChanged);
                    this.SuppressLayout();
                    //// 最初の描画開始直前を初期化終了とする。
                    //if (!this._initialized) {
                    //    this.DispatchEvent(Events.Initialized);
                    //    this._initialized = true;
                    //}
                    var parentWidth = (this.Parent)
                        ? this.Parent.Size.Width
                        : parent_1.width();
                    var parentHeight = (this.Parent)
                        ? this.Parent.Size.Height
                        : parent_1.height();
                    var pHalfWidth = (parentWidth / 2);
                    var pHalfHeight = (parentHeight / 2);
                    //let isAnchoredX: boolean = false;
                    //let isAnchoredY: boolean = false;
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
                    if (this.Page) {
                        if (!this.Anchor.HasAnchorX)
                            elemLeft += this.Page.DraggedPosition.X;
                        if (!this.Anchor.HasAnchorY)
                            elemTop += this.Page.DraggedPosition.Y;
                    }
                    //Dump.Log({
                    //    left: this.Position.Left,
                    //    pHalfWidth: pHalfWidth,
                    //    myHalfWidth: myHalfWidth,
                    //    positionX: this.Position.X,
                    //    elemLeft: elemLeft
                    //});
                    this.SetStyles({
                        left: elemLeft + "px",
                        top: elemTop + "px",
                        width: this.Size.Width + "px",
                        height: this.Size.Height + "px",
                        zIndex: "" + this.ZIndex,
                        color: "" + this._color,
                        backgroundColor: "" + this._backgroundColor,
                        opacity: "" + this.Opacity,
                        display: (this._isVisible)
                            ? 'block'
                            : 'none'
                    });
                    _.defer(function () {
                        _this.ApplyStyles();
                    });
                    //this.Dom.style.left = `${elemLeft}px`;
                    //this.Dom.style.top = `${elemTop}px`;
                    //this.Dom.style.width = `${this.Size.Width}px`;
                    //this.Dom.style.height = `${this.Size.Height}px`;
                    //this.Dom.style.zIndex = `${this.ZIndex}`;
                    //this.Dom.style.color = `${this._color}`;
                    //this.Dom.style.backgroundColor = `${this._backgroundColor}`;
                    //this.Dom.style.opacity = `${this.Opacity}`;
                    //this.Dom.style.display = (this._isVisible)
                    //    ? 'block'
                    //    : 'none';
                    this._lastRefreshedTime = new Date();
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeEvent(Events.SizeChanged);
                    this.ResumeEvent(Events.PositionChanged);
                    this.ResumeLayout();
                }
            };
            ViewBase.prototype.SetStyle = function (name, value) {
                this._newStyles[name] = value;
            };
            ViewBase.prototype.SetStyles = function (styles) {
                _.extend(this._newStyles, styles);
            };
            ViewBase.prototype.ApplyStyles = function () {
                var _this = this;
                if (this._lastApplyTimer != null) {
                    clearTimeout(this._lastApplyTimer);
                    this._lastApplyTimer = null;
                    if (!this._lastAppliedTime)
                        this._lastAppliedTime = new Date();
                    var now = new Date();
                    var elapsed = (now.getTime() - this._lastAppliedTime.getTime());
                    // 描画抑止中でも、100msに一度はDom適用する。
                    if (elapsed > Fw.Root.Instance.ViewRefreshInterval) {
                        //Dump.Log(`${this.ClassName}.ApplyStyles: ${elapsed} > ${Root.Instance.ViewRefreshInterval}`);
                        this.InnerApplyStyles();
                        return;
                    }
                }
                this._lastApplyTimer = setTimeout(function () {
                    _this.InnerApplyStyles();
                }, 10);
            };
            ViewBase.prototype.InnerApplyStyles = function () {
                var _this = this;
                this._innerApplyCount++;
                this._lastAppliedTime = new Date();
                //Dump.Log(`${this.ClassName}.InnerApplyStyles: ${this._innerApplyCount}`);
                _.each(this._newStyles, function (v, k) {
                    if (_this._latestStyles[k] !== v) {
                        _this.Dom.style[k] = v;
                        _this._latestStyles[k] = v;
                    }
                });
                this._newStyles = {};
                Fw.Root.Instance.ReleasePageInitialize();
            };
            ViewBase.prototype.SuppressLayout = function () {
                this._isSuppressLayout = true;
            };
            ViewBase.prototype.IsSuppressedLayout = function () {
                return this._isSuppressLayout;
            };
            ViewBase.prototype.ResumeLayout = function () {
                this._isSuppressLayout = false;
            };
            ViewBase.prototype.Show = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                if (this.IsVisible) {
                    this.Refresh();
                    return;
                }
                if (duration <= 0) {
                    this.IsVisible = true;
                    this.DispatchEvent(Events.Shown);
                }
                else {
                    var animator = new Anim.Animator(this);
                    animator.FromParams = Anim.Params.GetResized(this, 0.8);
                    animator.FromParams.Opacity = 0;
                    animator.ToParams.Opacity = 1.0;
                    animator.OnComplete = function () {
                        _this.IsVisible = true;
                        _this.DispatchEvent(Events.Shown);
                    };
                    animator.Invoke(duration);
                }
            };
            ViewBase.prototype.Hide = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                if (!this.IsVisible) {
                    this.Refresh();
                    return;
                }
                if (duration <= 0) {
                    this.IsVisible = false;
                    this.DispatchEvent(Events.Hidden);
                }
                else {
                    var animator = new Anim.Animator(this);
                    animator.FromParams.Opacity = 1.0;
                    animator.ToParams = Anim.Params.GetResized(this, 0.8);
                    animator.ToParams.Opacity = 0.0;
                    animator.OnComplete = function () {
                        _this.IsVisible = false;
                        _this.DispatchEvent(Events.Hidden);
                    };
                    animator.Invoke(duration);
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
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/App.ts" />
/// <reference path="../Events/PageViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.PageViewEvents;
        var PageView = /** @class */ (function (_super) {
            __extends(PageView, _super);
            function PageView(jqueryElem) {
                var _this = _super.call(this, jqueryElem) || this;
                _this._isNeedDragX = false;
                _this._isNeedDragY = false;
                _this._isDragging = false;
                _this._isSuppressDrag = false;
                _this._isMasked = false;
                Fw.Root.Instance.StartPageInitialize();
                if (!_this.Dom) {
                    var elem = $("<div class=\"IController IView TransAnimation\"></div>");
                    Fw.Root.Instance.Elem.append(elem);
                    _this.SetElem(elem);
                }
                _this._minDragPosition = new Views.Property.Position();
                _this._maxDragPosition = new Views.Property.Position();
                _this._dragStartMousePosition = new Views.Property.Position();
                _this._dragStartViewPosition = new Views.Property.Position();
                _this._draggedPosition = new Views.Property.Position();
                _this._isMasked = false;
                _this._isNeedDragX = false;
                _this._isNeedDragY = false;
                _this._isDragging = false;
                _this._isSuppressDrag = false;
                _this.SetClassName('PageView');
                _this.Elem.addClass(_this.ClassName);
                _this.Size.Width = Fw.Root.Instance.Size.Width;
                _this.Size.Height = Fw.Root.Instance.Size.Height;
                _this.IsVisible = false;
                _this.Elem.on('touchstart mousedown', function (e) {
                    //Dump.Log(`${this.ClassName}.MouseDown`);
                    _this._isDragging = true;
                    _this._dragStartMousePosition.X = e.pageX;
                    _this._dragStartMousePosition.Y = e.pageY;
                    _this._dragStartViewPosition.X = _this._draggedPosition.X;
                    _this._dragStartViewPosition.Y = _this._draggedPosition.Y;
                    _this.DetectToNeedDrags();
                });
                _this.Elem.on('touchmove mousemove', function (e) {
                    //Dump.Log(`${this.ClassName}.MouseMove`);
                    if (!_this._isDragging || _this._isSuppressDrag)
                        return;
                    if (!_this._isNeedDragX && !_this._isNeedDragY)
                        return;
                    //Dump.Log({
                    //    pageX: e.pageX,
                    //    pageY: e.pageY,
                    //    screenX: e.screenX,
                    //    screenY: e.screenY,
                    //    clientX: e.clientX,
                    //    clientY: e.clientY,
                    //    offsetX: e.offsetX,
                    //    offsetY: e.offsetY
                    //});
                    var addX = e.pageX - _this._dragStartMousePosition.X;
                    var addY = e.pageY - _this._dragStartMousePosition.Y;
                    if (_this._isNeedDragX) {
                        _this._draggedPosition.X = _this._dragStartViewPosition.X + addX;
                        if (_this._draggedPosition.X < _this._minDragPosition.X)
                            _this._draggedPosition.X = _this._minDragPosition.X;
                        if (_this._maxDragPosition.X < _this._draggedPosition.X)
                            _this._draggedPosition.X = _this._maxDragPosition.X;
                    }
                    if (_this._isNeedDragY) {
                        _this._draggedPosition.Y = _this._dragStartViewPosition.Y + addY;
                        if (_this._draggedPosition.Y < _this._minDragPosition.Y)
                            _this._draggedPosition.Y = _this._minDragPosition.Y;
                        if (_this._maxDragPosition.Y < _this._draggedPosition.Y)
                            _this._draggedPosition.Y = _this._maxDragPosition.Y;
                    }
                    var dragEventMargin = 10;
                    if (Math.abs(_this._dragStartMousePosition.X - _this._draggedPosition.X) > dragEventMargin
                        || Math.abs(_this._dragStartMousePosition.Y - _this._draggedPosition.Y) > dragEventMargin) {
                        _this.DispatchEvent(Events.Dragging);
                    }
                    _this.Refresh();
                });
                _this.Elem.on('touchend mouseup mouseout', function (e) {
                    //Dump.Log(`${this.ClassName}.MouseUp`);
                    _this._isDragging = false;
                });
                // ブラウザのリサイズ時、ページ全体を再描画
                Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, function () {
                    //Dump.Log(`${this.ClassName}.Resized`);
                    _this.Size.Width = Fw.Root.Instance.Size.Width;
                    _this.Size.Height = Fw.Root.Instance.Size.Height;
                    _this.Refresh();
                });
                // マスクをクリックしたとき、戻る。
                Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.MaskClicked, function () {
                    if (_this._isMasked)
                        _this.UnMask();
                });
                return _this;
            }
            Object.defineProperty(PageView.prototype, "DraggedPosition", {
                get: function () {
                    return this._draggedPosition;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "IsMasked", {
                get: function () {
                    return this._isMasked;
                },
                enumerable: true,
                configurable: true
            });
            PageView.prototype.SuppressDragging = function () {
                this._isSuppressDrag = true;
            };
            PageView.prototype.IsSuppressDragging = function () {
                return this._isSuppressDrag;
            };
            PageView.prototype.ResumeDragging = function () {
                this._isSuppressDrag = false;
            };
            PageView.prototype.DetectToNeedDrags = function () {
                var phWidth = this.Size.Width / 2;
                var phHeight = this.Size.Height / 2;
                var minLeft = 0;
                var minTop = 0;
                var maxRight = 0;
                var maxBottom = 0;
                _.each(this.Children, function (view) {
                    var left = phWidth + view.Position.X - (view.Size.Width / 2);
                    var top = phHeight + view.Position.Y - (view.Size.Height / 2);
                    var right = phWidth + view.Position.X + (view.Size.Width / 2);
                    var bottom = phHeight + view.Position.Y + (view.Size.Height / 2);
                    if (left < minLeft)
                        minLeft = left;
                    if (top < minTop)
                        minTop = top;
                    if (maxRight < right)
                        maxRight = right;
                    if (maxBottom < bottom)
                        maxBottom = bottom;
                });
                this._isNeedDragX = (minLeft < 0 || this.Size.Width < maxRight);
                this._isNeedDragY = (minTop < 0 || this.Size.Height < maxBottom);
                var margin = 20;
                this._minDragPosition.X = (this.Size.Width < maxRight)
                    ? this.Size.Width - maxRight - margin
                    : 0;
                this._minDragPosition.Y = (this.Size.Height < maxBottom)
                    ? this.Size.Height - maxBottom - margin
                    : 0;
                this._maxDragPosition.X = (minLeft < 0)
                    ? (minLeft * -1) + margin
                    : 0;
                this._maxDragPosition.Y = (minTop < 0)
                    ? (minTop * -1) + margin
                    : 0;
                //Dump.Log({
                //    minLeft: minLeft,
                //    minTop: minTop,
                //    maxRight: maxRight,
                //    maxBottom: maxBottom,
                //    _isNeedDragX: this._isNeedDragX,
                //    _isNeedDragY: this._isNeedDragY,
                //    _minDragPositionX: this._minDragPosition.X,
                //    _minDragPositionY: this._minDragPosition.Y,
                //    _maxDragPositionX: this._maxDragPosition.X,
                //    _maxDragPositionY: this._maxDragPosition.Y,
                //});
            };
            PageView.prototype.Show = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                Dump.Log("PageView.Show: " + this.ClassName);
                if (this.IsVisible) {
                    this.Refresh();
                    return;
                }
                if (duration <= 0) {
                    this.IsVisible = true;
                    this.DispatchEvent(Events.Shown);
                }
                else {
                    var animator = new Anim.Animator(this);
                    animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
                    animator.FromParams.Opacity = 0.5;
                    animator.ToParams = Anim.Params.GetCurrent(this);
                    animator.ToParams.Opacity = 1.0;
                    animator.OnComplete = function () {
                        _this.IsVisible = true;
                        _.delay(function () {
                            _this.Refresh();
                        }, 50);
                        _this.DispatchEvent(Events.Shown);
                    };
                    animator.Invoke(duration);
                }
            };
            PageView.prototype.Hide = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                //Dump.Log(`PageView.Hide: ${this.Elem.data('controller')}`);
                if (!this.IsVisible) {
                    this.Refresh();
                    return;
                }
                if (duration <= 0) {
                    this.IsVisible = false;
                    this.DispatchEvent(Events.Hidden);
                }
                else {
                    var animator = new Anim.Animator(this);
                    animator.FromParams = Anim.Params.GetCurrent(this);
                    animator.FromParams.Opacity = 1.0;
                    animator.ToParams = Anim.Params.GetSlided(this, -1, 0);
                    animator.ToParams.Opacity = 0.5;
                    animator.OnComplete = function () {
                        _this.IsVisible = false;
                        _this.Refresh();
                        _this.DispatchEvent(Events.Hidden);
                    };
                    animator.Invoke(duration);
                }
            };
            PageView.prototype.Mask = function () {
                //Dump.Log(`${this.ClassName}.Mask`);
                this._isMasked = true;
                Fw.Root.Instance.Mask();
                //this.Dom.style.zIndex = '-1';
                this.SetStyle('zIndex', '-1');
                this.Refresh();
            };
            PageView.prototype.UnMask = function () {
                //Dump.Log(`${this.ClassName}.UnMask`);
                this._isMasked = false;
                Fw.Root.Instance.UnMask();
                //this.Dom.style.zIndex = '0';
                this.SetStyle('zIndex', '0');
                this.Refresh();
            };
            PageView.prototype.InnerRefresh = function () {
                var _this = this;
                try {
                    this.SuppressLayout();
                    // TODO: Anchor実装する。
                    // 親View(=Root)とPageは常に同サイズなので、X/YがそのままLeft/Topになる。
                    //this.Dom.style.left = `${this.Position.X}px`;
                    //this.Dom.style.top = `${this.Position.Y}px`;
                    //this.Dom.style.width = `100%`;
                    //this.Dom.style.height = `100%`;
                    //this.Dom.style.zIndex = `${this.ZIndex}`;
                    //this.Dom.style.color = `${this.Color}`;
                    //this.Dom.style.backgroundColor = `${this.BackgroundColor}`;
                    //this.Dom.style.display = (this.IsVisible)
                    //    ? 'block'
                    //    : 'none';
                    this.SetStyles({
                        left: this.Position.X + "px",
                        top: this.Position.Y + "px",
                        width: "100%",
                        height: "100%",
                        zIndex: "" + this.ZIndex,
                        color: "" + this.Color,
                        backgroundColor: "" + this.BackgroundColor,
                        display: (this.IsVisible) ? 'block' : 'none'
                    });
                    _.defer(function () {
                        _this.ApplyStyles();
                    });
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            PageView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._isNeedDragX = null;
                this._isNeedDragY = null;
                this._isDragging = null;
                this._isSuppressDrag = null;
                this._minDragPosition.Dispose();
                this._minDragPosition = null;
                this._maxDragPosition.Dispose();
                this._maxDragPosition = null;
                this._dragStartMousePosition.Dispose();
                this._dragStartMousePosition = null;
                this._dragStartViewPosition.Dispose();
                this._dragStartViewPosition = null;
                this._draggedPosition.Dispose();
                this._draggedPosition = null;
            };
            return PageView;
        }(Views.ViewBase));
        Views.PageView = PageView;
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
        var Dump = Fw.Util.Dump;
        var Number = Fw.Util.Number;
        var BoxView = /** @class */ (function (_super) {
            __extends(BoxView, _super);
            function BoxView() {
                var _this = _super.call(this, $('<div></div>')) || this;
                _this.SetClassName('BoxView');
                _this.Elem.addClass(_this.ClassName);
                _this.HasBorder = true;
                _this.BorderRadius = 0;
                return _this;
            }
            Object.defineProperty(BoxView.prototype, "HasBorder", {
                get: function () {
                    return this._hasBorder;
                },
                set: function (value) {
                    this._hasBorder = value;
                    //this.Dom.style.borderWidth = (value) ? '1px' : '0';
                    this.SetStyle('borderWidth', (value)
                        ? '1px'
                        : '0');
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BoxView.prototype, "BorderRadius", {
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
                    //this.Dom.style.borderRadius = `${this._borderRadius}%`;
                    this.SetStyle('borderRadius', this._borderRadius + "%");
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            BoxView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    _super.prototype.InnerRefresh.call(this);
                    //this.Dom.style.borderColor = `${this.Color}`;
                    this.SetStyle('borderColor', "" + this.Color);
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            BoxView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._hasBorder = null;
                this._borderRadius = null;
            };
            return BoxView;
        }(Views.ViewBase));
        Views.BoxView = BoxView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />
var App;
(function (App) {
    var Color = /** @class */ (function () {
        function Color() {
        }
        // ライトブラウン - 女っぽいからターゲット外
        //public static Main: string = '#FFFFFF';
        //public static MainBackground: string = '#D4B16A';
        //public static MainHover: string = '#D9BA7C';
        //public static HeaderButtonBackground = '#C79B41';
        //public static HeaderButtonHover = '#CDA555';
        Color.Transparent = 'transparent';
        Color.Main = '#000000';
        Color.MainBackground = '#f5f5f5';
        Color.MainHover = '#e0e0e0';
        Color.HeaderButtonBackground = '#ececec';
        Color.HeaderButtonHover = '#e0e0e0';
        Color.ReverseMain = '#FFFFFF';
        Color.ButtonColors = [
            '#fff796',
            '#9d9e9e',
            '#84bde8',
            '#81c03b',
            '#ccdc4b',
            '#fcc91f',
            '#F92068',
            '#6545C6',
            '#B5743B',
        ];
        return Color;
    }());
    App.Color = Color;
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/BoxView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_1) {
        var Controls;
        (function (Controls) {
            var Views = Fw.Views;
            var Property = Fw.Views.Property;
            var Color = App.Color;
            var HeaderBarView = /** @class */ (function (_super) {
                __extends(HeaderBarView, _super);
                function HeaderBarView() {
                    var _this = _super.call(this) || this;
                    _this._label = new Views.LabelView();
                    _this._btnLeft = new App.Views.Controls.ButtonView();
                    _this._btnRight = new App.Views.Controls.ButtonView();
                    _this.Size.Height = 50;
                    _this.SetAnchor(0, 0, 0, null);
                    _this.BackgroundColor = Color.MainBackground;
                    _this.HasBorder = false;
                    _this._label.FontSize = Property.FontSize.Large;
                    _this._label.Color = Color.Main;
                    _this.Add(_this._label);
                    _this._btnLeft.SetSize(40, 40);
                    _this._btnLeft.BackgroundColor = Color.HeaderButtonBackground;
                    _this._btnLeft.HoverColor = Color.HeaderButtonHover;
                    _this._btnLeft.Color = Color.Main;
                    _this._btnLeft.Text = '<<';
                    _this._btnLeft.SetAnchor(null, 5, null, null);
                    _this.Add(_this._btnLeft);
                    _this._btnRight.SetSize(40, 40);
                    _this._btnRight.BackgroundColor = Color.HeaderButtonBackground;
                    _this._btnRight.HoverColor = Color.HeaderButtonHover;
                    _this._btnRight.Color = Color.Main;
                    _this._btnRight.Text = '+';
                    _this._btnRight.SetAnchor(null, null, 5, null);
                    _this.Add(_this._btnRight);
                    _this.AddEventListener(Fw.Events.BoxViewEvents.Attached, function () {
                        _this.Refresh();
                    });
                    return _this;
                }
                Object.defineProperty(HeaderBarView.prototype, "Text", {
                    get: function () {
                        return this._label.Text;
                    },
                    set: function (value) {
                        this._label.Text = value;
                        this.Refresh();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HeaderBarView.prototype, "LeftButton", {
                    get: function () {
                        return this._btnLeft;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HeaderBarView.prototype, "RightButton", {
                    get: function () {
                        return this._btnRight;
                    },
                    enumerable: true,
                    configurable: true
                });
                HeaderBarView.prototype.Dispose = function () {
                    this.RemoveEventListener(Fw.Events.BoxViewEvents.Attached);
                    _super.prototype.Dispose.call(this);
                };
                return HeaderBarView;
            }(Fw.Views.BoxView));
            Controls.HeaderBarView = HeaderBarView;
        })(Controls = Views_1.Controls || (Views_1.Controls = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_2) {
        var Pages;
        (function (Pages) {
            var Views = Fw.Views;
            var Property = Fw.Views.Property;
            var Controls = App.Views.Controls;
            var MainPageView = /** @class */ (function (_super) {
                __extends(MainPageView, _super);
                function MainPageView() {
                    var _this = this;
                    var jqueryElem = $("");
                    _this = _super.call(this, jqueryElem) || this;
                    _this.HeaderBar = new Controls.HeaderBarView();
                    _this.BtnGoSub1 = new Controls.ButtonView();
                    _this.BtnGoSub2 = new Controls.ButtonView();
                    _this.BtnGoSub3 = new Controls.ButtonView();
                    _this.BtnGoDynamic = new Controls.ButtonView();
                    _this.SetClassName('MainPageView');
                    var background = new Views.ImageView();
                    background.SetAnchor(0, 0, 0, 0);
                    background.FitPolicy = Property.FitPolicy.Cover;
                    background.Src = 'images/Main/app_background.jpg';
                    _this.Add(background);
                    _this.HeaderBar.Text = 'Broadlink Web Host(仮題)';
                    _this.HeaderBar.LeftButton.Hide(0);
                    _this.HeaderBar.RightButton.Hide(0);
                    _this.Add(_this.HeaderBar);
                    var scenePanel = new Views.StuckerBoxView();
                    scenePanel.HasBorder = true;
                    scenePanel.BorderRadius = 0;
                    scenePanel.BackgroundColor = '#f2f2f2';
                    scenePanel.Color = App.Color.MainBackground;
                    scenePanel.SetAnchor(70, 10, 10, null);
                    scenePanel.Size.Height = 200;
                    scenePanel.ReferencePoint = Property.ReferencePoint.LeftTop;
                    _this.Add(scenePanel);
                    for (var i = 0; i < 5; i++) {
                        var btn = new Controls.SceneButtonView();
                        btn.Label.Text = "Scene " + (i + 1);
                        scenePanel.Add(btn);
                    }
                    var remConPanel = new Views.StuckerBoxView();
                    remConPanel.HasBorder = true;
                    remConPanel.BorderRadius = 0;
                    remConPanel.BackgroundColor = App.Color.Transparent;
                    remConPanel.Color = App.Color.MainBackground;
                    remConPanel.SetAnchor(280, 10, 10, 70);
                    //remConPanel.SetAnchor(280, 10, 10, 10);
                    remConPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
                    _this.Add(remConPanel);
                    for (var i = 0; i < 20; i++) {
                        var btn = new Controls.ControlSetButtonView();
                        var idx = i % App.Color.ButtonColors.length;
                        btn.Button.BackgroundColor = App.Color.ButtonColors[idx];
                        btn.Button.Color = App.Color.ReverseMain;
                        btn.Label.Text = "Control " + (i + 1);
                        //btn.Label.Color = Color.ReverseMain;
                        remConPanel.Add(btn);
                    }
                    var bottom = new Views.StuckerBoxView();
                    bottom.HasBorder = true;
                    bottom.BorderRadius = 0;
                    bottom.BackgroundColor = 'transparent';
                    bottom.Color = '#f5f5f5';
                    bottom.SetAnchor(null, 10, 10, 10);
                    bottom.ReferencePoint = Property.ReferencePoint.RightBottom;
                    bottom.Size.Height = 50;
                    _this.Add(bottom);
                    _this.BtnGoSub1.Text = 'Show Sub1';
                    _this.BtnGoSub1.SetSize(80, 30);
                    bottom.Add(_this.BtnGoSub1);
                    _this.BtnGoSub2.Text = 'Show Sub2';
                    _this.BtnGoSub2.SetSize(80, 30);
                    bottom.Add(_this.BtnGoSub2);
                    _this.BtnGoSub3.Text = 'Show Sub3';
                    _this.BtnGoSub3.SetSize(80, 30);
                    bottom.Add(_this.BtnGoSub3);
                    _this.BtnGoDynamic.Text = 'Layout';
                    _this.BtnGoDynamic.SetSize(80, 30);
                    bottom.Add(_this.BtnGoDynamic);
                    return _this;
                }
                return MainPageView;
            }(Fw.Views.PageView));
            Pages.MainPageView = MainPageView;
        })(Pages = Views_2.Pages || (Views_2.Pages = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var Pages = App.Views.Pages;
        var LayoutCheckController = /** @class */ (function (_super) {
            __extends(LayoutCheckController, _super);
            function LayoutCheckController(id) {
                var _this = _super.call(this, id) || this;
                _this.Init();
                return _this;
            }
            LayoutCheckController.prototype.Init = function () {
                var _this = this;
                this.SetClassName('LayoutCheckController');
                this.View = new Pages.LayoutCheckPageView();
                var page = this.View;
                page.BtnGoSub1.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub1");
                });
                page.BtnGoSub2.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub2");
                });
                page.TmpCtl.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Dump.Log(_this.ClassName + ".SingleClick1");
                    if (page.CenterControl.IsVisible) {
                        Dump.Log('みえてんで！');
                        page.CenterControl.Hide();
                    }
                    else {
                        Dump.Log('みえへんで...？');
                        page.CenterControl.Show();
                    }
                });
                this.View.AddEventListener(Events.PageViewEvents.Shown, function () {
                    Dump.Log(_this.ClassName + ".Shown");
                });
                page.AncCtl4.AddEventListener(Events.ButtonViewEvents.SingleClick, function () {
                    //Dump.Log(`${this.ClassName}.SingleClick2`);
                    page.IsMasked
                        ? page.UnMask()
                        : page.Mask();
                });
            };
            return LayoutCheckController;
        }(Fw.Controllers.ControllerBase));
        Controllers.LayoutCheckController = LayoutCheckController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var Pages = App.Views.Pages;
        var MainController = /** @class */ (function (_super) {
            __extends(MainController, _super);
            function MainController(id) {
                var _this = _super.call(this, id) || this;
                _this.Init();
                return _this;
            }
            MainController.prototype.Init = function () {
                this.SetClassName('MainController');
                var sub3Ctr = new Controllers.Sub3Controller('Sub3');
                Manager.Instance.Add(sub3Ctr);
                this.View = new Pages.MainPageView();
                var page = this.View;
                page.BtnGoSub1.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub1");
                });
                page.BtnGoSub2.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub2");
                });
                page.BtnGoSub3.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    Manager.Instance.Show("Sub3");
                });
                page.BtnGoDynamic.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    // イベント通知でなく、参照保持でよいか？
                    var ctr = new Controllers.LayoutCheckController('LayoutCheck');
                    Manager.Instance.ShowOnce(ctr);
                });
            };
            return MainController;
        }(Fw.Controllers.ControllerBase));
        Controllers.MainController = MainController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../IObject.ts" />
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../ObjectBase.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="IEntity.ts" />
var Fw;
(function (Fw) {
    var Models;
    (function (Models) {
        var Entities;
        (function (Entities) {
            var EntityBase = /** @class */ (function (_super) {
                __extends(EntityBase, _super);
                function EntityBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return EntityBase;
            }(Fw.ObjectBase));
            Entities.EntityBase = EntityBase;
        })(Entities = Models.Entities || (Models.Entities = {}));
    })(Models = Fw.Models || (Fw.Models = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Entities/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
var App;
(function (App) {
    var Models;
    (function (Models) {
        var Entities;
        (function (Entities) {
            var BrDevice = /** @class */ (function (_super) {
                __extends(BrDevice, _super);
                function BrDevice() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return BrDevice;
            }(Fw.Models.Entities.EntityBase));
            Entities.BrDevice = BrDevice;
        })(Entities = Models.Entities || (Models.Entities = {}));
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../IObject.ts" />
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../ObjectBase.ts" />
/// <reference path="IStore.ts" />
var Fw;
(function (Fw) {
    var Models;
    (function (Models) {
        var Stores;
        (function (Stores) {
            var StoreBase = /** @class */ (function (_super) {
                __extends(StoreBase, _super);
                function StoreBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return StoreBase;
            }(Fw.ObjectBase));
            Stores.StoreBase = StoreBase;
        })(Stores = Models.Stores || (Models.Stores = {}));
    })(Models = Fw.Models || (Fw.Models = {}));
})(Fw || (Fw = {}));
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
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/Stores/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/BrDevice.ts" />
var App;
(function (App) {
    var Models;
    (function (Models) {
        var Stores;
        (function (Stores) {
            var Dump = Fw.Util.Dump;
            var Xhr = Fw.Util.Xhr;
            var BrDeviceStore = /** @class */ (function (_super) {
                __extends(BrDeviceStore, _super);
                function BrDeviceStore() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BrDeviceStore.prototype.Discover = function (callback) {
                    var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        Dump.Log('Disover:');
                        var rows = [];
                        _.each(data, function (row) {
                            rows.push(row);
                        });
                        if (_.isFunction(callback))
                            callback(rows);
                    };
                    Xhr.Query.Invoke(params);
                };
                return BrDeviceStore;
            }(Fw.Models.Stores.StoreBase));
            Stores.BrDeviceStore = BrDeviceStore;
        })(Stores = Models.Stores || (Models.Stores = {}));
    })(Models = App.Models || (App.Models = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../Models/Entities/BrDevice.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var BrDeviceStore = App.Models.Stores.BrDeviceStore;
        var Sub1Controller = /** @class */ (function (_super) {
            __extends(Sub1Controller, _super);
            function Sub1Controller(id, jqueryElem) {
                var _this = _super.call(this, id, jqueryElem) || this;
                _this.Init();
                return _this;
            }
            Sub1Controller.prototype.Init = function () {
                var header = new App.Views.Controls.HeaderBarView();
                header.Text = 'ヘッダ';
                header.RightButton.Hide(0);
                header.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, function () {
                    Manager.Instance.Show("Main");
                });
                this.View.Add(header);
                var devices = new Fw.Views.ButtonView();
                devices.SetSize(80, 30);
                devices.SetLeftTop(10, 70);
                devices.Text = 'デバイス走査';
                devices.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    var store = new BrDeviceStore();
                    store.Discover(function (devices) {
                        _.each(devices, function (dev) {
                            Dump.Log({
                                Id: dev.Id,
                                Mac: dev.MacAddressString,
                                Ip: dev.IpAddressString,
                                Port: dev.Port,
                                DevType: dev.DeviceType,
                                DevTypeDetail: dev.DeviceTypeDetal,
                                IsActive: dev.IsActive
                            });
                        });
                    });
                });
                this.View.Add(devices);
                var slider = new Fw.Views.SlidableBoxView(Fw.Views.Property.Direction.Horizontal);
                slider.SetSize(400, 200);
                devices.SetLeftTop(10, 120);
                slider.InnerLength = 1000;
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
            function Sub2Controller(id, jqueryElem) {
                var _this = _super.call(this, id, jqueryElem) || this;
                _this.Init();
                return _this;
            }
            Sub2Controller.prototype.Init = function () {
                var header = new App.Views.Controls.HeaderBarView();
                header.Text = 'A1 Sensor';
                header.RightButton.Hide(0);
                header.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, function () {
                    Manager.Instance.Show("Main");
                });
                this.View.Add(header);
                var btnA1Value = new Fw.Views.ButtonView();
                btnA1Value.Text = 'A1 Value';
                btnA1Value.SetSize(80, 30);
                btnA1Value.SetLeftTop(10, 70);
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
                var btnMove = new Fw.Views.RelocatableButtonView();
                btnMove.SetSize(60, 60);
                btnMove.Color = '#1188FF';
                btnMove.BackgroundColor = '#FF9900';
                btnMove.SetLeftTop(10, 120);
                btnMove.Text = '動く？';
                btnMove.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Dump.Log('btnMove.SingleClick');
                });
                this.View.Add(btnMove);
                var btnReset = new Fw.Views.ButtonView();
                btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
                btnReset.SetAnchor(70, null, 5, null);
                btnReset.Text = 'リセット';
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
        var Events = Fw.Events;
        var Manager = Fw.Controllers.Manager;
        var Sub3Controller = /** @class */ (function (_super) {
            __extends(Sub3Controller, _super);
            function Sub3Controller(id) {
                var _this = _super.call(this, id) || this;
                _this.Init();
                return _this;
            }
            Sub3Controller.prototype.Init = function () {
                this.View = new App.Views.Pages.Sub3PageView();
                var page = this.View;
                page.HeaderBar.LeftButton.AddEventListener(Events.ControlViewEvents.SingleClick, function () {
                    Manager.Instance.Show("Main");
                });
            };
            return Sub3Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub3Controller = Sub3Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="./BoxView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ControlViewEvents;
        var ControlView = /** @class */ (function (_super) {
            __extends(ControlView, _super);
            function ControlView() {
                var _this = _super.call(this) || this;
                _this._tapEventTimer = null;
                _this._cvMouseSuppressor = false;
                _this._cvDelayedResumeEventsTimer = null;
                _this._label = $('<span class="ControlViewProperty"></span>');
                _this.SetClassName('ControlView');
                _this.Elem.addClass(_this.ClassName);
                // プロパティsetterを一度通しておく。
                _this.HasBorder = true;
                _this.BorderRadius = 5;
                _this.Elem.append(_this._label);
                _this.Elem.on('touchstart mousedown', function (e) {
                    if (_this._tapEventTimer != null)
                        clearTimeout(_this._tapEventTimer);
                    _this._tapEventTimer = setTimeout(function () {
                        // ロングタップイベント
                        _this._tapEventTimer = null;
                        // Pageのドラッグ処理中のとき、クリックイベントを抑制する。
                        if (_this._cvMouseSuppressor)
                            return;
                        //Dump.Log('longtapped');
                        _this.DispatchEvent(Events.LongClick);
                    }, 1000);
                });
                _this.Elem.on('touchend mouseup', function (e) {
                    if (_this._tapEventTimer != null) {
                        // ロングタップ検出中のとき
                        clearTimeout(_this._tapEventTimer);
                        _this._tapEventTimer = null;
                        // Pageのドラッグ処理中のとき、クリックイベントを抑制する。
                        if (_this._cvMouseSuppressor)
                            return;
                        // 以降、シングルタップイベント処理
                        //Dump.Log('singletapped');
                        _this.DispatchEvent(Events.SingleClick);
                    }
                    else {
                    }
                });
                _this.Elem.on('mouseout', function (e) {
                    if (_this._tapEventTimer != null) {
                        // ロングタップ検出中のとき
                        clearTimeout(_this._tapEventTimer);
                        _this._tapEventTimer = null;
                        //Dump.Log('tap canceled');
                    }
                });
                return _this;
            }
            Object.defineProperty(ControlView.prototype, "Text", {
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
            ControlView.prototype.InitPage = function () {
                if (this.Page) {
                    this.RemoveEventListener(Fw.Events.PageViewEvents.Dragging, this.OnPageDragging);
                }
                _super.prototype.InitPage.call(this);
                if (this.Page) {
                    this.AddEventListener(Fw.Events.PageViewEvents.Dragging, this.OnPageDragging);
                }
            };
            ControlView.prototype.OnPageDragging = function () {
                var _this = this;
                this._cvMouseSuppressor = true;
                if (this._cvDelayedResumeEventsTimer !== null) {
                    clearTimeout(this._cvDelayedResumeEventsTimer);
                    this._cvDelayedResumeEventsTimer = null;
                }
                this._cvDelayedResumeEventsTimer = setTimeout(function () {
                    //Dump.Log('ResumeMouseEvents');
                    _this._cvMouseSuppressor = false;
                }, 100);
            };
            ControlView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._label = null;
                this._tapEventTimer = null;
                this._cvMouseSuppressor = null;
                this._cvDelayedResumeEventsTimer = null;
            };
            return ControlView;
        }(Views.BoxView));
        Views.ControlView = ControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ControlView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var ButtonView = /** @class */ (function (_super) {
            __extends(ButtonView, _super);
            function ButtonView() {
                var _this = _super.call(this) || this;
                _this._imageView = new Views.ImageView();
                _this.SetClassName('ButtonView');
                _this.Elem.addClass(_this.ClassName);
                _this.BackgroundColor = '#add8e6';
                _this.HoverColor = '#6495ed';
                _this._imageView.Src = null;
                _this.Add(_this._imageView);
                _this.Elem.hover(function () {
                    //Dump.Log(`${this.ClassName}.hover: color = ${this.HoverColor}`);
                    _this.Dom.style.backgroundColor = _this.HoverColor;
                    //this.SetStyle('backgroundColor', this.HoverColor);
                    //this.Refresh();
                }, function () {
                    _this.Dom.style.backgroundColor = _this.BackgroundColor;
                    //this.SetStyle('backgroundColor', this.BackgroundColor);
                    //this.Refresh();
                });
                return _this;
            }
            Object.defineProperty(ButtonView.prototype, "ImageSrc", {
                get: function () {
                    return this._imageView.Src;
                },
                set: function (value) {
                    this._imageView.Src = value;
                },
                enumerable: true,
                configurable: true
            });
            ButtonView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    this._imageView.Size.Width = this.Size.Width;
                    this._imageView.Size.Height = this.Size.Height;
                    _super.prototype.InnerRefresh.call(this);
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            ButtonView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._imageView = null;
                this.HoverColor = null;
            };
            return ButtonView;
        }(Views.ControlView));
        Views.ButtonView = ButtonView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_3) {
        var Controls;
        (function (Controls) {
            var Color = App.Color;
            var ButtonView = /** @class */ (function (_super) {
                __extends(ButtonView, _super);
                function ButtonView() {
                    var _this = _super.call(this) || this;
                    _this.HasBorder = false;
                    _this.BackgroundColor = Color.MainBackground;
                    _this.HoverColor = Color.MainHover;
                    _this.Color = Color.Main;
                    return _this;
                }
                return ButtonView;
            }(Fw.Views.ButtonView));
            Controls.ButtonView = ButtonView;
        })(Controls = Views_3.Controls || (Views_3.Controls = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ControlView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_4) {
        var Controls;
        (function (Controls) {
            var Dump = Fw.Util.Dump;
            var Views = Fw.Views;
            var Property = Fw.Views.Property;
            var LabeledButtonView = /** @class */ (function (_super) {
                __extends(LabeledButtonView, _super);
                function LabeledButtonView() {
                    var _this = _super.call(this) || this;
                    _this._buttonView = new Views.ButtonView();
                    _this._labelView = new Views.LabelView();
                    _this.SetClassName('LabeledButtonView');
                    _this.Elem.addClass(_this.ClassName);
                    _this._buttonView.SetAnchor(0, 0, 0, 20);
                    _this.Add(_this._buttonView);
                    _this._labelView.SetAnchor(null, null, null, 0);
                    _this._labelView.Size.Height = 15;
                    _this._labelView.FontSize = Property.FontSize.Small;
                    _this.Add(_this._labelView);
                    return _this;
                }
                Object.defineProperty(LabeledButtonView.prototype, "Button", {
                    get: function () {
                        return this._buttonView;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LabeledButtonView.prototype, "Label", {
                    get: function () {
                        return this._labelView;
                    },
                    enumerable: true,
                    configurable: true
                });
                LabeledButtonView.prototype.InnerRefresh = function () {
                    try {
                        this.SuppressLayout();
                        _super.prototype.InnerRefresh.call(this);
                        this.SetStyles({
                            color: 'transparent',
                            backgroundColor: 'transparent',
                            borderWidth: '0',
                            borderColor: 'transparent',
                            opacity: "" + this.Opacity
                        });
                        //this.Dom.style.color = 'transparent';
                        //this.Dom.style.backgroundColor = 'transparent';
                        //this.Dom.style.borderWidth = '0';
                        //this.Dom.style.borderColor = 'transparent';
                        //this.Dom.style.opacity = `${this.Opacity}`;
                    }
                    catch (e) {
                        Dump.ErrorLog(e);
                    }
                    finally {
                        this.ResumeLayout();
                    }
                };
                LabeledButtonView.prototype.Dispose = function () {
                    _super.prototype.Dispose.call(this);
                    this._buttonView = null;
                    this.HoverColor = null;
                };
                return LabeledButtonView;
            }(Fw.Views.ControlView));
            Controls.LabeledButtonView = LabeledButtonView;
        })(Controls = Views_4.Controls || (Views_4.Controls = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
/// <reference path="LabeledButtonView.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_5) {
        var Controls;
        (function (Controls) {
            var Views = Fw.Views;
            var Color = App.Color;
            var ControlSetButtonView = /** @class */ (function (_super) {
                __extends(ControlSetButtonView, _super);
                function ControlSetButtonView() {
                    var _this = _super.call(this) || this;
                    _this._toggle = new Views.ToggleButtonView();
                    _this.SetSize(150, 170);
                    _this.Button.HasBorder = false;
                    _this.Button.BorderRadius = 5;
                    _this.Button.BackgroundColor = Color.MainBackground;
                    _this.Button.HoverColor = Color.MainHover;
                    _this.Button.Color = Color.Main;
                    _this.Label.Color = Color.Main;
                    _this._toggle.SetAnchor(null, 40, 40, 30);
                    _this._toggle.BackgroundColor = 'transparent';
                    _this.Add(_this._toggle);
                    return _this;
                }
                Object.defineProperty(ControlSetButtonView.prototype, "Toggle", {
                    get: function () {
                        return this._toggle;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ControlSetButtonView;
            }(Controls.LabeledButtonView));
            Controls.ControlSetButtonView = ControlSetButtonView;
        })(Controls = Views_5.Controls || (Views_5.Controls = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
/// <reference path="LabeledButtonView.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_6) {
        var Controls;
        (function (Controls) {
            var Color = App.Color;
            var SceneButtonView = /** @class */ (function (_super) {
                __extends(SceneButtonView, _super);
                function SceneButtonView() {
                    var _this = _super.call(this) || this;
                    _this.SetSize(200, 150);
                    _this.Button.HasBorder = true;
                    _this.Button.BorderRadius = 50;
                    _this.Button.BackgroundColor = Color.MainBackground;
                    _this.Button.HoverColor = Color.MainHover;
                    _this.Button.Color = Color.Main;
                    _this.Button.SetStyle('borderColor', Color.MainHover);
                    _this.Label.Color = Color.Main;
                    return _this;
                }
                SceneButtonView.prototype.InnerRefresh = function () {
                    _super.prototype.InnerRefresh.call(this);
                    this.Button.Dom.style.borderColor = Color.MainHover;
                    //this.Button.SetStyle('borderColor', Color.MainHover);
                };
                return SceneButtonView;
            }(Controls.LabeledButtonView));
            Controls.SceneButtonView = SceneButtonView;
        })(Controls = Views_6.Controls || (Views_6.Controls = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_7) {
        var Pages;
        (function (Pages) {
            var Property = Fw.Views.Property;
            var LayoutCheckPageView = /** @class */ (function (_super) {
                __extends(LayoutCheckPageView, _super);
                function LayoutCheckPageView() {
                    var _this = this;
                    var jqueryElem = $("");
                    _this = _super.call(this, jqueryElem) || this;
                    _this.BtnGoSub1 = new Fw.Views.ButtonView();
                    _this.BtnGoSub2 = new Fw.Views.ButtonView();
                    _this.CenterControl = new Fw.Views.ControlView();
                    _this.TmpCtl = new Fw.Views.ControlView();
                    _this.AncCtl1 = new Fw.Views.ButtonView();
                    _this.AncCtl2 = new Fw.Views.ButtonView();
                    _this.AncCtl3 = new Fw.Views.ButtonView();
                    _this.Toggle = new Fw.Views.ToggleButtonView();
                    _this.AncCtl4 = new Fw.Views.ButtonView();
                    _this.SetClassName('MainPageView');
                    _this.BtnGoSub1.Text = 'Go Sub1';
                    _this.BtnGoSub1.SetSize(80, 30);
                    _this.BtnGoSub1.SetAnchor(null, 10, null, null);
                    _this.Add(_this.BtnGoSub1);
                    _this.BtnGoSub2.Text = 'Go Sub2';
                    _this.BtnGoSub2.SetSize(80, 30);
                    _this.BtnGoSub2.Position.Y = 40;
                    _this.BtnGoSub2.SetAnchor(null, 10, null, null);
                    _this.Add(_this.BtnGoSub2);
                    _this.CenterControl.SetXY(0, 0);
                    _this.CenterControl.SetSize(100, 50);
                    _this.CenterControl.Color = '#1155FF';
                    _this.CenterControl.Text = 'はろー<br/>どうよ？';
                    _this.Add(_this.CenterControl);
                    _this.TmpCtl.SetXY(-100, -100);
                    _this.TmpCtl.SetSize(200, 200);
                    _this.TmpCtl.Color = '#666666';
                    _this.TmpCtl.Text = 'くりっく';
                    _this.Add(_this.TmpCtl);
                    _this.AncCtl1.Text = '右下';
                    _this.AncCtl1.SetSize(200, 50);
                    _this.AncCtl1.SetAnchor(null, null, 40, 5);
                    _this.Add(_this.AncCtl1);
                    _this.AncCtl2.Text = '右上';
                    _this.AncCtl2.SetSize(200, 50);
                    _this.AncCtl2.SetAnchor(3, null, 3, null);
                    _this.Add(_this.AncCtl2);
                    var label = new Fw.Views.LabelView();
                    label.FontSize = Property.FontSize.XxLarge;
                    label.Text = 'らべるやで';
                    _this.AncCtl2.Add(label);
                    _this.AncCtl3.Text = '左下';
                    _this.AncCtl3.SetSize(300, 100);
                    _this.AncCtl3.SetAnchor(null, 3, null, 3);
                    _this.Add(_this.AncCtl3);
                    var img = new Fw.Views.ImageView();
                    img.SetSize(100, 70);
                    img.Src = 'images/icons/home.png';
                    img.FitPolicy = Property.FitPolicy.Cover;
                    _this.AncCtl3.Add(img);
                    _this.Toggle.SetAnchor(150, 10, null, null);
                    _this.Add(_this.Toggle);
                    _this.AncCtl4.Text = 'マスク';
                    _this.AncCtl4.SetSize(200, 50);
                    _this.AncCtl4.SetAnchor(60, 3, null, null);
                    _this.Add(_this.AncCtl4);
                    return _this;
                    //this.AncCtl5 = new Fw.Views.ButtonView();
                    //this.AncCtl5.Label = '左右';
                    //this.AncCtl5.Size.Height = 50;
                    //this.AncCtl5.SetAnchor(null, 150, 300, 100);
                    //this.Add(this.AncCtl5);
                    //this.AncCtl6 = new Fw.Views.ButtonView();
                    //this.AncCtl6.Label = '上下';
                    //this.AncCtl6.SetAnchor(200, null, null, 40);
                    //this.AncCtl6.Size.Width = 30;
                    //this.Add(this.AncCtl6);
                }
                return LayoutCheckPageView;
            }(Fw.Views.PageView));
            Pages.LayoutCheckPageView = LayoutCheckPageView;
        })(Pages = Views_7.Pages || (Views_7.Pages = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
var App;
(function (App) {
    var Views;
    (function (Views_8) {
        var Pages;
        (function (Pages) {
            var Views = Fw.Views;
            var Property = Fw.Views.Property;
            var Sub3PageView = /** @class */ (function (_super) {
                __extends(Sub3PageView, _super);
                function Sub3PageView() {
                    var _this = this;
                    var jqueryElem = $("");
                    _this = _super.call(this, jqueryElem) || this;
                    _this.HeaderBar = new Views_8.Controls.HeaderBarView();
                    _this.Stucker = new Views.StuckerBoxView();
                    _this.SetClassName('Sub3PageView');
                    _this.HeaderBar.Text = 'Sub 3 Page';
                    _this.HeaderBar.RightButton.Hide(0);
                    _this.Add(_this.HeaderBar);
                    //this.Stucker.SetSize(600, 400);
                    _this.Stucker.SetAnchor(70, 20, 20, null);
                    _this.Stucker.Size.Height = 400;
                    _this.Stucker.SetLeftTop(10, 70);
                    _this.Add(_this.Stucker);
                    var btn1 = new Views.ButtonView();
                    btn1.SetSize(100, 120);
                    btn1.Text = 'btn1: LeftTop';
                    _this.Stucker.Add(btn1);
                    btn1.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, function () {
                        _this.Stucker.ReferencePoint = Property.ReferencePoint.LeftTop;
                    });
                    var btn2 = new Views.ButtonView();
                    btn2.SetSize(100, 120);
                    btn2.Text = 'btn2: RightTop';
                    _this.Stucker.Add(btn2);
                    btn2.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, function () {
                        _this.Stucker.ReferencePoint = Property.ReferencePoint.RightTop;
                    });
                    var btn3 = new Views.ButtonView();
                    btn3.SetSize(100, 120);
                    btn3.Text = 'btn3: LeftBottom';
                    _this.Stucker.Add(btn3);
                    btn3.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, function () {
                        _this.Stucker.ReferencePoint = Property.ReferencePoint.LeftBottom;
                    });
                    var btn4 = new Views.ButtonView();
                    btn4.SetSize(100, 120);
                    btn4.Text = 'btn4: RightBottom';
                    _this.Stucker.Add(btn4);
                    btn4.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, function () {
                        _this.Stucker.ReferencePoint = Property.ReferencePoint.RightBottom;
                    });
                    var idx = 5;
                    for (var i = 0; i < 20; i++) {
                        var btn = new Views.ButtonView();
                        btn.SetSize(100, 120);
                        btn.Text = "btn" + (idx + i);
                        _this.Stucker.Add(btn);
                    }
                    return _this;
                }
                return Sub3PageView;
            }(Fw.Views.PageView));
            Pages.Sub3PageView = Sub3PageView;
        })(Pages = Views_8.Pages || (Views_8.Pages = {}));
    })(Views = App.Views || (App.Views = {}));
})(App || (App = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="../Fw/Util/Dump.ts" />
/// <reference path="../Fw/Controllers/Manager.ts" />
var App;
(function (App) {
    var Manager = Fw.Controllers.Manager;
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
            var main = new App.Controllers.MainController('Main');
            main.IsDefaultView = true;
            Manager.Instance.Add(main);
            Manager.Instance.Show('Main');
            Fw.Util.Dump.Log('Show');
        };
        return Main;
    }());
    App.Main = Main;
})(App || (App = {}));
// アプリケーションを起動する。
// 以下にはこれ以上書かないこと。
$(function () {
    Fw.Util.Dump.Log('Start');
    App.Main.StartUp();
});
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ControlViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var ButtonViewEventsClass = /** @class */ (function (_super) {
            __extends(ButtonViewEventsClass, _super);
            function ButtonViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ButtonViewEventsClass;
        }(Events.ControlViewEventsClass));
        Events.ButtonViewEventsClass = ButtonViewEventsClass;
        Events.ButtonViewEvents = new ButtonViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var ImageViewEventsClass = /** @class */ (function (_super) {
            __extends(ImageViewEventsClass, _super);
            function ImageViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ImageViewEventsClass;
        }(Events.ViewEventsClass));
        Events.ImageViewEventsClass = ImageViewEventsClass;
        Events.ImageViewEvents = new ImageViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var LabelViewEventsClass = /** @class */ (function (_super) {
            __extends(LabelViewEventsClass, _super);
            function LabelViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return LabelViewEventsClass;
        }(Events.ViewEventsClass));
        Events.LabelViewEventsClass = LabelViewEventsClass;
        Events.LabelViewEvents = new LabelViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var LineViewEventsClass = /** @class */ (function (_super) {
            __extends(LineViewEventsClass, _super);
            function LineViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return LineViewEventsClass;
        }(Events.ViewEventsClass));
        Events.LineViewEventsClass = LineViewEventsClass;
        Events.LineViewEvents = new LineViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ButtonViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var RelocatableViewEventsClass = /** @class */ (function (_super) {
            __extends(RelocatableViewEventsClass, _super);
            function RelocatableViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return RelocatableViewEventsClass;
        }(Events.ButtonViewEventsClass));
        Events.RelocatableViewEventsClass = RelocatableViewEventsClass;
        Events.RelocatableViewEvents = new RelocatableViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
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
                this.MaskClicked = 'MaskClicked';
            }
            return RootEventsClass;
        }());
        Events.RootEventsClass = RootEventsClass;
        Events.RootEvents = new RootEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="BoxViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var SlidableBoxViewEventsClass = /** @class */ (function (_super) {
            __extends(SlidableBoxViewEventsClass, _super);
            function SlidableBoxViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SlidableBoxViewEventsClass;
        }(Events.BoxViewEventsClass));
        Events.SlidableBoxViewEventsClass = SlidableBoxViewEventsClass;
        Events.SlidableBoxViewEvents = new SlidableBoxViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="BoxViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var StuckerBoxViewEventsClass = /** @class */ (function (_super) {
            __extends(StuckerBoxViewEventsClass, _super);
            function StuckerBoxViewEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return StuckerBoxViewEventsClass;
        }(Events.BoxViewEventsClass));
        Events.StuckerBoxViewEventsClass = StuckerBoxViewEventsClass;
        Events.StuckerBoxViewEvents = new StuckerBoxViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ControlViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var ToggleButtonViewEventsClass = /** @class */ (function (_super) {
            __extends(ToggleButtonViewEventsClass, _super);
            function ToggleButtonViewEventsClass() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.Switched = 'Switched';
                _this.ToOn = 'ToOn';
                _this.ToOff = 'ToOff';
                return _this;
            }
            return ToggleButtonViewEventsClass;
        }(Events.ControlViewEventsClass));
        Events.ToggleButtonViewEventsClass = ToggleButtonViewEventsClass;
        Events.ToggleButtonViewEvents = new ToggleButtonViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
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
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            var Direction;
            (function (Direction) {
                Direction[Direction["Horizontal"] = 0] = "Horizontal";
                Direction[Direction["Vertical"] = 1] = "Vertical";
            })(Direction = Property.Direction || (Property.Direction = {}));
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            /**
             * @description font-size
             */
            var FontSize;
            (function (FontSize) {
                FontSize["XxSmall"] = "xx-small";
                FontSize["XSmall"] = "x-small";
                FontSize["Small"] = "small";
                FontSize["Medium"] = "medium";
                FontSize["Large"] = "large";
                FontSize["XLarge"] = "x-large";
                FontSize["XxLarge"] = "xx-large";
            })(FontSize = Property.FontSize || (Property.FontSize = {}));
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            /**
             * @description font-weight
             */
            var FontWeight;
            (function (FontWeight) {
                FontWeight["Lighter"] = "lighter";
                FontWeight["Normal"] = "normal";
                FontWeight["Bold"] = "bold";
                FontWeight["Bolder"] = "bolder";
            })(FontWeight = Property.FontWeight || (Property.FontWeight = {}));
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Property;
        (function (Property) {
            /**
             * @description 配置基準
             */
            var PositionPolicy;
            (function (PositionPolicy) {
                /**
                 * 中央ポリシー：親Viewの中心位置からの差分を X, Y で表現する。
                 */
                PositionPolicy[PositionPolicy["Centering"] = 1] = "Centering";
                /**
                 * 左上ポリシー：親Viewの左上からの差分を、Left, Top で表現する。
                 */
                PositionPolicy[PositionPolicy["LeftTop"] = 2] = "LeftTop";
            })(PositionPolicy = Property.PositionPolicy || (Property.PositionPolicy = {}));
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />
/// <reference path="PositionPolicy.ts" />
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
                    this._policy = Property.PositionPolicy.Centering;
                    this._x = 0;
                    this._y = 0;
                    this._left = 0;
                    this._top = 0;
                    this._view = view;
                }
                Object.defineProperty(Position.prototype, "Policy", {
                    get: function () {
                        return this._policy;
                    },
                    set: function (value) {
                        if (!value)
                            throw new Error("value type not allowed");
                        var changed = (this._policy !== value);
                        if (changed && this._view.Parent) {
                            if (this._policy === Property.PositionPolicy.Centering) {
                                // 更新前が中央ポリシーのとき
                                // 現在の値を左上ポリシー値に計算して保持させる。
                                this._left = this.Left || 0;
                                this._top = this.Top || 0;
                            }
                            else {
                                // 更新前が左上ポリシーのとき
                                // 現在の値を中央ポリシー値に計算して保持させる。
                                this._x = this.X || 0;
                                this._y = this.Y || 0;
                            }
                        }
                        this._policy = value;
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionPolicyChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "X", {
                    get: function () {
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            return this._x;
                        }
                        else {
                            // 左上ポリシー
                            if (!this._view)
                                return null;
                            var sset = this.GetSizeSet();
                            return sset.MyHalfWidth + this._left - sset.ParentHalfWidth;
                        }
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = false;
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            changed = (this._x !== value);
                            this._x = value;
                        }
                        else {
                            // 左上ポリシー
                            var sset = this.GetSizeSet();
                            // 更新後のLeftを取得
                            var newValue = sset.ParentHalfWidth - sset.MyHalfWidth + value;
                            changed = (this._left !== newValue);
                            this._left = newValue;
                        }
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Y", {
                    get: function () {
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            return this._y;
                        }
                        else {
                            // 左上ポリシー
                            if (!this._view)
                                return null;
                            var sset = this.GetSizeSet();
                            return sset.MyHalfHeight + this._top - sset.ParentHalfHeight;
                        }
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = false;
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            changed = (this._y !== value);
                            this._y = value;
                        }
                        else {
                            // 左上ポリシー
                            var sset = this.GetSizeSet();
                            // 更新後のTopを取得
                            var newValue = sset.ParentHalfHeight - sset.MyHalfHeight + value;
                            changed = (this._top !== newValue);
                            this._top = newValue;
                        }
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Left", {
                    get: function () {
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            if (!this._view)
                                return null;
                            var sset = this.GetSizeSet();
                            return sset.ParentHalfWidth - sset.MyHalfWidth + this._x;
                        }
                        else {
                            // 左上ポリシー
                            return this._left;
                        }
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = false;
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            var sset = this.GetSizeSet();
                            // 更新後のXを取得
                            var newValue = sset.MyHalfWidth + value - sset.ParentHalfWidth;
                            changed = (this._x !== newValue);
                            this._x = newValue;
                        }
                        else {
                            // 左上ポリシー
                            changed = (this._left !== value);
                            this._left = value;
                        }
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Position.prototype, "Top", {
                    get: function () {
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            if (!this._view)
                                return null;
                            var sset = this.GetSizeSet();
                            return sset.ParentHalfHeight - sset.MyHalfHeight + this._y;
                        }
                        else {
                            // 左上ポリシー
                            return this._top;
                        }
                    },
                    set: function (value) {
                        // nullは許可、その他は例外
                        if (Number.IsNaN(value) || value === undefined)
                            throw new Error("value type not allowed");
                        var changed = false;
                        if (this._policy === Property.PositionPolicy.Centering) {
                            // 中央ポリシー
                            var sset = this.GetSizeSet();
                            // 更新後のYを取得
                            var newValue = sset.MyHalfHeight + value - sset.ParentHalfHeight;
                            changed = (this._y !== newValue);
                            this._y = newValue;
                        }
                        else {
                            // 左上ポリシー
                            changed = (this._top !== value);
                            this._top = value;
                        }
                        if (changed && this._view)
                            this._view.DispatchEvent(Events.PositionChanged);
                    },
                    enumerable: true,
                    configurable: true
                });
                Position.prototype.GetSizeSet = function () {
                    return new SizeSet(this._view);
                };
                Position.prototype.Dispose = function () {
                    this._view = null;
                    this._x = null;
                    this._y = null;
                };
                return Position;
            }());
            Property.Position = Position;
            var SizeSet = /** @class */ (function () {
                function SizeSet(view) {
                    var parentWidth;
                    var parentHeight;
                    if (view.Parent) {
                        // 親Viewが存在する
                        parentWidth = view.Parent.Size.Width;
                        parentHeight = view.Parent.Size.Height;
                    }
                    else {
                        // 親Viewが存在しない
                        var parent_2 = $(view.Elem.parent());
                        parentWidth = parent_2.width();
                        parentHeight = parent_2.height();
                    }
                    this.ParentHalfWidth = parentWidth / 2;
                    this.ParentHalfHeight = parentHeight / 2;
                    this.MyHalfWidth = view.Size.Width / 2;
                    this.MyHalfHeight = view.Size.Height / 2;
                    //this.ParentWidth = parentWidth;
                    //this.ParentHeight = parentHeight;
                    //this.MyWidth = view.Size.Width;
                    //this.MyHeight = view.Size.Height;
                }
                return SizeSet;
            }());
        })(Property = Views.Property || (Views.Property = {}));
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
            /**
             * @description 基点、スタッキング時の基準点
             */
            var ReferencePoint;
            (function (ReferencePoint) {
                ReferencePoint[ReferencePoint["LeftTop"] = 1] = "LeftTop";
                ReferencePoint[ReferencePoint["RightTop"] = 2] = "RightTop";
                ReferencePoint[ReferencePoint["LeftBottom"] = 3] = "LeftBottom";
                ReferencePoint[ReferencePoint["RightBottom"] = 4] = "RightBottom";
            })(ReferencePoint = Property.ReferencePoint || (Property.ReferencePoint = {}));
        })(Property = Views.Property || (Views.Property = {}));
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var FitPolicy = Fw.Views.Property.FitPolicy;
        var ImageView = /** @class */ (function (_super) {
            __extends(ImageView, _super);
            function ImageView() {
                var _this = _super.call(this, $('<div></div>')) || this;
                _this._image = new Image();
                _this.SetClassName('ImageView');
                _this.Elem.addClass(_this.ClassName);
                _this.BackgroundColor = 'transparent';
                //this.Dom.style.borderWidth = '0';
                //this.Dom.style.borderRadius = '0';
                _this.SetStyles({
                    borderWidth: '0',
                    borderRadius: '0'
                });
                // 注) ImageオブジェクトはDomツリーに入れない。
                _this._image.onload = function () {
                    //Dump.Log('Image Loaded!!');
                    _this.Refresh();
                };
                _this._firPolicy = FitPolicy.Auto;
                return _this;
            }
            Object.defineProperty(ImageView.prototype, "Src", {
                get: function () {
                    return this._src;
                },
                set: function (value) {
                    this._src = value;
                    this._image.src = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ImageView.prototype, "FitPolicy", {
                get: function () {
                    return this._firPolicy;
                },
                set: function (value) {
                    this._firPolicy = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            ImageView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    _super.prototype.InnerRefresh.call(this);
                    //this.Dom.style.backgroundPosition = 'center center';
                    //this.Dom.style.backgroundRepeat = 'no-repeat';
                    //this.Dom.style.backgroundSize = this.FitPolicy;
                    //this.Dom.style.backgroundImage = (this._src)
                    //    ? `url(${this._src})`
                    //    : null;
                    this.SetStyles({
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: this.FitPolicy,
                        backgroundImage: (this._src) ? "url(" + this._src + ")" : null
                    });
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            ImageView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._image = null;
                this._src = null;
                this._firPolicy = null;
            };
            return ImageView;
        }(Views.ViewBase));
        Views.ImageView = ImageView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FontWeight.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events.ControlViewEvents;
        var Property = Fw.Views.Property;
        var LabelView = /** @class */ (function (_super) {
            __extends(LabelView, _super);
            function LabelView() {
                var _this = _super.call(this, $('<label></label>')) || this;
                _this._hiddenSpan = document.createElement('span');
                _this.SetClassName('LabelView');
                _this.Elem.addClass(_this.ClassName);
                _this.BackgroundColor = 'transparent';
                _this.SetTransAnimation(false);
                //this.Dom.style.borderWidth = '0';
                //this.Dom.style.borderRadius = '0';
                _this.SetStyles({
                    borderWidth: '0',
                    borderRadius: '0'
                });
                _this._text = '';
                _this._fontWeight = Property.FontWeight.Normal;
                _this._fontSize = Property.FontSize.Medium;
                _this._fontFamily = 'Quicksand, 游ゴシック体, "Yu Gothic", YuGothic, "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif';
                _this._hiddenSpan.style.visibility = 'hidden';
                _this._hiddenSpan.style.fontWeight = _this._fontWeight;
                _this._hiddenSpan.style.fontSize = _this._fontSize;
                _this._hiddenSpan.style.fontFamily = _this._fontFamily;
                _this.AddEventListener(Events.Attached, function () {
                    _this.Parent.Elem.append(_this._hiddenSpan);
                });
                _this.AddEventListener(Events.Detached, function () {
                    $(_this._hiddenSpan).remove();
                });
                _this._autoSize = true;
                return _this;
            }
            Object.defineProperty(LabelView.prototype, "Text", {
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    this._text = value;
                    this.Elem.text(''); // 一旦消す。
                    this._hiddenSpan.innerText = this._text;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelView.prototype, "FontWeight", {
                get: function () {
                    return this._fontWeight;
                },
                set: function (value) {
                    this._fontWeight = value;
                    this._hiddenSpan.style.fontWeight = this._fontWeight;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelView.prototype, "FontSize", {
                get: function () {
                    return this._fontSize;
                },
                set: function (value) {
                    this._fontSize = value;
                    this._hiddenSpan.style.fontSize = this._fontSize;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelView.prototype, "FontFamily", {
                get: function () {
                    return this._fontFamily;
                },
                set: function (value) {
                    this._fontFamily = value;
                    this._hiddenSpan.style.fontFamily = this._fontFamily;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LabelView.prototype, "AutoSize", {
                get: function () {
                    return this._autoSize;
                },
                set: function (value) {
                    this._autoSize = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            LabelView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    if (this._autoSize) {
                        this.Size.Width = this._hiddenSpan.offsetWidth + 10;
                        this.Size.Height = this._hiddenSpan.offsetHeight;
                    }
                    _super.prototype.InnerRefresh.call(this);
                    //this.Dom.style.fontWeight = this._fontWeight;
                    //this.Dom.style.fontSize = this._fontSize;
                    //this.Dom.style.fontFamily = this._fontFamily;
                    this.SetStyles({
                        fontWeight: this._fontWeight,
                        fontSize: this._fontSize,
                        fontFamily: this._fontFamily
                    });
                    this.Elem.text(this._text);
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            LabelView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._text = null;
                $(this._hiddenSpan).remove();
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
/// <reference path="../Util/Number.ts" />
/// <reference path="./BoxView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var LineView = /** @class */ (function (_super) {
            __extends(LineView, _super);
            function LineView(direction) {
                var _this = _super.call(this, $('<div></div>')) || this;
                // nullやundefinedを入れさせない。
                _this._direction = (direction === Views.Property.Direction.Horizontal)
                    ? Views.Property.Direction.Horizontal
                    : Views.Property.Direction.Vertical;
                _this.SetClassName('LineView');
                _this.Elem.addClass(_this.ClassName);
                _this._length = 0;
                return _this;
            }
            Object.defineProperty(LineView.prototype, "Direction", {
                get: function () {
                    return this._direction;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineView.prototype, "Length", {
                get: function () {
                    return this._length;
                },
                set: function (value) {
                    this._length = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineView.prototype, "BackgroundColor", {
                get: function () {
                    throw new Error('Not supported');
                },
                set: function (value) {
                    throw new Error('Not supported');
                },
                enumerable: true,
                configurable: true
            });
            LineView.prototype.InnerRefresh = function () {
                try {
                    //Dump.Log(`${this.ClassName}.InnerRefresh`);
                    this.SuppressLayout();
                    if (this.Direction === Views.Property.Direction.Horizontal) {
                        //Dump.Log(`${this.ClassName}.Direction = ${this.Direction}`);
                        this.Size.Height = 2;
                        this.Size.Width = this.Length;
                    }
                    else {
                        //Dump.Log(`${this.ClassName}.Direction = ${this.Direction}`);
                        this.Size.Width = 2;
                        this.Size.Height = this.Length;
                    }
                    _super.prototype.InnerRefresh.call(this);
                    //this.Dom.style.borderWidth = '0';
                    //this.Dom.style.backgroundColor = `${this.Color}`;
                    this.SetStyles({
                        borderWidth: '0',
                        backgroundColor: "" + this.Color,
                    });
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            LineView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
            };
            return LineView;
        }(Views.ViewBase));
        Views.LineView = LineView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="ButtonView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events.ControlViewEvents;
        var RelocatableButtonView = /** @class */ (function (_super) {
            __extends(RelocatableButtonView, _super);
            function RelocatableButtonView() {
                var _this = _super.call(this) || this;
                _this._isRelocatable = false;
                _this._isMouseMoveEventListened = false;
                _this._isDragging = false;
                _this._gridSize = 60;
                _this._delayedResumeTimer = null;
                _this._shadow = $('<div class="IView BoxView Shadow"></div>');
                _this._dragStartMousePosition = new Views.Property.Position();
                _this._dragStartViewPosition = new Views.Property.Position();
                _this.SetClassName('RelocatableControlView');
                _this.Elem.addClass(_this.ClassName);
                _this.AddEventListener(Events.LongClick, function () {
                    if (!_this._isRelocatable)
                        _this.SetRelocatable(true);
                });
                _this.Elem.on('touchstart mousedown', function (e) {
                    if (!_this._isRelocatable) {
                        _this._isDragging = false;
                    }
                    else {
                        _this._isDragging = true;
                        _this._dragStartMousePosition.X = e.pageX;
                        _this._dragStartMousePosition.Y = e.pageY;
                        if (_this.Position.Policy === Views.Property.PositionPolicy.Centering) {
                            _this._dragStartViewPosition.X = _this.Position.X;
                            _this._dragStartViewPosition.Y = _this.Position.Y;
                        }
                        else {
                            _this._dragStartViewPosition.X = _this.Position.Left;
                            _this._dragStartViewPosition.Y = _this.Position.Top;
                        }
                        _this.Refresh();
                    }
                });
                // ↓mouseoutイベントは捕捉しない。途切れまくるので。
                _this.Elem.on('touchend mouseup', function (e) {
                    if (!_this._isRelocatable) {
                        _this._isDragging = false;
                    }
                    else {
                        _this._isDragging = false;
                        if (_this.Position.Policy === Views.Property.PositionPolicy.Centering) {
                            _this.Position.X = Math.round(_this.Position.X / _this.GridSize) * _this.GridSize;
                            _this.Position.Y = Math.round(_this.Position.Y / _this.GridSize) * _this.GridSize;
                        }
                        else {
                            _this.Position.Left = Math.round(_this.Position.Left / _this.GridSize) * _this.GridSize;
                            _this.Position.Top = Math.round(_this.Position.Top / _this.GridSize) * _this.GridSize;
                        }
                        _this.Refresh();
                    }
                });
                var onMouseMove = _this.OnMouseMove.bind(_this);
                _this.AddEventListener(Events.Attached, function () {
                    var parent = $(_this.Elem.parent());
                    if (parent.length <= 0 || _this._isMouseMoveEventListened)
                        return;
                    parent.on('touchmove mousemove', onMouseMove);
                    _this._isMouseMoveEventListened = true;
                });
                _this.AddEventListener(Events.Detached, function () {
                    var parent = $(_this.Elem.parent());
                    if (parent.length <= 0 || !_this._isMouseMoveEventListened)
                        return;
                    parent.off('touchmove mousemove', onMouseMove);
                    _this._isMouseMoveEventListened = false;
                });
                return _this;
            }
            Object.defineProperty(RelocatableButtonView.prototype, "IsRelocatable", {
                get: function () {
                    return this._isRelocatable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RelocatableButtonView.prototype, "GridSize", {
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
            RelocatableButtonView.prototype.OnMouseMove = function (e) {
                if (this._isRelocatable && this._isDragging) {
                    var addX = e.pageX - this._dragStartMousePosition.X;
                    var addY = e.pageY - this._dragStartMousePosition.Y;
                    if (this.Position.Policy === Views.Property.PositionPolicy.Centering) {
                        this.Position.X = this._dragStartViewPosition.X + addX;
                        this.Position.Y = this._dragStartViewPosition.Y + addY;
                    }
                    else {
                        this.Position.Left = this._dragStartViewPosition.X + addX;
                        this.Position.Top = this._dragStartViewPosition.Y + addY;
                    }
                    // マウスボタン押下中のクリックイベント発火を抑止する。
                    if (!this.IsSuppressedEvent(Events.LongClick))
                        this.SuppressEvent(Events.LongClick);
                    if (!this.IsSuppressedEvent(Events.SingleClick))
                        this.SuppressEvent(Events.SingleClick);
                    Fw.Root.Instance.SetTextSelection(false);
                    this.DelayedResume();
                }
            };
            RelocatableButtonView.prototype.DelayedResume = function () {
                var _this = this;
                if (this._delayedResumeTimer !== null) {
                    clearTimeout(this._delayedResumeTimer);
                    this._delayedResumeTimer = null;
                }
                this._delayedResumeTimer = setTimeout(function () {
                    //Dump.Log('ResumeMouseEvents');
                    if (_this.IsSuppressedEvent(Events.LongClick))
                        _this.ResumeEvent(Events.LongClick);
                    if (_this.IsSuppressedEvent(Events.SingleClick))
                        _this.ResumeEvent(Events.SingleClick);
                    Fw.Root.Instance.SetTextSelection(true);
                }, 100);
            };
            RelocatableButtonView.prototype.SetRelocatable = function (relocatable) {
                if (this._isRelocatable) {
                    // 固定する。
                    this._isRelocatable = false;
                    this._shadow.detach();
                }
                else {
                    // 移動可能にする。
                    this._isRelocatable = true;
                    this.Elem.parent().append(this._shadow);
                }
                this.Refresh();
            };
            RelocatableButtonView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    var parent_3 = $(this.Elem.parent());
                    if (parent_3.length <= 0)
                        return;
                    if (!this._isRelocatable) {
                        if (this.Position.Policy === Views.Property.PositionPolicy.Centering) {
                            this.Position.X = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                            this.Position.Y = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
                        }
                        else {
                            this.Position.Left = Math.round(this.Position.Left / this.GridSize) * this.GridSize;
                            this.Position.Top = Math.round(this.Position.Top / this.GridSize) * this.GridSize;
                        }
                    }
                    var shadowDom = this._shadow.get(0);
                    if (!this._isRelocatable) {
                        shadowDom.style.display = 'none';
                        this.Opacity = 1.0;
                        _super.prototype.InnerRefresh.call(this);
                        return;
                    }
                    this.Opacity = 0.7;
                    _super.prototype.InnerRefresh.call(this);
                    if (this._isDragging) {
                        var parentWidth = (this.Parent)
                            ? this.Parent.Size.Width
                            : parent_3.width();
                        var parentHeight = (this.Parent)
                            ? this.Parent.Size.Height
                            : parent_3.height();
                        var centerLeft = (parentWidth / 2);
                        var centerTop = (parentHeight / 2);
                        var sX = void 0, sY = void 0, sLeft = void 0, sTop = void 0;
                        if (this.Position.Policy === Views.Property.PositionPolicy.Centering) {
                            sX = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                            sY = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
                            sLeft = centerLeft + sX - (this.Size.Width / 2);
                            sTop = centerTop + sY - (this.Size.Height / 2);
                        }
                        else {
                            sX = Math.round(this.Position.Left / this.GridSize) * this.GridSize;
                            sY = Math.round(this.Position.Top / this.GridSize) * this.GridSize;
                            sLeft = sX;
                            sTop = sY;
                        }
                        shadowDom.style.display = 'block';
                        shadowDom.style.left = sLeft + "px";
                        shadowDom.style.top = sTop + "px";
                        shadowDom.style.width = this.Size.Width + "px";
                        shadowDom.style.height = this.Size.Height + "px";
                        shadowDom.style.color = "" + this.Color;
                        shadowDom.style.borderColor = "" + this.Color;
                        shadowDom.style.backgroundColor = "" + this.BackgroundColor;
                    }
                    else {
                        shadowDom.style.display = 'none';
                    }
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            RelocatableButtonView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._isRelocatable = null;
                this._shadow.remove();
                this._shadow = null;
                this._isMouseMoveEventListened = null;
                this._isDragging = null;
                this._gridSize = null;
            };
            return RelocatableButtonView;
        }(Views.ButtonView));
        Views.RelocatableButtonView = RelocatableButtonView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/SlidableBoxViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="BoxView.ts" />
/// <reference path="Property/Size.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Property = Fw.Views.Property;
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.SlidableBoxViewEvents;
        var SlidableBoxView = /** @class */ (function (_super) {
            __extends(SlidableBoxView, _super);
            function SlidableBoxView(direction) {
                var _this = _super.call(this) || this;
                _this._innerBackgroundColor = '#F5F5F5';
                _this._innerLength = 2;
                _this._barMargin = 10;
                _this._isDragging = false;
                _this._spcvMouseSuppressor = false;
                // nullやundefinedを入れさせない。
                _this._direction = (direction === Property.Direction.Horizontal)
                    ? Property.Direction.Horizontal
                    : Property.Direction.Vertical;
                _this._innerBox = new Views.BoxView();
                _this._positionBarMax = new Views.LineView(_this._direction);
                _this._positionBarCurrent = new Views.LineView(_this._direction);
                _this.SetClassName('SlidablePanelView');
                _this.Elem.addClass(_this.ClassName);
                _this._dragStartMousePosition = new Property.Position();
                _this._dragStartViewPosition = new Property.Position();
                _this.HasBorder = false;
                _this.BorderRadius = 0;
                _this._innerBox.HasBorder = false;
                _this._innerBox.SetTransAnimation(false);
                _this.Elem.append(_this._innerBox.Elem);
                //super.Add(this._innerBox); // Addメソッドでthis.Childrenを呼ぶため循環参照になる。
                // コンストラクタ完了後に実行。
                // コンストラクタ引数で取得したDirectionがセットされていないため。
                _this._positionBarMax.Position.Policy = Property.PositionPolicy.LeftTop;
                _this._positionBarMax.SetTransAnimation(false);
                _this._positionBarMax.Color = '#888888';
                _super.prototype.Add.call(_this, _this._positionBarMax);
                _this._positionBarCurrent.Position.Policy = Property.PositionPolicy.LeftTop;
                _this._positionBarCurrent.SetTransAnimation(false);
                _this._positionBarCurrent.Color = '#EEEEEE';
                _super.prototype.Add.call(_this, _this._positionBarCurrent);
                _this.AddEventListener(Events.Initialized, function () {
                    _this.InitView();
                });
                _this._innerBox.Elem.addClass('SlidablePanelInnerView');
                _this._innerBox.Elem.on('touchstart mousedown', function (e) {
                    _this._isDragging = true;
                    _this._dragStartMousePosition.X = e.clientX;
                    _this._dragStartMousePosition.Y = e.clientY;
                    _this._dragStartViewPosition.X = _this._innerBox.Position.X;
                    _this._dragStartViewPosition.Y = _this._innerBox.Position.Y;
                    //Fw.Root.Instance.SetTextSelection(false);
                });
                _this._innerBox.Elem.on('touchmove mousemove', function (e) {
                    if (!_this._isDragging || _this._spcvMouseSuppressor)
                        return;
                    // 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
                    if (e.eventPhase !== 2)
                        return;
                    var addX = e.clientX - _this._dragStartMousePosition.X;
                    var addY = e.clientY - _this._dragStartMousePosition.Y;
                    if (_this._direction === Property.Direction.Horizontal) {
                        // 横方向
                        _this._innerBox.Position.X = _this._dragStartViewPosition.X + addX;
                    }
                    else {
                        // 縦方向
                        _this._innerBox.Position.Y = _this._dragStartViewPosition.Y + addY;
                    }
                    _this.Refresh();
                });
                _this._innerBox.Elem.on('touchend mouseup mouseout', function () {
                    _this._isDragging = false;
                    //Fw.Root.Instance.SetTextSelection(true);
                    _.delay(function () {
                        _this.AdjustSlidePosition();
                    }, 200);
                });
                return _this;
            }
            Object.defineProperty(SlidableBoxView.prototype, "Children", {
                get: function () {
                    return this._innerBox.Children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SlidableBoxView.prototype, "Direction", {
                get: function () {
                    return this._direction;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SlidableBoxView.prototype, "InnerBackgroundColor", {
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
            Object.defineProperty(SlidableBoxView.prototype, "InnerLength", {
                get: function () {
                    return this._innerLength;
                },
                set: function (value) {
                    this._innerLength = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            SlidableBoxView.prototype.InitView = function () {
                if (this.Direction === Property.Direction.Horizontal) {
                    // 横方向
                    if (this.InnerLength < this.Size.Width)
                        this.InnerLength = this.Size.Width;
                    //this.Dom.style.overflowX = 'hidden';//'scroll';
                    //this.Dom.style.overflowY = 'hidden';
                    this.SetStyles({
                        overflowX: 'hidden',
                        overflowY: 'hidden'
                    });
                    this._innerBox.Size.Width = this.InnerLength;
                    this._innerBox.Size.Height = this.Size.Height;
                    this._innerBox.Position.X = (this._innerBox.Size.Width - this.Size.Width) / 2;
                    this._innerBox.Position.Y = 0;
                }
                else {
                    // 縦方向
                    if (this.InnerLength < this.Size.Height)
                        this.InnerLength = this.Size.Height;
                    //this.Dom.style.overflowY = 'hidden';//'scroll';
                    //this.Dom.style.overflowX = 'hidden';
                    this.SetStyles({
                        overflowX: 'hidden',
                        overflowY: 'hidden'
                    });
                    this._innerBox.Size.Height = this.InnerLength;
                    this._innerBox.Size.Width = this.Size.Width;
                    this._innerBox.Position.Y = (this._innerBox.Size.Height - this.Size.Height) / 2;
                    this._innerBox.Position.X = 0;
                }
            };
            SlidableBoxView.prototype.AdjustSlidePosition = function () {
                var _this = this;
                var unitWidth = this.Size.Width / 2;
                var unitHeight = this.Size.Height / 2;
                var maxLeft = 0;
                var maxTop = 0;
                var minLeft = this.Size.Width - this._innerBox.Size.Width;
                var minTop = this.Size.Height - this._innerBox.Size.Height;
                var left = this._innerBox.Position.Left;
                var top = this._innerBox.Position.Top;
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
                var animator = new Anim.Animator(this._innerBox);
                if (this.Direction === Property.Direction.Horizontal) {
                    animator.ToParams.X = (toLeft - left);
                }
                else {
                    animator.ToParams.Y = (toTop - top);
                }
                animator.OnComplete = function () {
                    if (_this.Direction === Property.Direction.Horizontal) {
                        _this._innerBox.SetLeftTop(toLeft, null, false);
                    }
                    else {
                        _this._innerBox.SetLeftTop(null, toTop, false);
                    }
                    _this._spcvMouseSuppressor = false;
                };
                this._spcvMouseSuppressor = true;
                animator.Invoke(500);
            };
            SlidableBoxView.prototype.Add = function (view) {
                this._innerBox.Add(view);
            };
            SlidableBoxView.prototype.Remove = function (view) {
                this._innerBox.Remove(view);
            };
            SlidableBoxView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    if (this.Direction === Property.Direction.Horizontal) {
                        // 横方向
                        if (this.InnerLength < this.Size.Width)
                            this.InnerLength = this.Size.Width;
                        //this.Dom.style.overflowX = 'hidden';//'scroll';
                        //this.Dom.style.overflowY = 'hidden';
                        this._innerBox.Size.Width = this.InnerLength;
                        this._innerBox.Size.Height = this.Size.Height;
                        this._positionBarMax.SetAnchor(null, this._barMargin, this._barMargin, this._barMargin);
                        this._positionBarMax.Length = this.Size.Width - (this._barMargin * 2);
                        this._positionBarCurrent.SetAnchor(null, null, null, this._barMargin);
                        this._positionBarCurrent.Length
                            = this._positionBarMax.Length
                                * (this.Size.Width / this.InnerLength);
                        var maxLeft = this.InnerLength - this.Size.Width;
                        var currentLeft = this._innerBox.Position.Left;
                        var posRate = (maxLeft === 0)
                            ? 1
                            : currentLeft / maxLeft;
                        var leftLength = this._positionBarMax.Length - this._positionBarCurrent.Length;
                        this._positionBarCurrent.Position.Left = this._barMargin - (leftLength * posRate);
                        //Dump.Log({
                        //    max_Length: this._positionBarMax.Length,
                        //    current_Length: this._positionBarCurrent.Length,
                        //    maxLeft: maxLeft,
                        //    currentLeft: currentLeft,
                        //    posRate: posRate,
                        //    leftLength: leftLength,
                        //    current_Left: this._positionBarCurrent.Position.Left
                        //});
                    }
                    else {
                        // 縦方向
                        if (this.InnerLength < this.Size.Height)
                            this.InnerLength = this.Size.Height;
                        //this.Dom.style.overflowY = 'hidden';//'scroll';
                        //this.Dom.style.overflowX = 'hidden';
                        this._innerBox.Size.Height = this.InnerLength;
                        this._innerBox.Size.Width = this.Size.Width;
                        this._positionBarMax.SetAnchor(this._barMargin, null, this._barMargin, this._barMargin);
                        this._positionBarMax.Length = this.Size.Height - (this._barMargin * 2);
                        this._positionBarCurrent.SetAnchor(null, null, this._barMargin, null);
                        this._positionBarCurrent.Length
                            = this._positionBarMax.Length
                                * (this.Size.Height / this.InnerLength);
                        var maxTop = this.InnerLength - this.Size.Height;
                        var currentTop = this._innerBox.Position.Top;
                        var posRate = (maxTop === 0)
                            ? 1
                            : currentTop / maxTop;
                        var topLength = this._positionBarMax.Length - this._positionBarCurrent.Length;
                        this._positionBarCurrent.Position.Top = this._barMargin - (topLength * posRate);
                    }
                    this._innerBox.BackgroundColor = this._innerBackgroundColor;
                    _super.prototype.InnerRefresh.call(this);
                    this.SetStyles({
                        overflowY: 'hidden',
                        overflowX: 'hidden'
                    });
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            SlidableBoxView.prototype.Dispose = function () {
                this._innerBox.Elem.off('touchstart mousedown');
                this._innerBox.Elem.off('touchmove mousemove');
                this._innerBox.Elem.off('touchend mouseup mouseout');
                _super.prototype.Dispose.call(this);
                this._innerBackgroundColor = null;
                this._innerLength = null;
                this._innerBox.Dispose();
                this._innerBox = null;
                this._isDragging = null;
                this._spcvMouseSuppressor = null;
                this._dragStartMousePosition.Dispose();
                this._dragStartMousePosition = null;
                this._dragStartViewPosition.Dispose();
                this._dragStartViewPosition = null;
            };
            return SlidableBoxView;
        }(Views.BoxView));
        Views.SlidableBoxView = SlidableBoxView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/StuckerBoxViewEvents.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="BoxView.ts" />
/// <reference path="Property/Size.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Property = Fw.Views.Property;
        var ControlViewEvents = Fw.Events.ControlViewEvents;
        var StuckerBoxView = /** @class */ (function (_super) {
            __extends(StuckerBoxView, _super);
            function StuckerBoxView() {
                var _this = _super.call(this) || this;
                _this._scrollMargin = 0;
                _this._isChildRelocation = false;
                _this._isChildDragging = false;
                _this._isInnerDragging = false;
                _this._relocationTargetView = null;
                _this._dragStartMousePosition = new Property.Position();
                _this._dragStartViewPosition = new Property.Position();
                _this._innerBox = new Views.BoxView();
                _this._positionBarMax = new Views.LineView(Property.Direction.Vertical);
                _this._positionBarCurrent = new Views.LineView(Property.Direction.Vertical);
                _this._dummyView = new Fw.Views.BoxView();
                _this.SetClassName('StuckerBoxView');
                _this.Elem.addClass(_this.ClassName);
                _this._margin = 10;
                _this._referencePoint = Property.ReferencePoint.LeftTop;
                _this._scrollMargin = 0;
                _this._innerBox.HasBorder = false;
                _this._innerBox.SetTransAnimation(false);
                _this._innerBox.SetLeftTop(0, 0);
                _this._innerBox.BackgroundColor = 'transparent';
                _this.Elem.append(_this._innerBox.Elem);
                //super.Add(this._innerBox); // Addメソッドでthis.Childrenを呼ぶため循環参照になる。
                _this._positionBarMax.Position.Policy = Property.PositionPolicy.LeftTop;
                _this._positionBarMax.SetTransAnimation(false);
                _this._positionBarMax.Color = '#888888';
                _this._positionBarMax.SetParent(_this);
                _this.Elem.append(_this._positionBarMax.Elem);
                _this._positionBarCurrent.Position.Policy = Property.PositionPolicy.LeftTop;
                _this._positionBarCurrent.SetTransAnimation(false);
                _this._positionBarCurrent.Color = '#EEEEEE';
                _this._positionBarCurrent.SetParent(_this);
                _this.Elem.append(_this._positionBarCurrent.Elem);
                _this._backupView = null;
                _this._dummyView.Elem.addClass('Shadow');
                _this._dummyView.Position.Policy = Property.PositionPolicy.LeftTop;
                // 下に定義済みのメソッドをthisバインドしておく。
                _this.OnInnerMouseDown = _this.OnInnerMouseDown.bind(_this);
                _this.OnInnerMouseMove = _this.OnInnerMouseMove.bind(_this);
                _this.OnInnerMouseUp = _this.OnInnerMouseUp.bind(_this);
                _this.OnInnerSingleClick = _this.OnInnerSingleClick.bind(_this);
                _this.OnChildMouseDown = _this.OnChildMouseDown.bind(_this);
                _this.OnChildMouseMove = _this.OnChildMouseMove.bind(_this);
                _this.OnChildMouseUp = _this.OnChildMouseUp.bind(_this);
                _this._innerBox.Elem.on('touchstart mousedown', _this.OnInnerMouseDown);
                _this._innerBox.Elem.on('touchmove mousemove', _this.OnInnerMouseMove);
                _this._innerBox.Elem.on('touchend mouseup mouseout', _this.OnInnerMouseUp);
                _this._innerBox.Elem.on('click', _this.OnInnerSingleClick);
                return _this;
            }
            Object.defineProperty(StuckerBoxView.prototype, "Children", {
                get: function () {
                    return this._innerBox.Children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StuckerBoxView.prototype, "Margin", {
                get: function () {
                    return this._margin;
                },
                set: function (value) {
                    this._margin = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StuckerBoxView.prototype, "ReferencePoint", {
                get: function () {
                    return this._referencePoint;
                },
                set: function (value) {
                    this._referencePoint = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            StuckerBoxView.prototype.Add = function (view) {
                view.Position.Policy = Property.PositionPolicy.LeftTop;
                this._innerBox.Add(view);
                view.AddEventListener(ControlViewEvents.LongClick, this.OnChildLongClick, this);
                view.Elem.on('touchstart mousedown', this.OnChildMouseDown);
                view.Elem.on('touchmove mousemove', this.OnChildMouseMove);
                view.Elem.on('touchend mouseup', this.OnChildMouseUp);
            };
            StuckerBoxView.prototype.Remove = function (view) {
                this._innerBox.Remove(view);
                view.RemoveEventListener(ControlViewEvents.LongClick, this.OnChildLongClick);
                view.Elem.off('touchstart mousedown', this.OnChildMouseDown);
                view.Elem.off('touchmove mousemove', this.OnChildMouseMove);
                view.Elem.off('touchend mouseup', this.OnChildMouseUp);
            };
            // #region "上下スクロール"
            StuckerBoxView.prototype.OnInnerMouseDown = function (e) {
                //Dump.Log(`${this.ClassName}.OnInnerMouseDown`);
                if (this._isChildRelocation)
                    return;
                this._isInnerDragging = true;
                this._dragStartMousePosition.X = e.clientX;
                this._dragStartMousePosition.Y = e.clientY;
                this._dragStartViewPosition.X = this._innerBox.Position.Left;
                this._dragStartViewPosition.Y = this._innerBox.Position.Top;
                Fw.Root.Instance.SetTextSelection(false);
            };
            StuckerBoxView.prototype.OnInnerMouseMove = function (e) {
                if (this._isChildRelocation || !this._isInnerDragging || this._scrollMargin === 0)
                    return;
                // 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
                if (e.eventPhase !== 2)
                    return;
                var addY = e.clientY - this._dragStartMousePosition.Y;
                var top = this._dragStartViewPosition.Y + addY;
                var margin = this._scrollMargin * -1;
                if (top < margin)
                    top = margin;
                else if (0 < top)
                    top = 0;
                this._innerBox.Position.Top = top;
            };
            StuckerBoxView.prototype.OnInnerMouseUp = function (e) {
                //Dump.Log(`${this.ClassName}.OnInnerMouseUp`);
                if (this._isChildRelocation)
                    return;
                // 内部Viewドラッグ中のとき、ドラッグ終了処理。
                this._isInnerDragging = false;
                Fw.Root.Instance.SetTextSelection(true);
            };
            // #endregion "上下スクロール"
            // #region "子View再配置"
            /**
             * 子要素がロングクリックされたとき
             * @param e1
             */
            StuckerBoxView.prototype.OnChildLongClick = function (e) {
                //Dump.Log(`${this.ClassName}.OnChildLongClick`);
                this.StartRelocation();
            };
            StuckerBoxView.prototype.StartRelocation = function () {
                //Dump.Log(`${this.ClassName}.StartRelocation`);
                this._isChildRelocation = true;
                Fw.Root.Instance.SetTextSelection(false);
                _.each(this._innerBox.Children, function (v) {
                    v.Opacity = 0.7;
                    v.SuppressEvent(ControlViewEvents.SingleClick);
                    v.SuppressEvent(ControlViewEvents.LongClick);
                });
                this.Refresh();
            };
            /**
             * スタッカーBox自身がクリックされたとき
             * @param e1
             */
            StuckerBoxView.prototype.OnInnerSingleClick = function (e) {
                if (e.eventPhase !== 2)
                    return;
                //Dump.Log(`${this.ClassName}.OnSingleClick`);
                if (this._isChildRelocation) {
                    // 子要素再配置モードのとき、配置を確定させる。
                    this.CommitRelocation();
                }
            };
            StuckerBoxView.prototype.CommitRelocation = function () {
                //Dump.Log(`${this.ClassName}.CommitRelocation`);
                if (this._relocationTargetView) {
                    this.RestoreDummyView();
                    this._relocationTargetView.SetTransAnimation(true);
                    this._relocationTargetView = null;
                }
                this._isChildRelocation = false;
                Fw.Root.Instance.SetTextSelection(true);
                _.each(this._innerBox.Children, function (v) {
                    v.Opacity = 1.0;
                    v.ResumeEvent(ControlViewEvents.SingleClick);
                    v.ResumeEvent(ControlViewEvents.LongClick);
                });
                this.Refresh();
            };
            /**
             * 子要素上でマウスボタンが押されたとき
             * @param e
             */
            StuckerBoxView.prototype.OnChildMouseDown = function (e) {
                //Dump.Log(`${this.ClassName}.OnChildMouseDown`);
                if (!this._isChildRelocation)
                    return;
                var rect = this.Dom.getBoundingClientRect();
                var innerLeft = e.pageX - rect.left;
                var innerTop = e.pageY - rect.top + (this._innerBox.Position.Top * -1);
                var view = this.GetNearestByPosition(innerLeft, innerTop);
                if (view) {
                    //Dump.Log('OnChildMouseDown - view found: ' + (view as ButtonView).Label);
                    this._isChildDragging = true;
                    this._relocationTargetView = view;
                    this._dragStartMousePosition.X = e.pageX;
                    this._dragStartMousePosition.Y = e.pageY;
                    this._dragStartViewPosition.X = view.Position.Left;
                    this._dragStartViewPosition.Y = view.Position.Top;
                    this.SetDummyView(view);
                    view.SetTransAnimation(false);
                }
            };
            /**
             * 子要素上でマウスが動いたとき
             * @param e1
             */
            StuckerBoxView.prototype.OnChildMouseMove = function (e) {
                if (!this._isChildRelocation || !this._isChildDragging)
                    return;
                //Dump.Log(`${this.ClassName}.OnChildMouseMove`);
                var view = this._relocationTargetView;
                var addX = e.pageX - this._dragStartMousePosition.X;
                var addY = e.pageY - this._dragStartMousePosition.Y;
                view.Position.Left = this._dragStartViewPosition.X + addX;
                view.Position.Top = this._dragStartViewPosition.Y + addY;
                var replaceView = this.GetNearestByView(view);
                if (replaceView !== null && replaceView !== this._dummyView) {
                    this.Swap(replaceView, this._dummyView);
                }
            };
            /**
             * 子要素上でマウスボタンが離れたとき
             * @param e
             */
            StuckerBoxView.prototype.OnChildMouseUp = function (e) {
                //Dump.Log(`${this.ClassName}.OnChildMouseUp`);
                if (!this._isChildRelocation) {
                    this._isChildDragging = false;
                }
                else {
                    this._isChildDragging = false;
                    if (this._relocationTargetView) {
                        this._relocationTargetView.SetTransAnimation(true);
                        this._relocationTargetView = null;
                    }
                    this.RestoreDummyView();
                    this.Refresh();
                }
            };
            StuckerBoxView.prototype.Swap = function (view1, view2) {
                var view1Index = this._innerBox.Children.indexOf(view1);
                var view2Index = this._innerBox.Children.indexOf(view2);
                if (view1Index < 0)
                    throw new Error('Not contained view1');
                if (view2Index < 0)
                    throw new Error('Not contained view2');
                this._innerBox.Children[view1Index] = view2;
                this._innerBox.Children[view2Index] = view1;
            };
            StuckerBoxView.prototype.GetNearestByView = function (view) {
                var diff = Number.MAX_VALUE;
                var result = null;
                _.each(this._innerBox.Children, function (v) {
                    // 渡されたViewは対象外
                    if (v === view)
                        return;
                    var tmpDiff = Math.abs(v.Position.Left - view.Position.Left)
                        + Math.abs(v.Position.Top - view.Position.Top);
                    if (tmpDiff < diff) {
                        diff = tmpDiff;
                        result = v;
                    }
                });
                return result;
            };
            StuckerBoxView.prototype.GetNearestByPosition = function (x, y) {
                var _this = this;
                var diff = Number.MAX_VALUE;
                var result = null;
                _.each(this._innerBox.Children, function (v) {
                    // ダミーViewは対象外
                    if (v === _this._dummyView)
                        return;
                    var left = v.Position.Left + (v.Size.Width / 2);
                    var top = v.Position.Top + (v.Size.Height / 2);
                    var tmpDiff = Math.abs(left - x) + Math.abs(top - y);
                    if (tmpDiff < diff) {
                        diff = tmpDiff;
                        result = v;
                    }
                });
                return result;
            };
            StuckerBoxView.prototype.SetDummyView = function (view) {
                var _this = this;
                if (this._backupView)
                    this.RestoreDummyView();
                _.each(this._innerBox.Children, function (v, index) {
                    if (v === view) {
                        _this._backupView = v;
                        _this._innerBox.Children[index] = _this._dummyView;
                        _this._dummyView.Color = v.Color;
                        _this._dummyView.SetSize(v.Size.Width, v.Size.Height);
                    }
                });
                this._innerBox.Elem.append(this._dummyView.Elem);
            };
            StuckerBoxView.prototype.RestoreDummyView = function () {
                var _this = this;
                if (!this._backupView)
                    return;
                _.each(this._innerBox.Children, function (v, index) {
                    if (v === _this._dummyView)
                        _this._innerBox.Children[index] = _this._backupView;
                });
                this._backupView = null;
                this._dummyView.Elem.detach();
            };
            // #endregion "子View再配置"
            StuckerBoxView.prototype.InnerRefresh = function () {
                try {
                    //Dump.Log(`${this.ClassName}.InnerRefresh`);
                    this.SuppressLayout();
                    this._innerBox.SuppressLayout();
                    _.each(this._innerBox.Children, function (view) {
                        view.SuppressLayout();
                    });
                    this._innerBox.Size.Width = this.Size.Width;
                    this._innerBox.Size.Height = this.Size.Height;
                    // 先に描画領域を計算し、this._scrollMargin を得る。
                    switch (this._referencePoint) {
                        case Property.ReferencePoint.LeftTop:
                            this.InnerRefreshLeftTop(true);
                            break;
                        case Property.ReferencePoint.RightTop:
                            this.InnerRefreshRightTop(true);
                            break;
                        case Property.ReferencePoint.LeftBottom:
                            this.InnerRefreshLeftBottom(true);
                            break;
                        case Property.ReferencePoint.RightBottom:
                            this.InnerRefreshRightBottom(true);
                            break;
                        default:
                            throw new Error("ReferencePoint not found: " + this._referencePoint);
                    }
                    // this._scrollMargin の分だけ、内部Viewを広げる。
                    this._innerBox.Size.Height = this.Size.Height + Math.abs(this._scrollMargin);
                    // リサイズ後、過剰にスクロールしていた場合は戻す。
                    if ((this._scrollMargin * -1) > this._innerBox.Position.Top) {
                        this._innerBox.Position.Top = (this._scrollMargin * -1);
                    }
                    // 子Viewを配置する。
                    switch (this._referencePoint) {
                        case Property.ReferencePoint.LeftTop:
                            this.InnerRefreshLeftTop(false);
                            break;
                        case Property.ReferencePoint.RightTop:
                            this.InnerRefreshRightTop(false);
                            break;
                        case Property.ReferencePoint.LeftBottom:
                            this.InnerRefreshLeftBottom(false);
                            break;
                        case Property.ReferencePoint.RightBottom:
                            this.InnerRefreshRightBottom(false);
                            break;
                        default:
                            throw new Error("ReferencePoint not found: " + this._referencePoint);
                    }
                    this.InnerRefreshPositionLine();
                    _super.prototype.InnerRefresh.call(this);
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                    this._innerBox.ResumeLayout();
                    this._innerBox.Refresh();
                    _.each(this._innerBox.Children, function (view) {
                        view.ResumeLayout();
                        view.Refresh();
                    });
                    this._positionBarMax.Refresh();
                    this._positionBarCurrent.Refresh();
                    //Dump.Log(`${this.ClassName}.InnerRefresh-End`);
                }
            };
            StuckerBoxView.prototype.InnerRefreshLeftTop = function (calcScrollMargin) {
                var _this = this;
                var maxRight = this.Size.Width - this._margin;
                var currentLeft = this._margin;
                var currentTop = this._margin;
                var rowMaxHeight = 0;
                var rowElemCount = 0;
                _.each(this._innerBox.Children, function (view) {
                    var isOverWidth = (maxRight < (currentLeft + view.Size.Width));
                    if (isOverWidth && rowElemCount !== 0) {
                        // 表示幅を超え、かつ既にその行に要素が出力されているとき
                        // 改行後に要素を出力する。
                        currentTop += rowMaxHeight + _this._margin;
                        currentLeft = _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                    rowElemCount++;
                    if (!calcScrollMargin) {
                        view.Position.Left = currentLeft;
                        view.Position.Top = currentTop;
                    }
                    if (rowMaxHeight < view.Size.Height)
                        rowMaxHeight = view.Size.Height;
                    currentLeft += view.Size.Width + _this._margin;
                    if (isOverWidth && rowElemCount === 0) {
                        // 表示幅を超え、かつその行先頭要素のとき
                        // 要素を出力したあとで改行する。
                        currentLeft = _this._margin;
                        currentTop += rowMaxHeight + _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                });
                if (calcScrollMargin) {
                    var maxBotton = currentTop + rowMaxHeight + this._margin;
                    if (this.Size.Height < maxBotton) {
                        this._scrollMargin = maxBotton - this.Size.Height;
                    }
                    else {
                        this._scrollMargin = 0;
                    }
                }
            };
            StuckerBoxView.prototype.InnerRefreshRightTop = function (calcScrollMargin) {
                var _this = this;
                var minLeft = this._margin;
                var currentRight = this.Size.Width - this._margin;
                var currentTop = this._margin;
                var rowMaxHeight = 0;
                var rowElemCount = 0;
                _.each(this._innerBox.Children, function (view) {
                    var isOverWidth = ((currentRight - view.Size.Width) < minLeft);
                    if (isOverWidth && rowElemCount !== 0) {
                        // 表示幅を超え、かつ既にその行に要素が出力されているとき
                        // 改行後に要素を出力する。
                        currentTop += rowMaxHeight + _this._margin;
                        currentRight = _this.Size.Width - _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                    rowElemCount++;
                    if (!calcScrollMargin) {
                        view.Position.Left = currentRight - view.Size.Width;
                        view.Position.Top = currentTop;
                    }
                    if (rowMaxHeight < view.Size.Height)
                        rowMaxHeight = view.Size.Height;
                    currentRight -= view.Size.Width + _this._margin;
                    if (isOverWidth && rowElemCount === 0) {
                        // 表示幅を超え、かつその行先頭要素のとき
                        // 要素を出力したあとで改行する。
                        currentTop += rowMaxHeight + _this._margin;
                        currentRight = _this.Size.Width - _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                });
                if (calcScrollMargin) {
                    var maxBotton = currentTop + rowMaxHeight + this._margin;
                    if (this.Size.Height < maxBotton) {
                        this._scrollMargin = maxBotton - this.Size.Height;
                    }
                    else {
                        this._scrollMargin = 0;
                    }
                }
            };
            StuckerBoxView.prototype.InnerRefreshLeftBottom = function (calcScrollMargin) {
                var _this = this;
                var maxRight = this.Size.Width - this._margin;
                var currentLeft = this._margin;
                var currentBottom = (calcScrollMargin)
                    ? this.Size.Height - this._margin
                    : this._innerBox.Size.Height - this._margin;
                var rowMaxHeight = 0;
                var rowElemCount = 0;
                _.each(this._innerBox.Children, function (view) {
                    var isOverWidth = (maxRight < (currentLeft + view.Size.Width));
                    if (isOverWidth && rowElemCount !== 0) {
                        // 表示幅を超え、かつ既にその行に要素が出力されているとき
                        // 改行後に要素を出力する。
                        currentBottom -= rowMaxHeight + _this._margin;
                        currentLeft = _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                    rowElemCount++;
                    if (!calcScrollMargin) {
                        view.Position.Left = currentLeft;
                        view.Position.Top = currentBottom - view.Size.Height;
                    }
                    if (rowMaxHeight < view.Size.Height)
                        rowMaxHeight = view.Size.Height;
                    currentLeft += view.Size.Width + _this._margin;
                    if (isOverWidth && rowElemCount === 0) {
                        // 表示幅を超え、かつその行先頭要素のとき
                        // 要素を出力したあとで改行する。
                        currentBottom -= rowMaxHeight + _this._margin;
                        currentLeft = _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                });
                if (calcScrollMargin) {
                    var minTop = currentBottom - rowMaxHeight - this._margin;
                    if (minTop < 0) {
                        this._scrollMargin = minTop * -1;
                    }
                    else {
                        this._scrollMargin = 0;
                    }
                }
            };
            StuckerBoxView.prototype.InnerRefreshRightBottom = function (calcScrollMargin) {
                var _this = this;
                var minLeft = this._margin;
                var currentRight = this.Size.Width - this._margin;
                var currentBottom = (calcScrollMargin)
                    ? this.Size.Height - this._margin
                    : this._innerBox.Size.Height - this._margin;
                var rowMaxHeight = 0;
                var rowElemCount = 0;
                _.each(this._innerBox.Children, function (view) {
                    var isOverWidth = ((currentRight - view.Size.Width) < minLeft);
                    if (isOverWidth && rowElemCount !== 0) {
                        // 表示幅を超え、かつ既にその行に要素が出力されているとき
                        // 改行後に要素を出力する。
                        currentBottom -= rowMaxHeight + _this._margin;
                        currentRight = _this.Size.Width - _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                    rowElemCount++;
                    if (!calcScrollMargin) {
                        view.Position.Left = currentRight - view.Size.Width;
                        view.Position.Top = currentBottom - view.Size.Height;
                    }
                    if (rowMaxHeight < view.Size.Height)
                        rowMaxHeight = view.Size.Height;
                    currentRight -= view.Size.Width + _this._margin;
                    if (isOverWidth && rowElemCount === 0) {
                        // 表示幅を超え、かつその行先頭要素のとき
                        // 要素を出力したあとで改行する。
                        currentBottom -= rowMaxHeight + _this._margin;
                        currentRight = _this.Size.Width - _this._margin;
                        rowElemCount = 0;
                        rowMaxHeight = 0;
                    }
                });
                if (calcScrollMargin) {
                    var minTop = currentBottom - rowMaxHeight - this._margin;
                    if (minTop < 0) {
                        this._scrollMargin = minTop * -1;
                    }
                    else {
                        this._scrollMargin = 0;
                    }
                }
            };
            StuckerBoxView.prototype.InnerRefreshPositionLine = function () {
                switch (this._referencePoint) {
                    case Property.ReferencePoint.LeftTop:
                    case Property.ReferencePoint.LeftBottom:
                        this._positionBarMax.SetAnchor(this._margin, null, this._margin, this._margin);
                        this._positionBarCurrent.SetAnchor(null, null, this._margin, null);
                        break;
                    case Property.ReferencePoint.RightTop:
                    case Property.ReferencePoint.RightBottom:
                        this._positionBarMax.SetAnchor(this._margin, this._margin, null, this._margin);
                        this._positionBarCurrent.SetAnchor(null, this._margin, null, null);
                        break;
                    default:
                        throw new Error("ReferencePoint not found: " + this._referencePoint);
                }
                this._positionBarMax.Length = this.Size.Height - (this._margin * 2);
                this._positionBarCurrent.Length
                    = this._positionBarMax.Length
                        * (this.Size.Height / this._innerBox.Size.Height);
                var maxTop = this._innerBox.Size.Height - this.Size.Height;
                var currentTop = this._innerBox.Position.Top;
                var posRate = (maxTop === 0)
                    ? 1
                    : currentTop / maxTop;
                var topLength = this._positionBarMax.Length - this._positionBarCurrent.Length;
                this._positionBarCurrent.Position.Top = this._margin - (topLength * posRate);
            };
            StuckerBoxView.prototype.Dispose = function () {
                this._innerBox.Elem.off('touchstart mousedown');
                this._innerBox.Elem.off('touchmove mousemove');
                this._innerBox.Elem.off('touchend mouseup mouseout');
                _super.prototype.Dispose.call(this);
                this._margin = null;
            };
            return StuckerBoxView;
        }(Views.BoxView));
        Views.StuckerBoxView = StuckerBoxView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ControlView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Dump = Fw.Util.Dump;
        var Events = Fw.Events.ControlViewEvents;
        var ToggleButtonView = /** @class */ (function (_super) {
            __extends(ToggleButtonView, _super);
            function ToggleButtonView() {
                var _this = _super.call(this) || this;
                _this.HoverColor = '';
                _this._value = false;
                _this._sliderBox = new Views.BoxView();
                _this._notch = new Views.BoxView();
                _this._maskOn = new Views.BoxView();
                _this._value = false;
                _this._overMargin = 5;
                _this.SetClassName('ToggleButtonView');
                _this.Elem.addClass(_this.ClassName);
                // 標準サイズ：50 x 20
                var width = 50;
                var height = 20;
                _this.HasBorder = false;
                _this.SetSize(width, height);
                _this._sliderBox.Size.Width = _this.Size.Width - _this._overMargin;
                _this._sliderBox.Size.Height = _this.Size.Height - _this._overMargin;
                _this._sliderBox.HasBorder = true;
                _this._sliderBox.BorderRadius = 15;
                _this._sliderBox.Color = '#e5e5e5';
                _this._sliderBox.BackgroundColor = '#FFFFFF';
                _this._sliderBox.Dom.style.overflow = 'hidden';
                _this.Add(_this._sliderBox);
                _this._maskOn.Size.Width = _this.Size.Width - _this._overMargin;
                _this._maskOn.Size.Height = _this.Size.Height - _this._overMargin;
                _this._maskOn.HasBorder = false;
                _this._maskOn.BorderRadius = 15;
                _this._maskOn.BackgroundColor = '#4e748b';
                _this._maskOn.Position.X = -(_this.Size.Width - _this._overMargin);
                _this._sliderBox.Add(_this._maskOn);
                _this._notch.SetSize(_this.Size.Height, _this.Size.Height);
                _this._notch.HasBorder = true;
                _this._notch.BorderRadius = 50;
                _this._notch.Color = '#e5e5e5';
                _this._notch.BackgroundColor = '#cfcfcf';
                _this._notch.Position.X = -(_this.Size.Width / 2) + (_this.Size.Height / 2);
                _this.Add(_this._notch);
                _this.Elem.hover(function () {
                    //this.Dom.style.backgroundColor = this.HoverColor;
                    _this.SetStyle('backgroundColor', _this.HoverColor);
                    _this.Refresh();
                }, function () {
                    //this.Dom.style.backgroundColor = this.BackgroundColor;
                    _this.SetStyle('backgroundColor', _this.BackgroundColor);
                    _this.Refresh();
                });
                _this.AddEventListener(Events.SingleClick, function () {
                    _this._value = !_this._value;
                    _this.Refresh();
                });
                return _this;
            }
            Object.defineProperty(ToggleButtonView.prototype, "Value", {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    var changed = (this._value !== value);
                    if (changed)
                        this._value = !this._value;
                },
                enumerable: true,
                configurable: true
            });
            //private SwitchToOn(): void {
            //}
            //private SwitchToOff(): void {
            //}
            ToggleButtonView.prototype.InnerRefresh = function () {
                try {
                    this.SuppressLayout();
                    this._sliderBox.Size.Width = this.Size.Width - this._overMargin;
                    this._sliderBox.Size.Height = this.Size.Height - this._overMargin;
                    this._maskOn.Size.Width = this.Size.Width - this._overMargin;
                    this._maskOn.Size.Height = this.Size.Height - this._overMargin;
                    this._notch.SetSize(this.Size.Height, this.Size.Height);
                    this._notch.Position.X = (this.Value)
                        ? (this.Size.Width / 2) - (this.Size.Height / 2)
                        : -(this.Size.Width / 2) + (this.Size.Height / 2);
                    this._maskOn.Position.X = (this.Value)
                        ? 0
                        : -(this.Size.Width - this._overMargin);
                    _super.prototype.InnerRefresh.call(this);
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeLayout();
                }
            };
            ToggleButtonView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this.HoverColor = null;
            };
            return ToggleButtonView;
        }(Views.ControlView));
        Views.ToggleButtonView = ToggleButtonView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Events/RootEvents.ts" />
/// <reference path="Util/Dump.ts" />
/// <reference path="Views/Property/Size.ts" />
var Fw;
(function (Fw) {
    var Dump = Fw.Util.Dump;
    var Events = Fw.Events.RootEvents;
    var Property = Fw.Views.Property;
    var Root = /** @class */ (function (_super) {
        __extends(Root, _super);
        function Root(jqueryElem) {
            var _this = _super.call(this) || this;
            _this._viewRefreshInterval = 100;
            /**
             * @description ページ生成開始から一定時間、ViewのDom更新頻度を大幅に下げる。
             */
            _this._lastInitializeTimer = null;
            _this._releaseInitializeTimer = null;
            _this.SetElem(jqueryElem);
            _this.SetClassName('Root');
            _this._size = new Property.Size();
            _this._size.Width = _this.Elem.width();
            _this._size.Height = _this.Elem.height();
            _this._dom = jqueryElem.get(0);
            _this._masked = false;
            var $window = $(window);
            $window.on('resize', function () {
                _this.Refresh();
                _this.DispatchEvent(Events.Resized);
            });
            // Root.Init()の終了後にViewBaseからFw.Root.Instanceを呼び出す。
            _.defer(function () {
                _this._mask = new Fw.Views.BoxView();
                _this._mask.Elem.removeClass('TransAnimation');
                _this._mask.Elem.addClass('RootMask');
                _this._mask.HasBorder = false;
                _this._mask.BackgroundColor = '#000000';
                _this._mask.ZIndex = -1;
                // IViewでないので、this.Addは出来ない。
                _this.Elem.append(_this._mask.Elem);
                _this._mask.Elem.on('click touchend', function () {
                    _this.DispatchEvent(Events.MaskClicked);
                });
                _this.Refresh();
            });
            return _this;
        }
        Object.defineProperty(Root, "Instance", {
            get: function () {
                if (!Root._instance) {
                    throw new Error('Root.Init() has not been executed.');
                }
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
        Root.prototype.Mask = function () {
            //Dump.Log(`${this.ClassName}.Mask`);
            this._masked = true;
            this.Refresh();
        };
        Root.prototype.UnMask = function () {
            //Dump.Log(`${this.ClassName}.UnMask`);
            this._masked = false;
            this.Refresh();
        };
        Root.prototype.SetTextSelection = function (enable) {
            if (enable && this.Elem.hasClass('TextUnselect'))
                this.Elem.removeClass('TextUnselect');
            else if (!enable && !this.Elem.hasClass('TextUnselect'))
                this.Elem.addClass('TextUnselect');
        };
        Object.defineProperty(Root.prototype, "ViewRefreshInterval", {
            get: function () {
                return this._viewRefreshInterval;
            },
            enumerable: true,
            configurable: true
        });
        Root.prototype.StartPageInitialize = function () {
            if (this._lastInitializeTimer != null) {
                clearTimeout(this._lastInitializeTimer);
                this._lastInitializeTimer = null;
            }
            // 最長5秒間、ViewのDom更新を抑止する。
            this._viewRefreshInterval = 800;
            //Dump.Log('Root.StartPageInitialize');
            //this._lastInitializeTimer = setTimeout(() => {
            //    this._viewRefreshInterval = 100;
            //}, 5000);
        };
        Root.prototype.ReleasePageInitialize = function () {
            var _this = this;
            if (this._viewRefreshInterval <= 100)
                return;
            //Dump.Log('Root.ReleasePageInitialize');
            if (this._releaseInitializeTimer != null) {
                clearTimeout(this._releaseInitializeTimer);
            }
            this._releaseInitializeTimer = setTimeout(function () {
                _this._viewRefreshInterval = 100;
                Dump.Log('Root.ReleasePageInitialize - Released');
            }, 300);
        };
        Root.prototype.Refresh = function () {
            // this.Sizeのセッターが無いので、フィールドに直接書き込む。
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();
            if (this._mask) {
                this._mask.SetSize(this._size.Width, this._size.Height);
                if (this._masked) {
                    this._mask.ZIndex = 0;
                    this._mask.Opacity = 0.4;
                }
                else {
                    this._mask.ZIndex = -1;
                    this._mask.Opacity = 0.0;
                }
            }
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
//# sourceMappingURL=tsout.js.map