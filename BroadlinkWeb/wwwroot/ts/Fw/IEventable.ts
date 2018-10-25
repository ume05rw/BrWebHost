/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

/// <reference path="IObject.ts" />


namespace Fw {
    export interface IEventable extends IObject {

        /**
         * イベントハンドラをバインドする。
         * @param name
         * @param handler
         * @param bindObject
         */
        AddEventListener(
            name: string,
            handler: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void,
            bindObject?: any
        ): void;

        /**
         * イベントハンドラを削除する。
         * @param name
         * @param handler
         * @param bindObject
         */
        RemoveEventListener(
            name: string,
            handler?: (je: JQueryEventObject, eo: Fw.Events.EventObject) => void,
            bindObject?: any
        ): void;

        /**
         * イベントを通知する。
         * @param name
         * @param value
         */
        DispatchEvent(name: string, value?: Object): void;

        /**
         * イベント通知を抑制する。
         * @param name
         */
        SuppressEvent(name: string): void;

        /**
         * イベントが抑制されているか否かを確認する。
         * @param name
         */
        IsSuppressedEvent(name: string): boolean;

        /**
         * イベント抑制を解除する。
         * @param name
         */
        ResumeEvent(name: string): void;
    }
}
