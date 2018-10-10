/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />
declare namespace Fw.Util {
    class Dump {
        static Log(value: any): void;
        static ErrorLog(value: any, message?: string): void;
        private static GetTimestamp;
        private static GetDumpedString;
    }
}
declare namespace Fw {
    class Config {
        /**
         * @description Xhrクエリ時の基礎URL
         */
        static XhrBaseUrl: string;
        /**
         * @description ページ用div.attr識別子
         */
        static PageIdAttribute: string;
        /**
         * @description 起動ページdiv.attr識別子
         * @see <div data-default="true"></div>
         */
        static DefaultPageAttribute: string;
    }
}
declare namespace Fw.Controllers {
    class Factory {
        static Create(id: string, elem: JQuery): IController;
    }
}
declare namespace Fw.Controllers {
    class Manager {
        private static _instance;
        static readonly Instance: Manager;
        static Init(): void;
        private _controllers;
        private constructor();
        Add(controller: IController): void;
        Show(id: string): void;
    }
}
declare namespace App {
    class Main {
        static StartUp(): void;
    }
}
declare namespace Fw {
    interface IObject {
        readonly Elem: JQuery;
        readonly ClassName: string;
        AddEventListener(name: string, handler: (e: JQueryEventObject) => void): void;
        RemoveEventListener(name: string, handler: (e: JQueryEventObject) => void): void;
        DispatchEvent(name: string): void;
        SuppressEvent(name: string): void;
        IsSuppressedEvent(name: string): boolean;
        ResumeEvent(name: string): void;
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
        readonly PositionPolicyChanged: string;
        readonly AnchorChanged: string;
        readonly Initialized: string;
    }
    const ViewEvents: ViewEventsClass;
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
declare namespace Fw.Views.Property {
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
        private _hasAnchorX;
        readonly HasAnchorX: boolean;
        private _hasAnchorY;
        readonly HasAnchorY: boolean;
        constructor(view?: IView);
        SetHasAnchor(hasAnchorX: boolean, hasAnchorY: boolean): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    import Property = Fw.Views.Property;
    interface IView extends Fw.IObject {
        readonly Elem: JQuery;
        readonly Dom: HTMLElement;
        readonly Page: PageView;
        readonly Parent: IView;
        readonly Children: Array<IView>;
        readonly Size: Property.Size;
        readonly Position: Property.Position;
        readonly Anchor: Property.Anchor;
        ZIndex: number;
        Color: string;
        BackgroundColor: string;
        SetParent(parent: IView): void;
        SetSize(width: number, height: number): void;
        SetXY(x: number, y: number, updatePolicy?: boolean): void;
        SetLeftTop(left: number, top: number, updatePolicy?: boolean): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;
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
declare namespace Fw.Controllers {
    interface IController {
        Id: string;
        IsDefaultView: boolean;
        View: Fw.Views.IView;
    }
}
declare namespace Fw.Controllers {
    /**
     * @see コントローラはイベント等の実装が無いので、IObjectを実装しない。
     * */
    abstract class ControllerBase implements IController {
        Id: string;
        IsDefaultView: boolean;
        View: Fw.Views.IView;
        constructor(id: string, jqueryElem?: JQuery);
        SetPageViewByJQuery(elem: JQuery): void;
    }
}
declare namespace Fw.Events {
    class ControlViewEventsClass extends ViewEventsClass {
        readonly SingleClick: string;
        readonly LongClick: string;
    }
    const ControlViewEvents: ControlViewEventsClass;
}
declare namespace Fw.Views.Property {
    /**
     * @description background-size
     */
    enum FitPolicy {
        /**
         * 自動(と、containの違いがいまいちわからん)
         */
        Auto = "auto",
        /**
         * コンテンツを全て表示しきる、最大サイズ
         */
        Contain = "contain",
        /**
         * 枠に合わせてコンテンツの上下をカットした最大サイズ
         */
        Cover = "cover"
    }
}
declare namespace Fw.Util {
    class App {
        private static _ids;
        static CreateId(): string;
    }
}
declare namespace Fw.Events {
    class PageViewEventsClass extends ViewEventsClass {
        readonly Dragging: string;
    }
    const PageViewEvents: PageViewEventsClass;
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
declare namespace Fw.Views.Property {
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
declare namespace Fw.Events {
    class EventReference {
        Name: string;
        Handler: (e: JQueryEventObject) => void;
        BindedHandler: any;
    }
}
declare namespace Fw {
    abstract class ObjectBase implements Fw.IObject {
        private _elem;
        readonly Elem: JQuery;
        private _className;
        readonly ClassName: string;
        private _eventHandlers;
        private _suppressedEvents;
        constructor();
        protected SetClassName(name: string): void;
        protected SetElem(jqueryElem: JQuery): void;
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
    import Property = Fw.Views.Property;
    abstract class ViewBase extends ObjectBase implements IView {
        private _lastRefreshTimer;
        private _lastRefreshedTime;
        private _initialized;
        private _isSuppressLayout;
        private _dom;
        readonly Dom: HTMLElement;
        private _page;
        readonly Page: PageView;
        private _parent;
        Parent: IView;
        private _children;
        readonly Children: Array<IView>;
        private _size;
        readonly Size: Property.Size;
        private _position;
        readonly Position: Property.Position;
        private _anchor;
        readonly Anchor: Property.Anchor;
        private _zIndex;
        ZIndex: number;
        private _color;
        Color: string;
        private _backgroundColor;
        BackgroundColor: string;
        constructor(jqueryElem: JQuery);
        protected SetElem(jqueryElem: JQuery): void;
        protected Init(): void;
        protected InitPage(): void;
        SetParent(parent: IView): void;
        SetSize(width: number, height: number): void;
        SetXY(x: number, y: number, updatePolicy?: boolean): void;
        SetLeftTop(left: number, top: number, updatePolicy?: boolean): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;
        SetDisplayParams(width: number, height: number, x?: number, y?: number, color?: string, backgroundColor?: string): void;
        private InitHasAnchor;
        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        protected InnerRefresh(): void;
        SuppressLayout(): void;
        IsSuppressedLayout(): boolean;
        ResumeLayout(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        IsVisible(): boolean;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class PageView extends ViewBase {
        private _isNeedDragX;
        private _isNeedDragY;
        private _isDragging;
        private _isSuppressDrag;
        private _minDragPosition;
        private _maxDragPosition;
        private _dragStartMousePosition;
        private _dragStartViewPosition;
        private _draggedPosition;
        readonly DraggedPosition: Property.Position;
        constructor(jqueryElem?: JQuery);
        protected Init(): void;
        SuppressDragging(): void;
        IsSuppressDragging(): boolean;
        ResumeDragging(): void;
        private DetectToNeedDrags;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace App.Views.Pages {
    import Views = Fw.Views;
    class MainPageView extends Fw.Views.PageView {
        BtnGoSub1: Views.ControlView;
        BtnGoSub2: Views.ControlView;
        CenterControl: Views.ControlView;
        TmpCtl: Views.ControlView;
        AncCtl1: Views.ControlView;
        AncCtl2: Views.ControlView;
        AncCtl3: Views.ControlView;
        AncCtl4: Views.ControlView;
        AncCtl5: Views.ControlView;
        AncCtl6: Views.ControlView;
        constructor();
        private Initialize;
    }
}
declare namespace App.Controllers {
    class MainController extends Fw.Controllers.ControllerBase {
        private _centerControl;
        constructor(id: string);
        private Init;
    }
}
declare namespace Fw.Models.Entities {
    interface IEntity extends Fw.IObject {
    }
}
declare namespace Fw.Models.Entities {
    abstract class EntityBase extends Fw.ObjectBase implements IEntity {
    }
}
declare namespace App.Models.Entities {
    class BrDevice extends Fw.Models.Entities.EntityBase {
        Id: number;
        MacAddressString: string;
        IpAddressString: string;
        Port: number;
        DeviceTypeDetailNumber: number;
        IsActive: boolean;
        DeviceTypeDetal: string;
        DeviceType: string;
    }
}
declare namespace Fw.Models.Stores {
    interface IStore extends Fw.IObject {
    }
}
declare namespace Fw.Models.Stores {
    abstract class StoreBase extends Fw.ObjectBase implements IStore {
    }
}
declare namespace Fw.Util.Xhr {
    class Query {
        static Invoke(params: Params): any;
    }
}
declare namespace App.Models.Stores {
    import BrDevice = App.Models.Entities.BrDevice;
    class BrDeviceStore extends Fw.Models.Stores.StoreBase {
        Discover(callback: (brDevices: BrDevice[]) => void): void;
    }
}
declare namespace App.Controllers {
    class Sub1Controller extends Fw.Controllers.ControllerBase {
        constructor(id: string, jqueryElem: JQuery);
        private Init;
    }
}
declare namespace App.Controllers {
    class Sub2Controller extends Fw.Controllers.ControllerBase {
        constructor(id: string, jqueryElem: JQuery);
        private Init;
    }
}
declare namespace Fw.Events {
    class RootEventsClass {
        readonly Resized: string;
    }
    const RootEvents: RootEventsClass;
}
declare namespace Fw {
    class Startup {
        static Init(): void;
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
    class Params {
        Url: string;
        Method: MethodType;
        Values: any;
        Callback: any;
        constructor(url: string, method?: MethodType, values?: any);
    }
}
declare namespace Fw.Util.Xhr {
    class Result {
        static CreateSucceeded(values: any): Result;
        static CreateError(errors: any): Result;
        readonly Succeeded: boolean;
        readonly Values: any;
        readonly Errors: any;
        constructor(succeeded: boolean, values: any, errors: any);
    }
}
declare namespace Fw.Views {
    import FitPolicy = Fw.Views.Property.FitPolicy;
    class ImageView extends ViewBase {
        private _image;
        private _src;
        Src: string;
        private _firPolicy;
        FitPolicy: FitPolicy;
        constructor();
        protected Init(): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class ControlView extends ViewBase {
        private _label;
        private _tapEventTimer;
        private _cvMouseSuppressor;
        private _cvDelayedResumeEventsTimer;
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
        protected InitPage(): void;
        private OnPageDragging;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views.Property {
    /**
     * @description font-weight
     */
    enum FontWeight {
        Lighter = "lighter",
        Normal = "normal",
        Bold = "bold",
        Bolder = "bolder"
    }
}
declare namespace Fw.Views {
    import Property = Fw.Views.Property;
    class LabelView extends ViewBase {
        private _text;
        Text: string;
        private _fontWeight;
        FontWeight: Property.FontWeight;
        private _fontSize;
        FontSize: Property.FontSize;
        private _fontFamily;
        FontFamily: string;
        private _autoSize;
        AutoSize: boolean;
        private _hiddenSpan;
        constructor();
        protected Init(): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class PanelControlView extends ControlView {
        protected Init(): void;
    }
}
declare namespace Fw.Views.Property {
    /**
     * @description font-size
     */
    enum FontSize {
        XxSmall = "xx-small",
        XSmall = "x-small",
        Small = "small",
        Medium = "medium",
        Large = "large",
        XLarge = "x-large",
        XxLarge = "xx-large"
    }
}
declare namespace Fw.Views.Property {
    /**
     * @description 配置基準
     */
    enum PositionPolicy {
        /**
         * 中央ポリシー：親Viewの中心位置からの差分を X, Y で表現する。
         */
        Centering = 1,
        /**
         * 左上ポリシー：親Viewの左上からの差分を、Left, Top で表現する。
         */
        LeftTop = 2
    }
}
declare namespace Fw.Views.Property {
    class Position {
        private _view;
        private _policy;
        Policy: PositionPolicy;
        private _x;
        X: number;
        private _y;
        Y: number;
        private _left;
        Left: number;
        private _top;
        Top: number;
        constructor(view?: IView);
        private GetSizeSet;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class RelocatableControlView extends ControlView {
        private _isRelocatable;
        readonly IsRelocatable: boolean;
        private _shadow;
        private _isMouseMoveEventListened;
        private _isDragging;
        private _dragStartMousePosition;
        private _dragStartViewPosition;
        private _gridSize;
        GridSize: number;
        protected Init(): void;
        private OnMouseMove;
        private _delayedResumeMouseEventsTimer;
        private DelayedResumeMouseEvents;
        SetRelocatable(relocatable: boolean): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw {
    import Property = Fw.Views.Property;
    class Root extends ObjectBase {
        private static _instance;
        static readonly Instance: Root;
        static Init(selectorString: string): void;
        private _dom;
        readonly Dom: HTMLElement;
        private _size;
        readonly Size: Property.Size;
        private _isDragging;
        private _dragStartMousePosition;
        private constructor();
        Refresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    enum Direction {
        Horizontal = 0,
        Vertical = 1
    }
    class SlidablePanelControlView extends PanelControlView {
        readonly Direction: Direction;
        private _innerBackgroundColor;
        InnerBackgroundColor: string;
        private _innerPanelCount;
        InnerPanelCount: number;
        private _innerPanel;
        private _isDragging;
        private _spcvMouseSuppressor;
        private _spcvDelayedResumeEventsTimer;
        private _dragStartMousePosition;
        private _dragStartViewPosition;
        constructor(direction: Direction);
        protected Init(): void;
        private SpcvDelayedResumeMouseEvents;
        private InitView;
        private AdjustSlidePosition;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
