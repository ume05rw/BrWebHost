/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Util/Dump.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;

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

        private _suppressedEvents: Array<string>;


        constructor() {
            this._elem = $(this);
            this._suppressedEvents = new Array<string>();
        }

        protected SetClassName(name: string): void {
            this._className = name;
        }

        protected SetElem(jqueryElem: JQuery): void {
            this._elem = jqueryElem;
        }

        public AddEventListener(name: string, handler: (e: JQueryEventObject) => void): void {
            this.Elem.on(name, handler);
        }

        public RemoveEventListener(name: string, handler: (e: JQueryEventObject) => void): void {
            this.Elem.off(name, handler);
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
            this._elem.remove();
            this._elem = null;
            this._className = null;
            this._suppressedEvents = null;
        }
    }
}