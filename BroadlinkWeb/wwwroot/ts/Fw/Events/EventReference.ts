/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Events {
    export class EventReference {
        public Name: string;
        public Handler: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void;
        public BindedHandler: any;
    }
}