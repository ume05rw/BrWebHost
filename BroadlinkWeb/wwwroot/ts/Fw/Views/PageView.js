/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/Animation/Animator.ts" />
/// <reference path="../../Fw/Views/Animation/Params.ts" />
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
//# sourceMappingURL=PageView.js.map