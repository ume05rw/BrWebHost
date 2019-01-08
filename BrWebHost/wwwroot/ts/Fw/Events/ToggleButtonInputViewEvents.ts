/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ControlViewEvents.ts" />

namespace Fw.Events {
    export class ToggleButtonInputViewEventsClass extends ControlViewEventsClass {
        public readonly Switched: string = 'Switched';
        public readonly ToOn: string = 'ToOn';
        public readonly ToOff: string = 'ToOff';
        public readonly Changed: string = 'Changed';
        public readonly Focused: string = 'Focused';
        public readonly Blurred: string = 'Blurred';
    }
    export const ToggleButtonInputViewEvents: ToggleButtonInputViewEventsClass = new ToggleButtonInputViewEventsClass();
}