/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Events/EventReference.ts" />
/// <reference path="Util/Dump.ts" />
/// <reference path="IObject.ts" />
/// <reference path="Events/ObjectEvents.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;
    import EventReference = Fw.Events.EventReference;
    import Events = Fw.Events.ObjectEvents;

    export abstract class ObjectBase implements IObject {

        private _instanceId: string;
        public get InstanceId(): string {
            return this._instanceId;
        }

        private _isDisposed: boolean = false;
        public get IsDisposed(): boolean {
            return this._isDisposed;
        }

        private _className: string;
        public get ClassName(): string {
            return this._className;
        }


        constructor() {
            this._instanceId = Fw.Util.App.CreateId();
        }

        public SetClassName(name: string): void {
            this._className = name;
        }

        public Dispose(): void {
            // TODO: あとで戻す。デバッグ用。
            //this._className = null;
            //this._instanceId = null;
            this._isDisposed = true;
        }
    }
}
