/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Views {
    export interface IView {
        Elem: JQuery;
        Children: Array<IView>;

        Add(view: IView): void;
        Remove(view: IView): void;
        Dispose(): void;
    }
}