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
                    var fromX = this._view.Position.X + this.FromParams.X;
                    var fromY = this._view.Position.Y + this.FromParams.Y;
                    var fromLeft = centerLeft + fromX - (this.FromParams.Width / 2);
                    var fromTop = centerTop + fromY - (this.FromParams.Height / 2);
                    var toX = this._view.Position.X + this.ToParams.X;
                    var toY = this._view.Position.Y + this.ToParams.Y;
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
                this.Attached = 'Attached';
                this.Detached = 'Detached';
                this.SizeChanged = 'SizeChanged';
                this.PositionChanged = 'PositionChanged';
                this.AnchorChanged = 'AnchorChanged';
            }
            return ViewEventsClass;
        }());
        Events.ViewEventsClass = ViewEventsClass;
        Events.ViewEvents = new ViewEventsClass();
    })(Events = Fw.Events || (Fw.Events = {}));
})(Fw || (Fw = {}));
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
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
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
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ViewEvents;
        var Number = Fw.Util.Number;
        var Size = /** @class */ (function () {
            function Size(view) {
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
                    if (changed)
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
                    if (changed)
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
        Views.Size = Size;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/Animation/Animator.ts" />
/// <reference path="../../Fw/Views/Animation/Params.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="./Size.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Anim = Fw.Views.Animation;
        var Events = Fw.Events.ViewEvents;
        var Dump = Fw.Util.Dump;
        var ViewBase = /** @class */ (function () {
            function ViewBase(jqueryElem) {
                this._suppressedEvents = new Array();
                this._color = '#000000';
                this._backgroundColor = '#FFFFFF';
                this.Children = new Array();
                this.Elem = jqueryElem;
                this.Dom = jqueryElem.get(0);
                this.Init();
            }
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
            ViewBase.prototype.Init = function () {
                this._size = new Views.Size(this);
                this._position = new Views.Position(this);
                this._anchor = new Views.Anchor(this);
                this._size.Width = this.Elem.width();
                this._size.Height = this.Elem.height();
                this._color = '#000000';
                this.Elem.addClass('IView');
                this.IsVisible()
                    ? this.DispatchEvent(Events.Shown)
                    : this.DispatchEvent(Events.Hidden);
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
                    this.Children.push(view);
                    this.Elem.append(view.Elem);
                    view.Refresh();
                    view.DispatchEvent(Events.Attached);
                }
            };
            ViewBase.prototype.Remove = function (view) {
                var index = this.Children.indexOf(view);
                if (index != -1) {
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
                animator.ToParams = Anim.Params.GetCurrent(this);
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
                animator.FromParams = Anim.Params.GetCurrent(this);
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
                }
                this._lastRefreshTimer = setTimeout(function () {
                    _this.InnerRefresh();
                }, 10);
            };
            ViewBase.prototype.InnerRefresh = function () {
                try {
                    var parent_1 = $(this.Elem.parent());
                    if (!parent_1)
                        return;
                    this.SuppressEvent(Events.SizeChanged);
                    this.SuppressEvent(Events.PositionChanged);
                    var parentWidth = parent_1.width();
                    var parentHeight = parent_1.height();
                    var centerLeft = (parentWidth / 2);
                    var centerTop = (parentHeight / 2);
                    if (this.Anchor.IsAnchoredLeft && this.Anchor.IsAnchoredRight) {
                        this.Size.Width = parentWidth - this.Anchor.MarginLeft - this.Anchor.MarginRight;
                        this.Position.X = this.Anchor.MarginLeft - centerLeft + (this.Size.Width / 2);
                    }
                    else {
                        this.Size.Width = _.isNumber(this.Size.Width)
                            ? this.Size.Width
                            : 30;
                        if (this.Anchor.IsAnchoredLeft) {
                            this.Position.X = this.Anchor.MarginLeft - centerLeft + (this.Size.Width / 2);
                        }
                        else if (this.Anchor.IsAnchoredRight) {
                            var left = parentWidth - this.Anchor.MarginRight - this.Size.Width;
                            this.Position.X = left - centerLeft + (this.Size.Width / 2);
                        }
                    }
                    if (this.Anchor.IsAnchoredTop && this.Anchor.IsAnchoredBottom) {
                        this.Size.Height = parentHeight - this.Anchor.MarginTop - this.Anchor.MarginBottom;
                        this.Position.Y = this.Anchor.MarginTop - centerTop + (this.Size.Height / 2);
                    }
                    else {
                        this.Size.Height = _.isNumber(this.Size.Height)
                            ? this.Size.Height
                            : 30;
                        if (this.Anchor.IsAnchoredTop) {
                            this.Position.Y = this.Anchor.MarginTop - centerTop + (this.Size.Height / 2);
                        }
                        else if (this.Anchor.IsAnchoredBottom) {
                            var top_1 = parentHeight - this.Anchor.MarginBottom - this.Size.Height;
                            this.Position.Y = top_1 - centerTop + (this.Size.Height / 2);
                        }
                    }
                    var elemLeft = centerLeft + this.Position.X - (this.Size.Width / 2);
                    var elemTop = centerTop + this.Position.Y - (this.Size.Height / 2);
                    this.Dom.style.left = elemLeft + "px";
                    this.Dom.style.top = elemTop + "px";
                    this.Dom.style.width = this.Size.Width + "px";
                    this.Dom.style.height = this.Size.Height + "px";
                    this.Dom.style.color = "" + this._color;
                    this.Dom.style.backgroundColor = "" + this._backgroundColor;
                }
                catch (e) {
                    Dump.ErrorLog(e);
                }
                finally {
                    this.ResumeEvent(Events.SizeChanged);
                    this.ResumeEvent(Events.PositionChanged);
                }
            };
            ViewBase.prototype.AddEventListener = function (name, handler) {
                this.Elem.bind(name, handler);
            };
            ViewBase.prototype.DispatchEvent = function (name) {
                if (this.IsSuppressedEvent(name))
                    return;
                this.Elem.trigger(name);
            };
            ViewBase.prototype.SuppressEvent = function (name) {
                if (this.IsSuppressedEvent(name))
                    return;
                this._suppressedEvents.push(name);
            };
            ViewBase.prototype.IsSuppressedEvent = function (name) {
                return (this._suppressedEvents.indexOf(name) !== -1);
            };
            ViewBase.prototype.ResumeEvent = function (name) {
                if (this.IsSuppressedEvent(name))
                    return;
                var idx = this._suppressedEvents.indexOf(name);
                this._suppressedEvents.splice(idx, 1);
            };
            ViewBase.prototype.Dispose = function () {
                _.each(this.Children, function (view) {
                    view.Dispose();
                });
                this.Children = null;
                this.Elem.remove();
                this.Elem = null;
                this._size.Dispose();
                this._position.Dispose();
                this._anchor.Dispose();
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
        var Events = Fw.Events.ViewEvents;
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
                    _this.DispatchEvent(Events.Shown);
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
                ancCtl1.Size.Width = 100;
                ancCtl1.Size.Height = 30;
                ancCtl1.SetAnchor(null, null, 40, 5);
                this.View.Add(ancCtl1);
                var ancCtl2 = new Fw.Views.ControlView();
                ancCtl2.Label = '右上';
                ancCtl2.Size.Width = 200;
                ancCtl2.Size.Height = 50;
                ancCtl2.SetAnchor(3, null, 3, null);
                this.View.Add(ancCtl2);
                var ancCtl3 = new Fw.Views.ControlView();
                ancCtl3.Label = '左下';
                ancCtl3.Size.Width = 200;
                ancCtl3.Size.Height = 50;
                ancCtl3.SetAnchor(null, 3, null, 3);
                this.View.Add(ancCtl3);
                var ancCtl4 = new Fw.Views.ControlView();
                ancCtl4.Label = '左上';
                ancCtl4.Size.Width = 200;
                ancCtl4.Size.Height = 50;
                ancCtl4.SetAnchor(60, 3, null, null);
                this.View.Add(ancCtl4);
                var ancCtl5 = new Fw.Views.ControlView();
                ancCtl5.Label = '左右';
                ancCtl5.Size.Height = 50;
                ancCtl5.SetAnchor(null, 150, 300, 100);
                this.View.Add(ancCtl5);
                var ancCtl6 = new Fw.Views.ControlView();
                ancCtl6.Label = '上下';
                ancCtl6.SetAnchor(200, null, null, 40);
                ancCtl6.Size.Width = 30;
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
                back.AddEventListener(Events.ControlEvents.SingleClick, function () {
                    _this.Manager.Show("Main");
                });
                header.Add(back);
                var devices = new Fw.Views.ControlView();
                devices.SetPosition(0, -200);
                devices.SetSize(60, 60);
                devices.Color = '#8844FF';
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
                var btnMove = new Fw.Views.RelocatableControlView();
                btnMove.SetDisplayParams(60, 60, 0, -200, '#1188FF');
                btnMove.BackgroundColor = '#FF9900';
                btnMove.Label = '動く？';
                btnMove.AddEventListener(Events.ControlEvents.SingleClick, function () {
                    console.log('btnMove.SingleClick');
                });
                this.View.Add(btnMove);
                var btnReset = new Fw.Views.ControlView();
                btnReset.SetDisplayParams(60, 60, 0, 0, '#1188FF');
                btnReset.SetAnchor(5, null, 5, null);
                btnReset.Label = 'リセット';
                btnReset.AddEventListener(Events.ControlEvents.SingleClick, function () {
                    console.log('btnReset.SingleClick');
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
        var Number = Fw.Util.Number;
        var ControlView = /** @class */ (function (_super) {
            __extends(ControlView, _super);
            function ControlView() {
                var _this = _super.call(this, $('<div></div>')) || this;
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
                        _this.DispatchEvent(Events.LongClick);
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
                        _this.DispatchEvent(Events.SingleClick);
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
                this.Dom.style.borderColor = "" + this.Color;
            };
            ControlView.prototype.Dispose = function () {
                _super.prototype.Dispose.call(this);
                this._label = null;
                this._tapEventTimer = null;
            };
            return ControlView;
        }(Views.ViewBase));
        Views.ControlView = ControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ControlView.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ControlEvents;
        var RelocatableControlView = /** @class */ (function (_super) {
            __extends(RelocatableControlView, _super);
            function RelocatableControlView() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._isRelocatable = false;
                _this._beforeX = 0;
                _this._beforeY = 0;
                _this._isMouseMoveEventListened = false;
                _this._isDragging = false;
                _this.GridSize = 60;
                return _this;
            }
            Object.defineProperty(RelocatableControlView.prototype, "IsRelocatable", {
                get: function () {
                    return this._isRelocatable;
                },
                enumerable: true,
                configurable: true
            });
            RelocatableControlView.prototype.Init = function () {
                var _this = this;
                _super.prototype.Init.call(this);
                this._shadow = $('<div class="IView ControlView Shadow"></div>');
                this.AddEventListener(Events.LongClick, function () {
                    if (!_this._isRelocatable)
                        _this.SetRelocatable(true);
                });
                this.Elem.bind('touchstart mousedown', function (e) {
                    if (!_this._isRelocatable) {
                        _this._isDragging = false;
                    }
                    else {
                        _this._isDragging = true;
                        _this.Refresh();
                    }
                });
                this.Elem.bind('touchend mouseup', function (e) {
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
                this.AddEventListener(Events.Attached, function () {
                    var parent = $(_this.Elem.parent());
                    if (parent.length <= 0 || _this._isMouseMoveEventListened)
                        return;
                    _this._isMouseMoveEventListened = true;
                    parent.bind('touchmove mousemove', function (e) {
                        if (_this._isRelocatable && _this._isDragging) {
                            var parentWidth = parent.width();
                            var parentHeight = parent.height();
                            var centerLeft = (parentWidth / 2);
                            var centerTop = (parentHeight / 2);
                            var left = e.clientX;
                            var top_2 = e.clientY;
                            _this.Position.X = left - centerLeft;
                            _this.Position.Y = top_2 - centerTop;
                            _this.Refresh();
                        }
                    });
                });
            };
            RelocatableControlView.prototype.SetRelocatable = function (relocatable) {
                console.log('SetRelocatable');
                if (this._isRelocatable) {
                    // 固定する。
                    this._isRelocatable = false;
                    this._shadow.detach();
                }
                else {
                    // 移動可能にする。
                    this._isRelocatable = true;
                    this._beforeX = this.Position.X;
                    this._beforeY = this.Position.Y;
                    this.Elem.parent().append(this._shadow);
                }
                this.Refresh();
            };
            RelocatableControlView.prototype.InnerRefresh = function () {
                var parent = $(this.Elem.parent());
                if (!parent)
                    return;
                _super.prototype.InnerRefresh.call(this);
                var shadowDom = this._shadow.get(0);
                if (!this._isRelocatable) {
                    shadowDom.style.display = 'none';
                    this.Dom.style.opacity = '1.0';
                    return;
                }
                this.Dom.style.opacity = '0.7';
                if (this._isDragging) {
                    var parentWidth = parent.width();
                    var parentHeight = parent.height();
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
            return RelocatableControlView;
        }(Views.ControlView));
        Views.RelocatableControlView = RelocatableControlView;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ViewEvents;
        var Number = Fw.Util.Number;
        var Position = /** @class */ (function () {
            function Position(view) {
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
                    if (changed)
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
                    if (changed)
                        this._view.DispatchEvent(Events.PositionChanged);
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
        Views.Position = Position;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Number.ts" />
var Fw;
(function (Fw) {
    var Views;
    (function (Views) {
        var Events = Fw.Events.ViewEvents;
        var Number = Fw.Util.Number;
        var Anchor = /** @class */ (function () {
            function Anchor(view) {
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
                    if (changed)
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
                    if (changed)
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
                    if (changed)
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
                    if (changed)
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
                    if (changed)
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
                    if (changed)
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
                    if (changed)
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
                    if (changed)
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
        Views.Anchor = Anchor;
    })(Views = Fw.Views || (Fw.Views = {}));
})(Fw || (Fw = {}));
//# sourceMappingURL=tsout.js.map