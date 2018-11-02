/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="ViewEvents.ts" />

namespace Fw.Events {
    export class PageViewEventsClass extends ViewEventsClass {
        public readonly Dragging: string = 'Dragging';
    }
    export const PageViewEvents: PageViewEventsClass = new PageViewEventsClass();
}