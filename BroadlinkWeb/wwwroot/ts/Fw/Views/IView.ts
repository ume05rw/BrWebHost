/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Views {
    export interface IView {
        Elem: JQuery;
        Dom: HTMLElement;
        Children: Array<IView>;

        X: number;
        Y: number;
        Width: number;
        Height: number;

        IsAnchorTop: boolean;
        IsAnchorLeft: boolean;
        IsAnchorRight: boolean;
        IsAnchorBottom: boolean;

        AnchorMarginTop: number;
        AnchorMarginLeft: number;
        AnchorMarginRight: number;
        AnchorMarginBottom: number;

        Color: string;
        BackgroundColor: string;

        SetDisplayParams(x: number, y: number, width?: number, height?: number, color?: string): void 
        SetAnchor(top: number, left: number, right: number, bottom: number): void;

        Add(view: IView): void;
        TriggerAttachedEvent(): void;
        Remove(view: IView): void;
        TriggerDetachedEvent(): void;
        Refresh(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;

        AddEventListener(name: string, listener: EventListenerOrEventListenerObject): void;

        Dispose(): void;
    }
}