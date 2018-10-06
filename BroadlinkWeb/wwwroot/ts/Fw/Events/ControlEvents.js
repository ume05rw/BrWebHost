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
//# sourceMappingURL=ControlEvents.js.map