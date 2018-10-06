/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./ViewEvents.ts" />
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
//# sourceMappingURL=PageEvents.js.map