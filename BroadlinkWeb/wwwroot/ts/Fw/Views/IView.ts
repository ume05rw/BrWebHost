/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Views {
    export interface IView {
        Elem: JQuery;
        Children: Array<IView>;

        X: number;
        Y: number;
        Width: number;
        Height: number;
        Color: string;

        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        Dispose(): void;
    }
}