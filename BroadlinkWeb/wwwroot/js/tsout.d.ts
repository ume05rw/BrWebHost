/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />
declare namespace Fw.Views {
    interface IView {
        Elem: JQuery;
        Dom: HTMLElement;
        Children: Array<IView>;
        X: number;
        Y: number;
        Width: number;
        Height: number;
        Color: string;
        BackgroundColor: string;
        SetDisplayParams(x: number, y: number, width?: number, height?: number, color?: string): void;
        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;
        AddEventListener(name: string, listener: EventListenerOrEventListenerObject): void;
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
    }
    const ViewEvents: ViewEventsClass;
}
declare namespace Fw.Views {
    abstract class ViewBase implements IView {
        protected EventShown: Event;
        protected EventHidden: Event;
        private _lastRefreshTimer;
        Elem: JQuery;
        readonly Dom: HTMLElement;
        Children: Array<IView>;
        private _x;
        X: number;
        private _y;
        Y: number;
        private _width;
        Width: number;
        private _height;
        readonly Height: number;
        Heght: number;
        private _color;
        Color: string;
        private _backgroundColor;
        BackgroundColor: string;
        constructor(jqueryElem: JQuery);
        protected Init(): void;
        SetDisplayParams(x: number, y: number, width?: number, height?: number, color?: string): void;
        Add(view: IView): void;
        Remove(view: IView): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;
        Refresh(): void;
        protected InnerRefresh(): void;
        AddEventListener(name: string, listener: EventListenerOrEventListenerObject): void;
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
declare namespace App.Controllers {
    class Sub1Controller extends Fw.Controllers.ControllerBase {
        private _btnGoMain;
        private _btnDevices;
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
    class ControlEventsClass extends ViewEventsClass {
        readonly SingleClick: string;
        readonly LongClick: string;
    }
    const ControlEvents: ControlEventsClass;
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
    class ControlView extends ViewBase {
        protected EventSingleClick: Event;
        protected EventLongClick: Event;
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
    class AnchoredControlView extends ControlView {
        X: number;
        Y: number;
        private _ancWidth;
        Width: number;
        private _ancHeight;
        Height: number;
        private _isAnchorTop;
        IsAnchorTop: boolean;
        private _isAnchorLeft;
        IsAnchorLeft: boolean;
        private _isAnchorRight;
        IsAnchorRight: boolean;
        private _isAnchorBottom;
        IsAnchorBottom: boolean;
        private _anchorMarginTop;
        AnchorMarginTop: number;
        private _anchorMarginLeft;
        AnchorMarginLeft: number;
        private _anchorMarginRight;
        AnchorMarginRight: number;
        private _anchorMarginBottom;
        AnchorMarginBottom: number;
        protected Init(): void;
        protected InnerRefresh(): void;
    }
}
