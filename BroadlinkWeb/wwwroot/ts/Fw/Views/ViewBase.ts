/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="IView.ts" />
/// <reference path="../EventableBase.ts" />

/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="../Events/RootEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;
    import RootEvents = Fw.Events.RootEvents;

    export abstract class ViewBase extends EventableBase implements IView {
        // Properties
        private _dom: HTMLElement = null;
        public get Dom(): HTMLElement {
            return this._dom;
        }

        private _page: PageView;
        public get Page(): PageView {
            return this._page;
        }

        private _parent: IView;
        public get Parent(): IView {
            return this._parent;
        };
        public set Parent(value: IView) {
            this._parent = value;
        }

        private _children: Array<IView>;
        public get Children(): Array<IView> {
            return this._children;
        }

        private _size: Property.Size;
        public get Size(): Property.Size {
            return this._size;
        }

        private _position: Property.Position;
        public get Position(): Property.Position {
            return this._position;
        }

        private _anchor: Property.Anchor;
        public get Anchor(): Property.Anchor {
            return this._anchor;
        }
        private _zIndex: number = 0;
        public get ZIndex(): number {
            return this._zIndex;
        }
        public set ZIndex(value: number) {
            this._zIndex = value;
            this.Refresh();
        }

        private _color: string = '#000000';
        public get Color(): string {
            return this._color;
        }
        public set Color(value: string) {
            this._color = value;
            this.Refresh();
        }

        private _backgroundColor: string = '#FFFFFF';
        public get BackgroundColor(): string {
            return this._backgroundColor;
        }
        public set BackgroundColor(value: string) {
            this._backgroundColor = value;
            this.Refresh();
        }

        private _opacity: number = 1.0;
        public get Opacity(): number {
            return this._opacity;
        }
        public set Opacity(value: number) {
            this._opacity = value;
            this.Refresh();
        }

        private _isVisible: boolean = true;
        public get IsVisible(): boolean {
            return this._isVisible;
        }
        public set IsVisible(value: boolean) {
            this._isVisible = value;
            this.Refresh();
        }

        private _isInitialized: boolean = false;
        public get IsInitialized(): boolean {
            return this._isInitialized;
        }

        // Refresh() Multiple execution suppressor
        private _refresher: Fw.Util.DelayedOnceExecuter;
        private _applyStyler: Fw.Util.DelayedOnceExecuter;


        private _isSuppressLayout: boolean = false;
        public get IsSuppressLayout(): boolean {
            return this._isSuppressLayout;
        }


        constructor(jqueryElem: JQuery) {
            super();

            //this.Log('ViewBase.Constructor');

            this.SetElem(jqueryElem);
            this.SetClassName('ViewBase');
            this.Elem.addClass('IView TransAnimation');

            this._children = new Array<IView>();
            this._size = new Property.Size(this);
            this._position = new Property.Position(this);
            this._anchor = new Property.Anchor(this);

            this._page = null;
            this._parent = null;
            this._color = '#000000';
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();

            this._refresher = new Fw.Util.DelayedOnceExecuter(
                this,
                this.InnerRefresh.bind(this),
                10,
                3000 //Fw.Root.Instance.ViewRefreshInterval
                , true
            );
            this._refresher.Name = 'Refresher';

            this._applyStyler = new Fw.Util.DelayedOnceExecuter(
                this,
                this.InnerApplyStyles.bind(this),
                10,
                3000 //Fw.Root.Instance.ViewRefreshInterval
                , true
            );
            this._applyStyler.Name = 'ApplyStyler';

            this.AddEventListener(Events.SizeChanged, (e) => {
                e.stopPropagation();
                this.Refresh();
            });
            this.AddEventListener(Events.PositionChanged, (e) => {
                e.stopPropagation();
                this.Refresh();
            });
            this.AddEventListener(Events.AnchorChanged, (e) => {
                e.stopPropagation();
                this.Refresh();
            });
            this.AddEventListener(Events.Attached, (e) => {
                e.stopPropagation();
                this.InitPage();
                this.InitHasAnchor();
            });
            this.AddEventListener(Events.Detached, (e) => {
                e.stopPropagation();
                this._page = null;
                this.InitHasAnchor();
            });
            this.AddEventListener(Events.Initialized, (e) => {
                e.stopPropagation();
                this.InitPage();
                this.InitHasAnchor();
            });

            Fw.Root.Instance.AddEventListener(RootEvents.PageInitializeStarted, () => {
                this._refresher.Timeout = Fw.Root.Instance.ViewRefreshInterval;
                this._applyStyler.Timeout = Fw.Root.Instance.ViewRefreshInterval;
            }, this);
            Fw.Root.Instance.AddEventListener(RootEvents.PageInitializeCompleted, () => {
                this._refresher.Timeout = Fw.Root.Instance.ViewRefreshInterval;
                this._applyStyler.Timeout = Fw.Root.Instance.ViewRefreshInterval;
            }, this);

            _.delay(() => {
                if (this.IsDisposed)
                    return;

                this._refresher.Timeout = Fw.Root.Instance.ViewRefreshInterval;
                this._applyStyler.Timeout = Fw.Root.Instance.ViewRefreshInterval;
            }, 3000);

            // 初期化終了イベント
            if (!this._isInitialized) {
                this._isInitialized = true;
                this.DispatchEvent(Events.Initialized);
                this.Refresh();
            }
        }

        protected SetElem(jqueryElem: JQuery): void {
            //this.Log('ViewBase.SetElem');

            if (!jqueryElem)
                return;

            super.SetElem(jqueryElem);
            this._dom = jqueryElem.get(0) as HTMLElement;
        }

        protected InitPage(): void {
            //this.Log('ViewBase.InitPage');

            const get = (view: IView) => {
                if (!view)
                    return null;
                else if (view instanceof PageView)
                    return view;
                else
                    return get(view.Parent);
            };
            this._page = get(this);
        }

        public SetParent(parent: IView): void {
            //this.Log('ViewBase.SetParent');

            this._parent = parent;
        }

        public SetSize(width: number, height: number): void {
            //this.Log('ViewBase.SetSize');

            this.Size.Width = width;
            this.Size.Height = height;
        }

        public SetXY(x: number, y: number, updatePolicy: boolean = true): void {
            //this.Log('ViewBase.SetXY');

            if (updatePolicy)
                this.Position.Policy = Property.PositionPolicy.Centering;

            this.Position.X = x;
            this.Position.Y = y;
        }

        public SetLeftTop(left: number, top: number, updatePolicy: boolean = true): void {
            //this.Log('ViewBase.SetLeftTop');

            if (updatePolicy)
                this.Position.Policy = Property.PositionPolicy.LeftTop;

            this.Position.Left = left;
            this.Position.Top = top;
        }

        public SetAnchor(top: number, left: number, right: number, bottom: number): void {
            //this.Log('ViewBase.SetAnchor');

            if (_.isNumber(top)) {
                this.Anchor.IsAnchoredTop = true;
                this.Anchor.MarginTop = top;
            } else {
                this.Anchor.IsAnchoredTop = false;
                this.Anchor.MarginTop = null;
            }

            if (_.isNumber(left)) {
                this.Anchor.IsAnchoredLeft = true;
                this.Anchor.MarginLeft = left;
            } else {
                this.Anchor.IsAnchoredLeft = false;
                this.Anchor.MarginLeft = null;
            }

            if (_.isNumber(right)) {
                this.Anchor.IsAnchoredRight = true;
                this.Anchor.MarginRight = right;
            } else {
                this.Anchor.IsAnchoredRight = false;
                this.Anchor.MarginRight = null;
            }

            if (_.isNumber(bottom)) {
                this.Anchor.IsAnchoredBottom = true;
                this.Anchor.MarginBottom = bottom;
            } else {
                this.Anchor.IsAnchoredBottom = false;
                this.Anchor.MarginBottom = null;
            }
        }

        public SetDisplayParams(
            width: number,
            height: number,
            x: number = undefined,
            y: number = undefined,
            color: string = undefined,
            backgroundColor: string = undefined
        ): void {
            //this.Log('ViewBase.SetDisplayParams');

            if (width !== undefined)
                this.Size.Width = width;
            if (height !== undefined)
                this.Size.Height = height;
            if (x !== undefined)
                this.Position.X = x;
            if (y !== undefined)
                this.Position.Y = y;
            if (color !== undefined)
                this.Color = color;
            if (backgroundColor !== undefined)
                this.BackgroundColor = backgroundColor;
        }

        public SetTransAnimation(enable: boolean): void {
            //this.Log('ViewBase.SetTransAnimation');

            if (enable) {
                // アニメーション有効化
                if (!this.Elem.hasClass('TransAnimation'))
                    this.Elem.addClass('TransAnimation');
                if (this.Elem.hasClass('NoTransAnimation'))
                    this.Elem.removeClass('NoTransAnimation');
            } else {
                // アニメーション無効化
                if (this.Elem.hasClass('TransAnimation'))
                    this.Elem.removeClass('TransAnimation');
                if (!this.Elem.hasClass('NoTransAnimation'))
                    this.Elem.addClass('NoTransAnimation');
            }
        }

        public HasTransAnimation(): boolean {
            //this.Log('ViewBase.HasTransAnimation');

            return this.Elem.hasClass('TransAnimation');
        }

        protected InitHasAnchor(): void {
            //this.Log('ViewBase.InitHasAnchor');

            let hasAnchorX: boolean = (this.Anchor.IsAnchoredLeft || this.Anchor.IsAnchoredRight);
            let hasAnchorY: boolean = (this.Anchor.IsAnchoredTop || this.Anchor.IsAnchoredBottom);

            const recAnchor = function (view: IView) {
                if (!view)
                    return;

                if (!hasAnchorX) {
                    hasAnchorX = (view.Anchor.IsAnchoredLeft || view.Anchor.IsAnchoredRight);
                }
                if (!hasAnchorY) {
                    hasAnchorY = (view.Anchor.IsAnchoredTop || view.Anchor.IsAnchoredBottom);
                }

                recAnchor(view.Parent);
            };
            recAnchor(this.Parent);

            this.Anchor.SetHasAnchor(hasAnchorX, hasAnchorY);
        }

        public Add(view: IView): void {
            //this.Log('ViewBase.Add');

            if (this.Children.indexOf(view) == -1) {
                view.SetParent(this);
                this.Children.push(view);
                this.Elem.append(view.Elem);
                view.Refresh();
                view.DispatchEvent(Events.Attached);
            }
        }

        public Remove(view: IView): void {
            //this.Log('ViewBase.Remove');

            const index = this.Children.indexOf(view);
            if (index !== -1) {
                view.SetParent(null);
                this.Children.splice(index, 1);
                view.Elem.detach();
                view.DispatchEvent(Events.Detached);
            } else {
                this.Log('削除できなかった。');
                this.Log(view);
            }
        }

        /**
         * デバッグ用 - 所属元文字列を再帰的に取得する
         * @param current
         * @param obj
         */
        private _parentString: string = null;
        protected GetParentsString(current: string = null): string {
            if (!this.Page) {
                return `${this.ObjectIdentifier} ** Has No Page **`;
            } else {
                if (!this._parentString)
                    this._parentString = this.InnerGetParentsString();
                return this._parentString;
            }
        }

        private InnerGetParentsString(current: string = null): string {
            const result = (current === null)
                ? `${this.ObjectIdentifier}`
                : `${current}-${this.ObjectIdentifier}`;

            return (!this.Parent)
                ? result
                : (this.Parent as ViewBase).InnerGetParentsString(result);
        }

        public Refresh(): void {
            this.Log('ViewBase.Refresh');
            if (this._isSuppressLayout || !this._isInitialized)
                return;

            this._refresher.Exec();
        }

        protected InnerRefresh(): void {
            this.Log(`ViewBase.InnerRefresh - ${this.GetParentsString()}`);
            const parent = $(this.Elem.parent());

            if (parent.length <= 0)
                return;

            if (!this._page && !(this instanceof PageView))
                this.InitPage();

            this.CalcLayout();

            const parentWidth = (this.Parent)
                ? this.Parent.Size.Width
                : parent.width();
            const parentHeight = (this.Parent)
                ? this.Parent.Size.Height
                : parent.height();

            const pHalfWidth = (parentWidth / 2);
            const pHalfHeight = (parentHeight / 2);

            const myHalfWidth = this.Size.Width / 2;
            const myHalfHeight = this.Size.Height / 2;

            let elemLeft = pHalfWidth - myHalfWidth + this.Position.X;
            let elemTop = pHalfHeight - myHalfHeight + this.Position.Y;

            //this.Log({
            //    left: this.Position.Left,
            //    pHalfWidth: pHalfWidth,
            //    myHalfWidth: myHalfWidth,
            //    positionX: this.Position.X,
            //    elemLeft: elemLeft
            //});

            this.SetStyles({
                left: `${elemLeft}px`,
                top: `${elemTop}px`,
                width: `${this.Size.Width}px`,
                height: `${this.Size.Height}px`,
                zIndex: `${this.ZIndex}`,
                color: `${this._color}`,
                backgroundColor: `${this._backgroundColor}`,
                opacity: `${this.Opacity}`,
                display: (this._isVisible)
                    ? 'block'
                    : 'none'
            });
            _.defer(() => {
                this.ApplyStyles();

                // 子ViewをRefreshさせる。
                _.each(this.Children, (view: IView) => {
                    view.Refresh();
                });
            });
        }

        public CalcLayout(): void {
            //this.Log('ViewBase.CalcLayout');

            const parent = $(this.Elem.parent());

            if (parent.length <= 0)
                return;

            const isSuppressLayout =  this.IsSuppressedLayout();
            const isSuppressSizeChanged = this.IsSuppressedEvent(Events.SizeChanged);
            const isSuppressPositionChanged = this.IsSuppressedEvent(Events.PositionChanged);

            try {
                if (!isSuppressLayout)
                    this.SuppressLayout();
                if (!isSuppressSizeChanged)
                    this.SuppressEvent(Events.SizeChanged);
                if (!isSuppressPositionChanged)
                    this.SuppressEvent(Events.PositionChanged);

                this.SuppressLayout();

                const parentWidth = (this.Parent)
                    ? this.Parent.Size.Width
                    : parent.width();
                const parentHeight = (this.Parent)
                    ? this.Parent.Size.Height
                    : parent.height();

                const pHalfWidth = (parentWidth / 2);
                const pHalfHeight = (parentHeight / 2);

                if (this.Anchor.IsAnchoredLeft && this.Anchor.IsAnchoredRight) {
                    this.Size.Width = parentWidth - this.Anchor.MarginLeft - this.Anchor.MarginRight;
                    this.Position.X = this.Anchor.MarginLeft - pHalfWidth + (this.Size.Width / 2);
                } else {
                    this.Size.Width = _.isNumber(this.Size.Width)
                        ? this.Size.Width
                        : 30;

                    if (this.Anchor.IsAnchoredLeft) {
                        this.Position.X = this.Anchor.MarginLeft - pHalfWidth + (this.Size.Width / 2);
                    } else if (this.Anchor.IsAnchoredRight) {
                        let left = parentWidth - this.Anchor.MarginRight - this.Size.Width;
                        this.Position.X = left - pHalfWidth + (this.Size.Width / 2);
                    }
                }

                if (this.Anchor.IsAnchoredTop && this.Anchor.IsAnchoredBottom) {
                    this.Size.Height = parentHeight - this.Anchor.MarginTop - this.Anchor.MarginBottom;
                    this.Position.Y = this.Anchor.MarginTop - pHalfHeight + (this.Size.Height / 2);
                } else {
                    this.Size.Height = _.isNumber(this.Size.Height)
                        ? this.Size.Height
                        : 30;

                    if (this.Anchor.IsAnchoredTop) {
                        this.Position.Y = this.Anchor.MarginTop - pHalfHeight + (this.Size.Height / 2);
                    } else if (this.Anchor.IsAnchoredBottom) {
                        let top = parentHeight - this.Anchor.MarginBottom - this.Size.Height;
                        this.Position.Y = top - pHalfHeight + (this.Size.Height / 2);
                    }
                }
            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                if (!isSuppressLayout)
                    this.ResumeLayout();
                if (!isSuppressSizeChanged)
                    this.ResumeEvent(Events.SizeChanged);
                if (!isSuppressPositionChanged)
                    this.ResumeEvent(Events.PositionChanged);
                this.ResumeLayout();
            }
        }

        private _innerApplyCount: number = 0;
        private _latestStyles: { [name: string]: string } = {};
        private _newStyles: { [name: string]: string } = {};
        public SetStyle(name: string, value: string): void {
            //this.Log('ViewBase.SetStyle');

            this._newStyles[name] = value;
        }
        public SetStyles(styles: { [name: string]: string }): void {
            //this.Log('ViewBase.SetStyles');

            _.extend(this._newStyles, styles);
        }
        public ApplyStyles(): void {
            //this.Log('ViewBase.ApplyStyles');

            this._applyStyler.Exec();
        }

        protected InnerApplyStyles(): void {
            this._innerApplyCount++;

            //this.Log(`ViewBase.InnerApplyStyles: ${this._innerApplyCount}`);
            _.each(this._newStyles, (v, k) => {
                if (this._latestStyles[k] !== v) {
                    this.Dom.style[k] = v;
                    this._latestStyles[k] = v;
                }
            });

            this._newStyles = {};
            Root.Instance.ReleasePageInitialize(this);
        }

        public SuppressLayout(): void {
            //this.Log('ViewBase.SuppressLayout');

            this._isSuppressLayout = true;
        }

        public IsSuppressedLayout(): boolean {
            //this.Log('ViewBase.IsSuppressedLayout');

            return this._isSuppressLayout;
        }

        public ResumeLayout(): void {
            //this.Log('ViewBase.ResumeLayout');

            this._isSuppressLayout = false;
        }

        public Show(duration: number = 200): void {
            //this.Log('ViewBase.Show');

            if (this.IsVisible) {
                this.Refresh();
                return;
            }

            if (duration <= 0) {
                this.IsVisible = true;
                this.DispatchEvent(Events.Shown);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetResized(this, 0.8);
                animator.FromParams.Opacity = 0;
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = () => {
                    this.IsVisible = true;
                    this.DispatchEvent(Events.Shown);
                }

                animator.Invoke(duration);
            }
        }

        public Hide(duration: number = 200): void {
            //this.Log('ViewBase.Hide');

            if (!this.IsVisible) {
                this.Refresh();
                return;
            }

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetResized(this, 0.8);
                animator.ToParams.Opacity = 0.0;
                animator.OnComplete = () => {
                    this.IsVisible = false;
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

        public Dispose(): void {
            super.Dispose();

            var ary = Util.Obj.Mirror(this.Children);
            _.each(ary, (view: Fw.Views.IView) => {
                this.Remove(view);
                view.Dispose();
            });
            this._children = null;

            this._parent = null;

            this._dom = null;

            this._size.Dispose();
            this._size = null;

            this._position.Dispose();
            this._position = null;

            this._anchor.Dispose();
            this._anchor = null;

            this._color = null;
            this._backgroundColor = null;
        }
    }
}
