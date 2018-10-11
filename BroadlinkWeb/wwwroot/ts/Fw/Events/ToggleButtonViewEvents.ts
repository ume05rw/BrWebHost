/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ControlViewEvents.ts" />

namespace Fw.Events {
    export class ToggleButtonViewEventsClass extends ControlViewEventsClass {
        public readonly Switched: string = 'Switched';
    }
    export const ToggleButtonViewEvents: ToggleButtonViewEventsClass = new ToggleButtonViewEventsClass();
}