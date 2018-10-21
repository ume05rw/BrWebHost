/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

/// <reference path="IEventable.ts" />
/// <reference path="ObjectBase.ts" />

/// <reference path="Events/EventReference.ts" />
/// <reference path="Util/Dump.ts" />
/// <reference path="Events/EventableEvents.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;
    import EventReference = Fw.Events.EventReference;
    import Events = Fw.Events.EventableEvents;

    export abstract class EventableBase extends ObjectBase implements IEventable {

        private _elem: JQuery;
        public get Elem(): JQuery {
            return this._elem;
        }

        private _eventHandlers: Array<EventReference>;
        private _suppressedEvents: Array<string>;

        constructor() {
            super();

            this._suppressedEvents = new Array<string>();
            this._eventHandlers = new Array<EventReference>();

            this._elem = $(this);
        }

        protected SetElem(jqueryElem: JQuery): void {
            if (!jqueryElem)
                return;

            if (this._elem)
                this._elem.remove();

            this._elem = jqueryElem;
        }

        public AddEventListener(
            name: string,
            handler: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void,
            bindObject: IObject | Fw.Controllers.IController = null
        ): void {
            if (!bindObject)
                bindObject = this;

            const eRef = new EventReference();
            eRef.Name = name;
            eRef.Handler = handler;
            eRef.BindedHandler = handler.bind(bindObject);
            eRef.BindObject = bindObject;

            //Dump.Log(`AddEv: ${eRef.BindObject.ClassName}_${eRef.BindObject.ObjectId}.${name}`);

            this._eventHandlers.push(eRef);
            this.Elem.on(name, eRef.BindedHandler);
        }

        public RemoveEventListener(
            name: string,
            handler?: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void,
            bindObject: IObject | Fw.Controllers.IController = null
        ): void {
            if (!bindObject)
                bindObject = this;

            if (handler) {
                // handlerが指定されているとき
                // 特定のイベントハンドラのみを削除する。
                let key: number;
                const eRef = _.find(this._eventHandlers, (er, idx) => {
                    key = idx;
                    // 関数は継承関係のプロトタイプ参照都合で同一オブジェクトになりやすいため、
                    // 判定基準にならない。
                    //return (er.Name === name && er.Handler === handler);

                    //Dump.Log(`RemoveEv: ${er.BindObject.ClassName}_${er.BindObject.ObjectId}.${name} :: ${bindObject.ObjectId}` );

                    return (er.Name === name
                        && er.Handler === handler
                        && er.BindObject === bindObject);
                });

                if (!eRef) {
                    throw new Error(`${this.ClassName}.${name} event not found.`);
                }

                this.Elem.off(eRef.Name, eRef.BindedHandler);
                this._eventHandlers.splice(key, 1);
            } else {
                // handlerが指定されないとき
                // bindObjectの全てのイベントハンドラを削除する。
                const eRefs = new Array<EventReference>();
                _.each(this._eventHandlers, (er) => {
                    if (
                        er.Name === name
                        && er.BindObject === bindObject
                    ) {
                        eRefs.push(er);
                    }
                });
                _.each(eRefs, (er) => {
                    this.Elem.off(er.Name, er.BindedHandler);
                    const idx = this._eventHandlers.indexOf(er);
                    this._eventHandlers.splice(idx, 1);
                });
            }
        }

        public DispatchEvent(name: string, params: Object = null): void {
            if (this.IsSuppressedEvent(name))
                return;

            //Dump.Log(`${this.ClassName}.DispatchEvent: ${name}`);
            const eo = new Fw.Events.EventObject(this, name, params);
            this.Elem.trigger(name, eo);
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
            super.Dispose();

            // イベントバインドを全削除
            this._elem.off();

            try {
                this._elem.remove();
            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            }

            this._eventHandlers = null;
            this._elem = null;
            this._suppressedEvents = null;
        }
    }
}
