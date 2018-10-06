/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ViewBase.ts" />
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
                    this.Dom.style.borderRadius = this._borderRadius + "%";
                },
                enumerable: true,
                configurable: true
            });
            ControlView.prototype.Init = function () {
                var _this = this;
                _super.prototype.Init.call(this);
                this.HasBorder = true;
                this.BorderRadius = 5;
                this.Elem.addClass('ControlView');
                this._label = $('<span></span>');
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
//# sourceMappingURL=ControlView.js.map