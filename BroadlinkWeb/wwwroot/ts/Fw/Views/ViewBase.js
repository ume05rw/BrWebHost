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
                this.Children = new Array();
                this.Elem = jqueryElem;
                this.Dom = jqueryElem.get(0);
                this._width = this.Elem.width();
                this._height = this.Elem.height();
                this._x = 0;
                this._y = 0;
                this._color = '000000';
                this.Elem.addClass('IView');
                this.IsVisible()
                    ? this.Dom.dispatchEvent(this.EventShown)
                    : this.Dom.dispatchEvent(this.EventHidden);
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
//# sourceMappingURL=ViewBase.js.map