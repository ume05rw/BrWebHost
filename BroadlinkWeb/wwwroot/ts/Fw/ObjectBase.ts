/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Events/EventReference.ts" />
/// <reference path="Util/Dump.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;
    import EventReference = Fw.Events.EventReference;

    export abstract class ObjectBase implements Fw.IObject {
        // Properties
        private _elem: JQuery;
        public get Elem(): JQuery {
            return this._elem;
        }

        private _className: string;
        public get ClassName(): string {
            return this._className;
        }

        private _eventHandlers: Array<EventReference>;
        private _suppressedEvents: Array<string>;


        constructor() {
            this._elem = $(this);
            this._suppressedEvents = new Array<string>();
            this._eventHandlers = new Array<EventReference>();
        }

        protected SetClassName(name: string): void {
            this._className = name;
        }

        protected SetElem(jqueryElem: JQuery): void {
            if (!jqueryElem)
                return;

            if (this._elem)
                this._elem.remove();

            this._elem = jqueryElem;
        }

        public AddEventListener(name: string, handler: (e: JQueryEventObject) => void): void {
            const eRef = new EventReference();
            eRef.Name = name;
            eRef.Handler = handler;
            eRef.BindedHandler = handler.bind(this);

            this._eventHandlers.push(eRef);
            this.Elem.on(name, eRef.BindedHandler);
        }

        public RemoveEventListener(name: string, handler: (e: JQueryEventObject) => void): void {
            let key: number;
            const eRef = _.find(this._eventHandlers, (er, idx) => {
                key = idx;
                return (er.Name === name && er.Handler === handler);
            });

            if (!eRef) {
                //throw new Error(`${this.ClassName}.${name} event not found.`);
                return;
            }

            this.Elem.off(eRef.Name, eRef.BindedHandler);
            this._eventHandlers.splice(key, 1);
        }

        public DispatchEvent(name: string): void {
            if (this.IsSuppressedEvent(name))
                return;

            //Dump.Log(`${this.ClassName}.DispatchEvent: ${name}`);
            this.Elem.trigger(name);
        }

        public SuppressEvent(name: string): void {
            if (this.IsSuppressedEvent(name))
                return;

            this._suppressedEvents.push(name);
        }

        public IsSuppressedEvent(name: string): boolean {
            return (this._suppressedEvents.indexOf(name) !== -1);
        }

        public ResumeEvent(name: string): void {
            if (!this.IsSuppressedEvent(name))
                return;

            const idx = this._suppressedEvents.indexOf(name);
            this._suppressedEvents.splice(idx, 1);
        }

        public Dispose(): void {
            _.each(this._eventHandlers, (eRef) => {
                this.RemoveEventListener(eRef.Name, eRef.Handler);
            });

            this._elem.remove();
            this._elem = null;
            this._className = null;
            this._suppressedEvents = null;
        }
    }
}