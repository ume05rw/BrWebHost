/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../IObject.ts" />
/// <reference path="Property/Anchor.ts" />

namespace Fw.Views {
    import Property = Fw.Views.Property;

    export interface IView extends Fw.IObject {
        Elem: JQuery;
        Dom: HTMLElement;
        Parent: IView;
        Children: Array<IView>;

        ClassName: string,
        Size: Property.Size;
        Position: Property.Position;
        Anchor: Property.Anchor;

        Color: string;
        BackgroundColor: string;

        SetParent(parent: IView): void;
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
    }
}