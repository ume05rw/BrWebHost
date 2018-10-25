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
        private _eventHandlers: Array<EventReference>;
        private _suppressedEvents: Array<string>;

        constructor() {
            super();

            this._suppressedEvents = new Array<string>();
            this._eventHandlers = new Array<EventReference>();
        }



        public AddEventListener(
            name: string,
            handler: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void,
            bindObject: IObject = null
        ): void {
            if (!bindObject)
                bindObject = this;

            const eRef = new EventReference();
            eRef.Name = name;
            eRef.Handler = handler;
            eRef.BindedHandler = handler.bind(bindObject);
            eRef.BindObject = bindObject;

            this.Log(`AddEventListener: ${eRef.BindObject.ClassName}_${eRef.BindObject.InstanceId}.${name}`);

            this._eventHandlers.push(eRef);
            //this.Elem.on(eRef.Name, eRef.BindedHandler);
        }

        public RemoveEventListener(
            name: string,
            handler?: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void,
            bindObject: IObject = null
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

                    this.Log(`RemoveEventListener: ${er.BindObject.ClassName}_${er.BindObject.InstanceId}.${name} :: ${bindObject.ClassName}.${bindObject.InstanceId}` );

                    return (er.Name === name
                        && er.Handler === handler
                        && er.BindObject === bindObject);
                });

                if (!eRef) {
                    throw new Error(`${this.ClassName}.${name} event not found.`);
                }

                //this.Elem.off(eRef.Name, eRef.BindedHandler);
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
                _.each(eRefs, (eRef) => {
                    //this.Elem.off(eRef.Name, eRef.BindedHandler);
                    const idx = this._eventHandlers.indexOf(eRef);
                    this._eventHandlers.splice(idx, 1);
                });
            }
        }

        public DispatchEvent(name: string, params: Object = null): void {
            if (this.IsSuppressedEvent(name))
                return;

            this.Log(`DispatchEvent: ${name}`);
            const eo = new Fw.Events.EventObject(this, name, params);


            _.each(this._eventHandlers, (er: EventReference) => {
                if (er.Name === name) {
                    const je = $.Event(name);
                    je.stopPropagation();
                    er.BindedHandler(je, eo);
                }
            });

            //this.Elem.trigger(name, eo);
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
            this._eventHandlers = null;
            this._suppressedEvents = null;
        }
    }
}
