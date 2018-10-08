/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />
declare namespace Fw.Views {
    interface IView {
        Elem: JQuery;
        Dom: HTMLElement;
        Parent: IView;
        Children: Array<IView>;
        ClassName: string;
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
declare namespace Fw.Controllers {
    interface IController {
        Id: string;
        IsDefaultView: boolean;
        View: Fw.Views.IView;
    }
}
declare namespace Fw.Controllers {
    class Factory {
        static Create(name: string, elem: JQuery, manager: Manager): IController;
    }
}
declare namespace Fw.Controllers {
    class Manager {
        private _controllers;
        constructor();
        Show(id: string): void;
    }
}
declare namespace Fw.Views.Animation {
    class Params {
        static GetCurrent(view: Fw.Views.IView): Params;
        static GetResized(view: Fw.Views.IView, resizeRate: number): Params;
        static GetSlided(view: Fw.Views.IView, xRate?: number, yRate?: number): Params;
        X: number;
        Y: number;
        Width: number;
        Height: number;
        Opacity: number;
    }
}
declare namespace Fw.Views.Animation {
    class Animator {
        private _view;
        FromParams: Params;
        ToParams: Params;
        OnComplete: Function;
        constructor(view: Fw.Views.IView, toParams?: Params);
        Invoke(duration?: number): void;
        Dispose(): void;
    }
}
declare namespace Fw.Events {
    class ViewEventsClass {
        readonly Shown: string;
        readonly Hidden: string;
        readonly Attached: string;
        readonly Detached: string;
        readonly SizeChanged: string;
        readonly PositionChanged: string;
        readonly AnchorChanged: string;
        readonly Initialized: string;
    }
    const ViewEvents: ViewEventsClass;
}
declare namespace Fw.Util {
    class Dump {
        static Log(value: any): void;
        static ErrorLog(value: any, message?: string): void;
        private static GetTimestamp;
        private static GetDumpedString;
    }
}
declare namespace Fw.Util {
    class Number {
        /**
         * @see ビルトインisNaNでは、isNaN(null) === true になってしまう。
         * @param value
         */
        static IsNaN(value: number): boolean;
    }
}
declare namespace Fw.Views {
    class Size {
        private _view;
        private _width;
        Width: number;
        private _height;
        Height: number;
        constructor(view?: IView);
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    abstract class ViewBase implements IView {
        private _lastRefreshTimer;
        private _lastRefreshedTime;
        private _initialized;
        private _suppressedEvents;
        Elem: JQuery;
        readonly Dom: HTMLElement;
        Parent: IView;
        Children: Array<IView>;
        ClassName: string;
        private _size;
        readonly Size: Size;
        private _position;
        readonly Position: Position;
        private _anchor;
        readonly Anchor: Anchor;
        private _color;
        Color: string;
        private _backgroundColor;
        BackgroundColor: string;
        constructor(jqueryElem: JQuery);
        protected Init(): void;
        SetSize(width: number, height: number): void;
        SetPosition(x: number, y: number): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;
        SetPositionByLeftTop(left: number, top: number): void;
        SetDisplayParams(width: number, height: number, x?: number, y?: number, color?: string, backgroundColor?: string): void;
        Add(view: IView): void;
        Remove(view: IView): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;
        Refresh(): void;
        protected InnerRefresh(): void;
        AddEventListener(name: string, handler: (e: JQueryEventObject) => void): void;
        RemoveEventListener(name: string, handler: (e: JQueryEventObject) => void): void;
        DispatchEvent(name: string): void;
        SuppressEvent(name: string): void;
        IsSuppressedEvent(name: string): boolean;
        ResumeEvent(name: string): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class PageView extends ViewBase {
        static RootElem: JQuery;
        static RootWidth: number;
        static RootHeight: number;
        static RefreshRoot(): void;
        constructor(jqueryElem: JQuery);
        Show(duration?: number): void;
        Hide(duration?: number): void;
        protected InnerRefresh(): void;
    }
}
declare namespace Fw.Controllers {
    abstract class ControllerBase implements Fw.Controllers.IController {
        Id: string;
        IsDefaultView: boolean;
        View: Fw.Views.IView;
        Manager: Fw.Controllers.Manager;
        constructor(jqueryElem: JQuery, manager: Fw.Controllers.Manager);
    }
}
declare namespace App.Controllers {
    class MainController extends Fw.Controllers.ControllerBase {
        private _btnGoSub1;
        private _btnGoSub2;
        private _centerControl;
        constructor(elem: JQuery, manager: Fw.Controllers.Manager);
        private Init;
    }
}
declare namespace Fw.Util.Xhr {
    class Params {
        Url: string;
        Method: MethodType;
        Values: any;
        Callback: any;
        constructor(url: string, method?: MethodType, values?: any);
    }
}
declare namespace Fw.Util.Xhr {
    enum MethodType {
        Get = 1,
        Post = 2,
        Put = 3,
        Delete = 4
    }
}
declare namespace Fw.Util.Xhr {
    class Query {
        static Invoke(params: Params): any;
    }
}
declare namespace Fw.Events {
    class ControlEventsClass extends ViewEventsClass {
        readonly SingleClick: string;
        readonly LongClick: string;
    }
    const ControlEvents: ControlEventsClass;
}
declare namespace App.Controllers {
    class Sub1Controller extends Fw.Controllers.ControllerBase {
        constructor(elem: JQuery, manager: Fw.Controllers.Manager);
        private Init;
    }
}
declare namespace App.Controllers {
    class Sub2Controller extends Fw.Controllers.ControllerBase {
        private _btnGoMain;
        private _btnA1Value;
        constructor(elem: JQuery, manager: Fw.Controllers.Manager);
        private Init;
    }
}
declare namespace Fw.Util.Xhr {
    class Config {
        static BaseUrl: string;
    }
}
declare namespace App {
    class Main {
        static _controllerManager: Fw.Controllers.Manager;
        static StartUp(): void;
    }
}
declare namespace Fw.Events {
    class PageEventsClass extends ViewEventsClass {
    }
    const PageEvents: PageEventsClass;
}
declare namespace Fw.Util.Xhr {
    class Result {
        Succeeded: boolean;
        Values: any;
        Errors: any;
    }
}
declare namespace Fw.Views {
    class Anchor {
        private _view;
        private _isAnchoredTop;
        IsAnchoredTop: boolean;
        private _marginTop;
        MarginTop: number;
        private _isAnchoredLeft;
        IsAnchoredLeft: boolean;
        private _marginLeft;
        MarginLeft: number;
        private _isAnchoredRight;
        IsAnchoredRight: boolean;
        private _marginRight;
        MarginRight: number;
        private _isAnchoredBottom;
        IsAnchoredBottom: boolean;
        private _marginBottom;
        MarginBottom: number;
        constructor(view?: IView);
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class ControlView extends ViewBase {
        private _label;
        private _tapEventTimer;
        Label: string;
        private _hasBorder;
        HasBorder: boolean;
        private _borderRadius;
        BorderRadius: number;
        constructor();
        /**
         * @description Initialize
         */
        protected Init(): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class Position {
        private _view;
        private _x;
        X: number;
        private _y;
        Y: number;
        readonly Left: number;
        readonly Top: number;
        constructor(view?: IView);
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class RelocatableControlView extends ControlView {
        private _isRelocatable;
        readonly IsRelocatable: boolean;
        private _shadow;
        private _beforeX;
        private _beforeY;
        private _isMouseMoveEventListened;
        private _isDragging;
        GridSize: number;
        constructor();
        protected Init(): void;
        private OnMouseMove;
        private _delayedResumeMouseEventsTimer;
        private DelayedResumeMouseEvents;
        SetRelocatable(relocatable: boolean): void;
        protected InnerRefresh(): void;
    }
}
declare namespace Fw.Views {
    class PanelView extends ControlView {
        constructor();
        protected Init(): void;
    }
}
declare namespace Fw.Views {
    enum Direction {
        Horizontal = 0,
        Vertical = 1
    }
    class SlidablePanelView extends PanelView {
        readonly Direction: Direction;
        private _innerBackgroundColor;
        InnerBackgroundColor: string;
        private _innerPanelCount;
        InnerPanelCount: number;
        private _innerPanel;
        private _isDragging;
        private _dragStartMousePosition;
        private _dragStartPanelPosition;
        constructor(direction: Direction);
        protected Init(): void;
        private _delayedResumeMouseEventsTimer;
        private DelayedResumeMouseEvents;
        private InitView;
        private AdjustSlidePosition;
        protected InnerRefresh(): void;
    }
}
