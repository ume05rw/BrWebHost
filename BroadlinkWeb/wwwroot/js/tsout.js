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
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/IView.ts" />
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./IController.ts" />
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
/// <reference path="./Factory.ts" />
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
/// <reference path="../Fw/Controllers/Manager.ts" />
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
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/IView.ts" />
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
/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/IView.ts" />
/// <reference path="./Params.ts" />
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
            }
            return ViewEventsClass;
        }());
        Events.ViewEventsClass = ViewEventsClass;
        Events.ViewEvents = new ViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/Animation/Animator.ts" />
/// <reference path="../../Fw/Views/Animation/Params.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.ViewEvents;
        var ViewBase = /** @class */ (function () {
            function ViewBase(jqueryElem) {
                // events
                this.EventShown = new Event(Events.Shown);
                this.EventHidden = new Event(Events.Hidden);
                // Properties with set/get
                this._x = 0;
                this._y = 0;
                this._width = 0;
                this._height = 0;
                this._isAnchorTop = false;
                this._isAnchorLeft = false;
                this._isAnchorRight = false;
                this._isAnchorBottom = false;
                this._anchorMarginTop = 0;
                this._anchorMarginLeft = 0;
                this._anchorMarginRight = 0;
                this._anchorMarginBottom = 0;
                this._color = '000000';
                this._backgroundColor = 'FFFFFF';
                this.Children = new Array();
                this.Elem = jqueryElem;
                this.Dom = jqueryElem.get(0);
                this.Init();
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
                set: function (value) {
                    this._height = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "IsAnchorTop", {
                get: function () {
                    return this._isAnchorTop;
                },
                set: function (value) {
                    this._isAnchorTop = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "IsAnchorLeft", {
                get: function () {
                    return this._isAnchorLeft;
                },
                set: function (value) {
                    this._isAnchorLeft = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "IsAnchorRight", {
                get: function () {
                    return this._isAnchorRight;
                },
                set: function (value) {
                    this._isAnchorRight = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "IsAnchorBottom", {
                get: function () {
                    return this._isAnchorBottom;
                },
                set: function (value) {
                    this._isAnchorBottom = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "AnchorMarginTop", {
                get: function () {
                    return this._anchorMarginTop;
                },
                set: function (value) {
                    this._anchorMarginTop = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "AnchorMarginLeft", {
                get: function () {
                    return this._anchorMarginLeft;
                },
                set: function (value) {
                    this._anchorMarginLeft = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "AnchorMarginRight", {
                get: function () {
                    return this._anchorMarginRight;
                },
                set: function (value) {
                    this._anchorMarginRight = value;
                    this.Refresh();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBase.prototype, "AnchorMarginBottom", {
                get: function () {
                    return this._anchorMarginBottom;
                },
                set: function (value) {
                    this._anchorMarginBottom = value;
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
            ViewBase.prototype.Init = function () {
                this._width = this.Elem.width();
                this._height = this.Elem.height();
                this._x = 0;
                this._y = 0;
                this._color = '000000';
                this.Elem.addClass('IView');
                this.IsVisible()
                    ? this.Dom.dispatchEvent(this.EventShown)
                    : this.Dom.dispatchEvent(this.EventHidden);
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
            ViewBase.prototype.SetAnchor = function (top, left, right, bottom) {
                if (_.isNumber(top)) {
                    this._isAnchorTop = true;
                    this._anchorMarginTop = top;
                }
                else {
                    this._isAnchorTop = false;
                }
                if (_.isNumber(left)) {
                    this._isAnchorLeft = true;
                    this._anchorMarginLeft = left;
                }
                else {
                    this._isAnchorLeft = false;
                }
                if (_.isNumber(right)) {
                    this._isAnchorRight = true;
                    this._anchorMarginRight = right;
                }
                else {
                    this._isAnchorRight = false;
                }
                if (_.isNumber(bottom)) {
                    this._isAnchorBottom = true;
                    this._anchorMarginBottom = bottom;
                }
                else {
                    this._isAnchorBottom = false;
                }
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
                var _this = this;
                if (duration === void 0) { duration = 200; }
                if (this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetResized(this, 0.8);
                animator.FromParams.Opacity = 0;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = function () {
                    _this.Dom.style.display = "block";
                    _this.Refresh();
                    _this.Dom.dispatchEvent(_this.EventShown);
                };
                animator.Invoke(duration);
            };
            ViewBase.prototype.Hide = function (duration) {
                var _this = this;
                if (duration === void 0) { duration = 200; }
                if (!this.IsVisible())
                    return;
                var animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetResized(this, 0.8);
                animator.ToParams.Opacity = 0.0;
                animator.OnComplete = function () {
                    _this.Dom.style.display = "none";
                    _this.Refresh();
                    _this.Dom.dispatchEvent(_this.EventHidden);
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
                }
                this._lastRefreshTimer = setTimeout(function () {
                    _this.InnerRefresh();
                }, 10);
            };
            ViewBase.prototype.InnerRefresh = function () {
                var parent = $(this.Elem.parent());
                if (!parent)
                    return;
                var parentWidth = parent.width();
                var parentHeight = parent.height();
                var centerLeft = (parentWidth / 2);
                var centerTop = (parentHeight / 2);
                if (this.IsAnchorLeft && this.IsAnchorRight) {
                    this._width = parentWidth - this.AnchorMarginLeft - this.AnchorMarginRight;
                    this._x = this.AnchorMarginLeft - centerLeft + (this._width / 2);
                }
                else {
                    this._width = _.isNumber(this._width)
                        ? this._width
                        : 30;
                    if (this.IsAnchorLeft) {
                        this._x = this.AnchorMarginLeft - centerLeft + (this._width / 2);
                    }
                    else if (this.IsAnchorRight) {
                        var left = parentWidth - this.AnchorMarginRight - this._width;
                        this._x = left - centerLeft + (this._width / 2);
                    }
                }
                if (this.IsAnchorTop && this._isAnchorBottom) {
                    this._height = parentHeight - this.AnchorMarginTop - this.AnchorMarginBottom;
                    this._y = this.AnchorMarginTop - centerTop + (this._height / 2);
                }
                else {
                    this._height = _.isNumber(this._height)
                        ? this._height
                        : 30;
                    if (this.IsAnchorTop) {
                        this._y = this.AnchorMarginTop - centerTop + (this._height / 2);
                    }
                    else if (this.IsAnchorBottom) {
                        var top_1 = parentHeight - this.AnchorMarginBottom - this._height;
                        this._y = top_1 - centerTop + (this._height / 2);
                    }
                }
                var elemLeft = centerLeft + this._x - (this.Width / 2);
                var elemTop = centerTop + this._y - (this.Height / 2);
                this.Dom.style.left = elemLeft + "px";
                this.Dom.style.top = elemTop + "px";
                this.Dom.style.width = this._width + "px";
                this.Dom.style.height = this._height + "px";
                this.Dom.style.color = "#" + this._color;
                this.Dom.style.backgroundColor = "#" + this._backgroundColor;
            };
            ViewBase.prototype.AddEventListener = function (name, listener) {
                this.Dom.addEventListener(name, listener, false);
            };
            ViewBase.prototype.Dispose = function () {
                _.each(this.Children, function (view) {
                    view.Dispose();
                });
                this.Children = null;
                this.Elem.remove();
                this.Elem = null;
                this.EventShown = null;
                this.EventHidden = null;
            };
            return ViewBase;
        }());
        Views.ViewBase = ViewBase;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/Animation/Animator.ts" />
/// <reference path="../../Fw/Views/Animation/Params.ts" />
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
                    _this.Dom.style.display = "block";
                    _this.Refresh();
                    _this.Dom.dispatchEvent(_this.EventShown);
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
                    _this.Dom.dispatchEvent(_this.EventHidden);
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
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/IController.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Views/PageView.ts" />
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
                var tmpCtl = new Fw.Views.ControlView();
                tmpCtl.SetDisplayParams(-100, -100, 200, 200, '666666');
                tmpCtl.Label = 'くりっく';
                tmpCtl.AddEventListener(Fw.Events.ControlEvents.SingleClick, function () {
                    console.log('LONG CLICK!!');
                    if (_this._centerControl.IsVisible()) {
                        console.log('みえてんで！');
                        _this._centerControl.Hide();
                    }
                    else {
                        console.log('みえへんで...？');
                        _this._centerControl.Show();
                    }
                });
                this.View.Add(tmpCtl);
                this.View.AddEventListener(Fw.Events.PageEvents.Shown, function () {
                    console.log('MainView.Shown');
                });
                var ancCtl1 = new Fw.Views.ControlView();
                ancCtl1.Label = '右下';
                ancCtl1.Width = 100;
                ancCtl1.Height = 30;
                ancCtl1.SetAnchor(null, null, 40, 5);
                this.View.Add(ancCtl1);
                var ancCtl2 = new Fw.Views.ControlView();
                ancCtl2.Label = '右上';
                ancCtl2.Width = 200;
                ancCtl2.Height = 50;
                ancCtl2.SetAnchor(3, null, 3, null);
                this.View.Add(ancCtl2);
                var ancCtl3 = new Fw.Views.ControlView();
                ancCtl3.Label = '左下';
                ancCtl3.Width = 200;
                ancCtl3.Height = 50;
                ancCtl3.SetAnchor(null, 3, null, 3);
                this.View.Add(ancCtl3);
                var ancCtl4 = new Fw.Views.ControlView();
                ancCtl4.Label = '左上';
                ancCtl4.Width = 200;
                ancCtl4.Height = 50;
                ancCtl4.SetAnchor(60, 3, null, null);
                this.View.Add(ancCtl4);
                var ancCtl5 = new Fw.Views.ControlView();
                ancCtl5.Label = '左右';
                ancCtl5.Height = 50;
                ancCtl5.SetAnchor(null, 150, 300, 100);
                this.View.Add(ancCtl5);
                var ancCtl6 = new Fw.Views.ControlView();
                ancCtl6.Label = '上下';
                ancCtl6.SetAnchor(200, null, null, 40);
                ancCtl6.Width = 30;
                this.View.Add(ancCtl6);
            };
            return MainController;
        }(Fw.Controllers.ControllerBase));
        Controllers.MainController = MainController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
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
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var ControlEventsClass = /** @class */ (function (_super) {
            __extends(ControlEventsClass, _super);
            function ControlEventsClass() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.SingleClick = 'SingleClick';
                _this.LongClick = 'LongClick';
                return _this;
            }
            return ControlEventsClass;
        }(Events.ViewEventsClass));
        Events.ControlEventsClass = ControlEventsClass;
        Events.ControlEvents = new ControlEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Util/Xhr/Params.ts" />
/// <reference path="../../Fw/Util/Xhr/MethodType.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Xhr = Fw.Util.Xhr;
        var Events = Fw.Events;
        var Sub1Controller = /** @class */ (function (_super) {
            __extends(Sub1Controller, _super);
            function Sub1Controller(elem, manager) {
                var _this = _super.call(this, elem, manager) || this;
                _this.Init();
                return _this;
            }
            Sub1Controller.prototype.Init = function () {
                var _this = this;
                var header = new Fw.Views.ControlView();
                header.Label = 'ヘッダ';
                header.Height = 50;
                header.SetAnchor(0, 0, 0, null);
                header.BackgroundColor = '555555';
                header.Color = 'FFFFFF';
                header.HasBorder = false;
                header.BorderRadius = 0;
                this.View.Add(header);
                var back = new Fw.Views.ControlView();
                back.Width = 40;
                back.Height = 40;
                back.Label = '戻る';
                back.SetAnchor(null, null, 5, null);
                back.AddEventListener(Events.ControlEvents.SingleClick, function () {
                    _this.Manager.Show("Main");
                });
                header.Add(back);
                var devices = new Fw.Views.ControlView();
                devices.SetDisplayParams(0, -200, 60, 60, '8844FF');
                devices.Label = 'デバイス走査';
                devices.AddEventListener(Events.ControlEvents.SingleClick, function () {
                    var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                    params.Callback = function (data) {
                        console.log('Disover:');
                        console.log(data);
                    };
                    Xhr.Query.Invoke(params);
                });
                this.View.Add(devices);
            };
            return Sub1Controller;
        }(Fw.Controllers.ControllerBase));
        Controllers.Sub1Controller = Sub1Controller;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Xhr/Params.ts" />
/// <reference path="../../Fw/Util/Xhr/MethodType.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />
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
/// <reference path="./ViewEvents.ts" />
var Fw;
(function (Fw) {
    var Events;
    (function (Events) {
        var PageEventsClass = /** @class */ (function (_super) {
            __extends(PageEventsClass, _super);
            function PageEventsClass() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return PageEventsClass;
        }(Events.ViewEventsClass));
        Events.PageEventsClass = PageEventsClass;
        Events.PageEvents = new PageEventsClass();
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
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ViewBase.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ControlEvents;
        var ControlView = /** @class */ (function (_super) {
            __extends(ControlView, _super);
            function ControlView() {
                var _this = _super.call(this, $('<div></div>')) || this;
                // events
                _this.EventSingleClick = new Event(Events.SingleClick);
                _this.EventLongClick = new Event(Events.LongClick);
                _this._tapEventTimer = null;
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
                    if (isNaN(value) || value === null || value === undefined)
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
                // プロパティsetterを一度通しておく。
                this.HasBorder = true;
                this.BorderRadius = 5;
                this.Elem.addClass('ControlView');
                this._label = $('<span class="ControlViewProperty"></span>');
                this.Elem.append(this._label);
                this.Elem.bind('touchstart mousedown', function (e) {
                    if (_this._tapEventTimer != null)
                        clearTimeout(_this._tapEventTimer);
                    _this._tapEventTimer = setTimeout(function () {
                        // ロングタップイベント
                        _this._tapEventTimer = null;
                        //console.log('longtapped');
                        _this.Dom.dispatchEvent(_this.EventLongClick);
                    }, 1000);
                    e.preventDefault();
                });
                this.Elem.bind('touchend mouseup', function (e) {
                    if (_this._tapEventTimer != null) {
                        // ロングタップ検出中のとき
                        clearTimeout(_this._tapEventTimer);
                        _this._tapEventTimer = null;
                        // 以降、シングルタップイベント処理
                        //console.log('singletapped');
                        _this.Dom.dispatchEvent(_this.EventSingleClick);
                    }
                    else {
                    }
                    e.preventDefault();
                });
                this.Elem.bind('mouseout', function (e) {
                    if (_this._tapEventTimer != null) {
                        // ロングタップ検出中のとき
                        clearTimeout(_this._tapEventTimer);
                        _this._tapEventTimer = null;
                        //console.log('tap canceled');
                    }
                    e.preventDefault();
                });
            };
            ControlView.prototype.InnerRefresh = function () {
                _super.prototype.InnerRefresh.call(this);
                this.Dom.style.borderColor = "#" + this.Color;
            };
            ControlView.prototype.Dispose = function () {
                this.EventSingleClick = null;
                this.EventLongClick = null;
                this._label = null;
                this._tapEventTimer = null;
                _super.prototype.Dispose.call(this);
            };
            return ControlView;
        }(Views.ViewBase));
        Views.ControlView = ControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=tsout.js.map