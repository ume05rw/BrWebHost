/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />

namespace Fw.Events {
    export class InputViewEventsClass extends ViewEventsClass {
        public readonly Changed: string = 'Changed';
        public readonly Focused: string = 'Focused';
        public readonly Blurred: string = 'Blurred';
    }
    export const InputViewEvents: InputViewEventsClass = new InputViewEventsClass();
}