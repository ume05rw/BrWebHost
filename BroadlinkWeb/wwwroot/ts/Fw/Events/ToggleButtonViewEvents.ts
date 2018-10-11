/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ControlViewEvents.ts" />

namespace Fw.Events {
    export class ToggleButtonViewEventsClass extends ControlViewEventsClass {
        public readonly Switched: string = 'Switched';
        public readonly ToOn: string = 'ToOn';
        public readonly ToOff: string = 'ToOff';
    }
    export const ToggleButtonViewEvents: ToggleButtonViewEventsClass = new ToggleButtonViewEventsClass();
}