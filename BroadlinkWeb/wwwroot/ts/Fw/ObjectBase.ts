/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

/// <reference path="IObject.ts" />

/// <reference path="Events/EventReference.ts" />
/// <reference path="Util/Dump.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;

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

        public get ObjectIdentifier(): string {
            return `[${this._className}[${this._instanceId}]`;
        }

        public LogEnable: boolean;

        constructor() {
            this._instanceId = Fw.Util.App.CreateId();
            this.LogEnable = false;
        }

        protected SetClassName(name: string): void {
            this._className = name;
        }

        public Log(value: any): void {
            if (!this.LogEnable)
                return;

            const header = `${this.ClassName}[${this.InstanceId}]:: `;
            if (typeof value === 'object') {
                Dump.Log(header);
                Dump.Log(value);
            } else {
                Dump.Log(header + value);
            }
        }

        public Dispose(): void {
            this.Log(`Dispose`);

            // TODO: あとで戻す。デバッグ用。
            //this._className = null;
            //this._instanceId = null;
            this._isDisposed = true;
            Fw.Util.Obj.Clean(this);
        }
    }
}
