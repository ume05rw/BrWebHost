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
declare namespace Fw {
    interface IObject {
        readonly Elem: JQuery;
        readonly ClassName: string;
        AddEventListener(name: string, handler: (e: JQueryEventObject) => void, bindObject?: IObject): void;
        RemoveEventListener(name: string, handler?: (e: JQueryEventObject) => void): void;
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
        Opacity: number;
        IsVisible: boolean;
        readonly IsInitialized: boolean;
        SetParent(parent: IView): void;
        SetSize(width: number, height: number): void;
        SetXY(x: number, y: number, updatePolicy?: boolean): void;
        SetLeftTop(left: number, top: number, updatePolicy?: boolean): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;
        SetDisplayParams(width: number, height: number, x: number, y: number, color: string, backgroundColor: string): void;
        SetTransAnimation(enable: boolean): void;
        HasTransAnimation(): boolean;
        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        SetStyle(name: string, value: string): void;
        SetStyles(styles: {
            [name: string]: string;
        }): void;
        SuppressLayout(): void;
        IsSuppressedLayout(): boolean;
        ResumeLayout(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
    }
}
declare namespace Fw.Controllers {
    interface IController {
        readonly Id: string;
        readonly IsDefaultView: boolean;
        readonly View: Fw.Views.IView;
        readonly Manager: Fw.Controllers.Manager;
        readonly ClassName: string;
        SetClassName(name: string): void;
        SetPageView(view: Views.PageView): void;
        SetPageViewByJQuery(elem: JQuery): void;
        SwitchTo(id: string): void;
        SwitchController(controller: IController): void;
        SetModal(): void;
        HideModal(): void;
        SetUnmodal(): void;
        Dispose(): void;
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
        InitControllersByTemplates(): void;
        Add(controller: IController): void;
        Get(id: string): IController;
        Remove(id: string): void;
        private Reset;
        Set(id: string): void;
        SetController(controller: IController): void;
        SetModal(id: string): void;
        HideModal(id: string): void;
        SetUnmodal(id: string): void;
    }
}
declare namespace Fw.Controllers {
    /**
     * @see コントローラはイベント等の実装が無いので、IObjectを実装しない。
     * */
    abstract class ControllerBase implements IController {
        private _id;
        readonly Id: string;
        IsDefaultView: boolean;
        private _view;
        readonly View: Fw.Views.PageView;
        private _manager;
        readonly Manager: Fw.Controllers.Manager;
        private _className;
        readonly ClassName: string;
        constructor(id?: string, jqueryElem?: JQuery);
        SetClassName(name: string): void;
        SetPageView(view: Views.PageView): void;
        SetPageViewByJQuery(elem: JQuery): void;
        SwitchTo(id: string): void;
        SwitchController(controller: IController): void;
        SetModal(): void;
        HideModal(): void;
        SetUnmodal(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Events {
    class BoxViewEventsClass extends ViewEventsClass {
    }
    const BoxViewEvents: BoxViewEventsClass;
}
declare namespace Fw.Events {
    class ControlViewEventsClass extends BoxViewEventsClass {
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
        AddEventListener(name: string, handler: (e: JQueryEventObject) => void, bindObject?: IObject): void;
        RemoveEventListener(name: string, handler?: (e: JQueryEventObject) => void): void;
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
        private _opacity;
        Opacity: number;
        private _isVisible;
        IsVisible: boolean;
        private _isInitialized;
        readonly IsInitialized: boolean;
        private _lastRefreshTimer;
        private _lastRefreshedTime;
        private _isSuppressLayout;
        constructor(jqueryElem: JQuery);
        protected SetElem(jqueryElem: JQuery): void;
        protected InitPage(): void;
        SetParent(parent: IView): void;
        SetSize(width: number, height: number): void;
        SetXY(x: number, y: number, updatePolicy?: boolean): void;
        SetLeftTop(left: number, top: number, updatePolicy?: boolean): void;
        SetAnchor(top: number, left: number, right: number, bottom: number): void;
        SetDisplayParams(width: number, height: number, x?: number, y?: number, color?: string, backgroundColor?: string): void;
        SetTransAnimation(enable: boolean): void;
        HasTransAnimation(): boolean;
        private InitHasAnchor;
        Add(view: IView): void;
        Remove(view: IView): void;
        Refresh(): void;
        protected InnerRefresh(): void;
        private _lastApplyTimer;
        private _lastAppliedTime;
        private _innerApplyCount;
        private _latestStyles;
        private _newStyles;
        SetStyle(name: string, value: string): void;
        SetStyles(styles: {
            [name: string]: string;
        }): void;
        protected ApplyStyles(): void;
        protected InnerApplyStyles(): void;
        SuppressLayout(): void;
        IsSuppressedLayout(): boolean;
        ResumeLayout(): void;
        Show(duration?: number): void;
        Hide(duration?: number): void;
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
        private _isMasked;
        readonly IsMasked: boolean;
        private _isModal;
        readonly IsModal: boolean;
        constructor(jqueryElem?: JQuery);
        SuppressDragging(): void;
        IsSuppressDragging(): boolean;
        ResumeDragging(): void;
        private DetectToNeedDrags;
        Show(duration?: number): void;
        Hide(duration?: number): void;
        ShowModal(duration?: number, width?: number): void;
        HideModal(duration?: number): void;
        SetUnmodal(duration?: number): void;
        Mask(): void;
        UnMask(): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class BoxView extends ViewBase {
        private _hasBorder;
        HasBorder: boolean;
        private _borderRadius;
        BorderRadius: number;
        constructor();
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace App {
    class Color {
        static Transparent: string;
        static Main: string;
        static MainBackground: string;
        static MainHover: string;
        static HeaderButtonBackground: string;
        static HeaderButtonHover: string;
        static ReverseMain: string;
        static ButtonColors: Array<string>;
    }
}
declare namespace App.Views.Controls {
    class HeaderBarView extends Fw.Views.BoxView {
        Text: string;
        private _label;
        private _btnLeft;
        readonly LeftButton: App.Views.Controls.ButtonView;
        private _btnRight;
        readonly RightButton: App.Views.Controls.ButtonView;
        constructor();
        Dispose(): void;
    }
}
declare namespace App.Views.Pages {
    import Controls = App.Views.Controls;
    class MainPageView extends Fw.Views.PageView {
        HeaderBar: Controls.HeaderBarView;
        BtnGoSub1: Controls.ButtonView;
        BtnGoSub2: Controls.ButtonView;
        BtnGoSub3: Controls.ButtonView;
        BtnGoDynamic: Controls.ButtonView;
        constructor();
    }
}
declare namespace App.Controllers {
    class ControlSetController extends Fw.Controllers.ControllerBase {
        private _page;
        constructor();
    }
}
declare namespace App.Controllers {
    class LayoutCheckController extends Fw.Controllers.ControllerBase {
        constructor(id: string);
        private Init;
    }
}
declare namespace App.Controllers {
    class MainController extends Fw.Controllers.ControllerBase {
        constructor();
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
    }
}
declare namespace App.Controllers {
    class Sub2Controller extends Fw.Controllers.ControllerBase {
        constructor(id: string, jqueryElem: JQuery);
    }
}
declare namespace App.Controllers {
    class Sub3Controller extends Fw.Controllers.ControllerBase {
        constructor();
    }
}
declare namespace Fw.Views {
    class ControlView extends BoxView {
        private _label;
        private _tapEventTimer;
        private _cvMouseSuppressor;
        private _cvDelayedResumeEventsTimer;
        Text: string;
        constructor();
        protected InitPage(): void;
        private OnPageDragging;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class ButtonView extends ControlView {
        private _imageView;
        ImageSrc: string;
        /**
         * @see publicプロパティの初期化タイミングに注意。コンストラクタ実行後に値がセットされる。
         */
        HoverColor: string;
        constructor();
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace App.Views.Controls {
    class ButtonView extends Fw.Views.ButtonView {
        constructor();
    }
}
declare namespace Fw.Views {
    class RelocatableButtonView extends ButtonView {
        private _isRelocatable;
        readonly IsRelocatable: boolean;
        private _shadow;
        private _isMouseMoveEventListened;
        private _isDragging;
        private _dragStartMousePosition;
        private _dragStartViewPosition;
        private _gridSize;
        GridSize: number;
        /**
         * @description 配置時の左／上マージン。LeftTop配置時のみ有効。
         */
        private _margin;
        Margin: number;
        constructor();
        private OnMouseMove;
        private _delayedResumeTimer;
        private DelayedResume;
        SetRelocatable(relocatable: boolean): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace App.Views.Controls {
    import Views = Fw.Views;
    class LabeledButtonView extends Fw.Views.ControlView {
        private _buttonView;
        readonly Button: Views.ButtonView;
        private _labelView;
        readonly Label: Views.LabelView;
        /**
         * @see publicプロパティの初期化タイミングに注意。コンストラクタ実行後に値がセットされる。
         */
        HoverColor: string;
        constructor();
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace App.Views.Controls {
    import Views = Fw.Views;
    class ControlButtonView extends Views.RelocatableButtonView {
        constructor();
    }
}
declare namespace App.Views.Controls {
    import Views = Fw.Views;
    class ControlSetButtonView extends LabeledButtonView {
        private _toggle;
        readonly Toggle: Views.ToggleButtonView;
        constructor();
    }
}
declare namespace App.Views.Controls {
    class SceneButtonView extends LabeledButtonView {
        constructor();
        protected InnerRefresh(): void;
    }
}
declare namespace App.Views.Pages {
    import Views = Fw.Views;
    import Controls = App.Views.Controls;
    class ControlSetPageView extends Fw.Views.PageView {
        HeaderBar: Controls.HeaderBarView;
        EditButton: Controls.ButtonView;
        ButtonPanel: Views.SlidableBoxView;
        constructor();
        SetEditMode(): void;
        SetOperateMode(): void;
        ShowModal(duration?: number, width?: number): void;
        SetUnmodal(duration?: number): void;
        Show(duration?: number): void;
    }
}
declare namespace App.Views.Pages {
    import Views = Fw.Views;
    class LayoutCheckPageView extends Fw.Views.PageView {
        BtnGoSub1: Views.ButtonView;
        BtnGoSub2: Views.ButtonView;
        CenterControl: Views.ControlView;
        TmpCtl: Views.ControlView;
        Toggle: Views.ToggleButtonView;
        AncCtl1: Views.ButtonView;
        AncCtl2: Views.ButtonView;
        AncCtl3: Views.ButtonView;
        AncCtl4: Views.ButtonView;
        AncCtl5: Views.ButtonView;
        AncCtl6: Views.ButtonView;
        constructor();
    }
}
declare namespace App.Views.Pages {
    import Views = Fw.Views;
    class Sub3PageView extends Fw.Views.PageView {
        HeaderBar: Controls.HeaderBarView;
        Stucker: Views.StuckerBoxView;
        constructor();
    }
}
declare namespace App {
    class Main {
        static StartUp(): void;
    }
}
declare namespace Fw.Events {
    class ButtonViewEventsClass extends ControlViewEventsClass {
    }
    const ButtonViewEvents: ButtonViewEventsClass;
}
declare namespace Fw.Events {
    class ImageViewEventsClass extends ViewEventsClass {
    }
    const ImageViewEvents: ImageViewEventsClass;
}
declare namespace Fw.Events {
    class LabelViewEventsClass extends ViewEventsClass {
    }
    const LabelViewEvents: LabelViewEventsClass;
}
declare namespace Fw.Events {
    class LineViewEventsClass extends ViewEventsClass {
    }
    const LineViewEvents: LineViewEventsClass;
}
declare namespace Fw.Events {
    class RelocatableViewEventsClass extends ButtonViewEventsClass {
    }
    const RelocatableViewEvents: RelocatableViewEventsClass;
}
declare namespace Fw.Events {
    class RootEventsClass {
        readonly Resized: string;
        readonly MaskClicked: string;
    }
    const RootEvents: RootEventsClass;
}
declare namespace Fw.Events {
    class SlidableBoxViewEventsClass extends BoxViewEventsClass {
    }
    const SlidableBoxViewEvents: SlidableBoxViewEventsClass;
}
declare namespace Fw.Events {
    class StuckerBoxViewEventsClass extends BoxViewEventsClass {
    }
    const StuckerBoxViewEvents: StuckerBoxViewEventsClass;
}
declare namespace Fw.Events {
    class ToggleButtonViewEventsClass extends ControlViewEventsClass {
        readonly Switched: string;
        readonly ToOn: string;
        readonly ToOff: string;
    }
    const ToggleButtonViewEvents: ToggleButtonViewEventsClass;
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
declare namespace Fw.Views.Property {
    enum Direction {
        Horizontal = 0,
        Vertical = 1
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
     * @description font-weight
     */
    enum FontWeight {
        Lighter = "lighter",
        Normal = "normal",
        Bold = "bold",
        Bolder = "bolder"
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
declare namespace Fw.Views.Property {
    /**
     * @description 基点、スタッキング時の基準点
     */
    enum ReferencePoint {
        LeftTop = 1,
        RightTop = 2,
        LeftBottom = 3,
        RightBottom = 4
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
        protected InnerRefresh(): void;
        Dispose(): void;
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
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class LineView extends ViewBase {
        private _direction;
        readonly Direction: Property.Direction;
        private _length;
        Length: number;
        BackgroundColor: string;
        constructor(direction: Property.Direction);
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    import Property = Fw.Views.Property;
    class SlidableBoxView extends BoxView {
        readonly Children: Array<IView>;
        private _direction;
        readonly Direction: Property.Direction;
        private _innerBackgroundColor;
        InnerBackgroundColor: string;
        private _innerLength;
        InnerLength: number;
        private _innerBox;
        private _positionBarMax;
        private _positionBarCurrent;
        private _barMargin;
        private _isDragging;
        private _spcvMouseSuppressor;
        private _dragStartMousePosition;
        private _dragStartViewPosition;
        constructor(direction: Property.Direction);
        private InitView;
        private AdjustSlidePosition;
        Add(view: IView): void;
        Remove(view: IView): void;
        protected InnerRefresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    import Property = Fw.Views.Property;
    class StuckerBoxView extends BoxView {
        readonly Children: Array<IView>;
        private _margin;
        Margin: number;
        private _referencePoint;
        ReferencePoint: Property.ReferencePoint;
        private _innerBox;
        private _positionBarMax;
        private _positionBarCurrent;
        private _scrollMargin;
        private _backupView;
        private _dummyView;
        private _isChildRelocation;
        private _isChildDragging;
        private _isInnerDragging;
        private _relocationTargetView;
        private _dragStartMousePosition;
        private _dragStartViewPosition;
        constructor();
        Add(view: IView): void;
        Remove(view: IView): void;
        private OnInnerMouseDown;
        private OnInnerMouseMove;
        private OnInnerMouseUp;
        /**
         * 子要素がロングクリックされたとき
         * @param e1
         */
        private OnChildLongClick;
        StartRelocation(): void;
        /**
         * スタッカーBox自身がクリックされたとき
         * @param e1
         */
        private OnInnerSingleClick;
        CommitRelocation(): void;
        /**
         * 子要素上でマウスボタンが押されたとき
         * @param e
         */
        private OnChildMouseDown;
        /**
         * 子要素上でマウスが動いたとき
         * @param e1
         */
        private OnChildMouseMove;
        /**
         * 子要素上でマウスボタンが離れたとき
         * @param e
         */
        private OnChildMouseUp;
        private Swap;
        private GetNearestByView;
        private GetNearestByPosition;
        private SetDummyView;
        private RestoreDummyView;
        protected InnerRefresh(): void;
        private InnerRefreshLeftTop;
        private InnerRefreshRightTop;
        private InnerRefreshLeftBottom;
        private InnerRefreshRightBottom;
        private InnerRefreshPositionLine;
        Dispose(): void;
    }
}
declare namespace Fw.Views {
    class ToggleButtonView extends ControlView {
        HoverColor: string;
        private _value;
        Value: boolean;
        private _overMargin;
        private _sliderBox;
        private _notch;
        private _maskOn;
        constructor();
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
        private _masked;
        private _mask;
        private constructor();
        Mask(): void;
        UnMask(): void;
        SetTextSelection(enable: boolean): void;
        private _viewRefreshInterval;
        readonly ViewRefreshInterval: number;
        /**
         * @description ページ生成開始から一定時間、ViewのDom更新頻度を大幅に下げる。
         */
        private _lastInitializeTimer;
        StartPageInitialize(): void;
        private _releaseInitializeTimer;
        ReleasePageInitialize(): void;
        Refresh(): void;
        Dispose(): void;
    }
}
declare namespace Fw {
    class Startup {
        static Init(): void;
    }
}
