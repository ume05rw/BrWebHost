/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

namespace Fw {
    export interface IObject {
        readonly Elem: JQuery;
        readonly ClassName: string;
        readonly IsDisposed: boolean;

        AddEventListener(name: string, handler: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void, bindObject?: any): void;
        RemoveEventListener(name: string, handler?: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void, bindObject?: any): void;
        DispatchEvent(name: string, value?: Object): void;
        SuppressEvent(name: string): void;
        IsSuppressedEvent(name: string): boolean;
        ResumeEvent(name: string): void;

        Dispose(): void;
    }
}
