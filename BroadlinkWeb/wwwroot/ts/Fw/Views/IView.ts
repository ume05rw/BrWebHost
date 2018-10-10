﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../IObject.ts" />
/// <reference path="Property/Anchor.ts" />

namespace Fw.Views {
    import Property = Fw.Views.Property;

    export interface IView extends Fw.IObject {
        readonly Elem: JQuery;
        readonly Dom: HTMLElement;
        readonly Parent: IView;
        readonly Children: Array<IView>;

        readonly Size: Property.Size;
        readonly Position: Property.Position;
        readonly Anchor: Property.Anchor;

        Color: string;
        BackgroundColor: string;

        SetParent(parent: IView): void;
        SetSize(width: number, height: number): void;
        SetPosition(x: number, y: number): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;
        SetPositionByLeftTop(left: number, top: number): void;
        SetDisplayParams(width: number, height: number, x: number, y: number, color: string, backgroundColor: string): void;

        Add(view: IView): void;
        Remove(view: IView): void;

        Refresh(): void;
        SuppressLayout(): void;
        IsSuppressedLayout(): boolean;
        ResumeLayout(): void;

        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;
    }
}