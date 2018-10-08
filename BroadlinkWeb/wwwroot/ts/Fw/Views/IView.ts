﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Views {
    export interface IView {
        Elem: JQuery;
        Dom: HTMLElement;
        Parent: IView;
        Children: Array<IView>;

        ClassName: string,
        Size: Size;
        Position: Position;
        Anchor: Anchor;

        Color: string;
        BackgroundColor: string;

        SetDisplayParams(width: number, height: number, x: number, y: number, color: string, backgroundColor: string): void;
        SetSize(width: number, height: number): void;
        SetPosition(x: number, y: number): void;
        SetPositionByLeftTop(left: number, top: number): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;

        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;

        AddEventListener(name: string, handler: (e: JQueryEventObject) => void): void;
        RemoveEventListener(name: string, handler: (e: JQueryEventObject) => void): void;
        DispatchEvent(name: string): void;
        SuppressEvent(name: string): void;
        IsSuppressedEvent(name: string): boolean;
        ResumeEvent(name: string): void;

        Dispose(): void;
    }
}