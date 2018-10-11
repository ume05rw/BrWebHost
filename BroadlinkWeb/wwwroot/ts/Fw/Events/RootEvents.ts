﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Events {
    export class RootEventsClass {
        public readonly Resized: string = 'Resized';
        public readonly MaskClicked: string = 'MaskClicked';
    }
    export const RootEvents: RootEventsClass = new RootEventsClass();
}