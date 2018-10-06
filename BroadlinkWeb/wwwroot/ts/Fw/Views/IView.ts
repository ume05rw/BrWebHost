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
        Color: string;

        SetDisplayParams(x: number, y: number, width?: number, height?: number, color?: string): void 
        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;

        Dispose(): void;
    }
}