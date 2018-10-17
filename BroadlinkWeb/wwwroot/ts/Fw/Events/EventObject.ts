/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Events {
    export class EventObject {
        public readonly Sender: Fw.IObject;
        public readonly EventName: string;
        public readonly Params: any;

        constructor(sender: Fw.IObject, eventName: string, params?: any) {
            this.Sender = sender;
            this.EventName = eventName;
            this.Params = params;
        }
    }
}