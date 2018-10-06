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
//# sourceMappingURL=ViewEvents.js.map