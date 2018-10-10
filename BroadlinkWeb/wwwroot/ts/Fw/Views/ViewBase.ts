/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../ObjectBase.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;

    export abstract class ViewBase extends ObjectBase implements IView {
        // Refresh() Multiple execution suppressor
        private _lastRefreshTimer: number;
        private _lastRefreshedTime: Date;

        private _initialized: boolean = false;
        private _isSuppressLayout: boolean = false;

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


        constructor(jqueryElem: JQuery) {
            super();

            this.SetElem(jqueryElem);

            this.Init();
        }

        protected SetElem(jqueryElem: JQuery): void {
            if (!jqueryElem)
                return;

            super.SetElem(jqueryElem);
            this._dom = jqueryElem.get(0) as HTMLElement;
        }

        protected Init(): void {
            this.SetClassName('ViewBase');
            this.Elem.addClass('IView');

            this._page = null;
            this._parent = null;
            this._children = new Array<IView>();
            this._size = new Property.Size(this);
            this._position = new Property.Position(this);
            this._anchor = new Property.Anchor(this);
            this._color = '#000000';

            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();

            this.AddEventListener(Events.SizeChanged, () => {
                this.Refresh();
            });
            this.AddEventListener(Events.PositionChanged, () => {
                this.Refresh();
            });
            this.AddEventListener(Events.AnchorChanged, () => {
                this.Refresh();
            });
            this.AddEventListener(Events.Attached, () => {
                this.InitPage();
                this.InitHasAnchor();
            });
            this.AddEventListener(Events.Detached, () => {
                this._page = null;
                this.InitHasAnchor();
            });
            this.AddEventListener(Events.Initialized, () => {
                this.InitPage();
                this.InitHasAnchor();
            });

            this.IsVisible()
                ? this.DispatchEvent(Events.Shown)
                : this.DispatchEvent(Events.Hidden);

            // 画面リサイズ時に再描画
            Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, () => {
                this.Refresh();
            });
        }

        protected InitPage(): void {
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
            this._parent = parent;
        }

        public SetSize(width: number, height: number): void {
            this.Size.Width = width;
            this.Size.Height = height;
        }

        public SetXY(x: number, y: number, setPolicy: boolean = true): void {
            if (setPolicy)
                this.Position.Policy = Property.PositionPolicy.Centering;

            this.Position.X = x;
            this.Position.Y = y;
        }

        public SetLeftTop(left: number, top: number, setPolicy: boolean = true): void {
            if (setPolicy)
                this.Position.Policy = Property.PositionPolicy.LeftTop;

            this.Position.Left = left;
            this.Position.Top = top;
        }

        public SetAnchor(top: number, left: number, right: number, bottom: number): void {
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

        private InitHasAnchor(): void {
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
            if (this.Children.indexOf(view) == -1) {
                view.SetParent(this);
                this.Children.push(view);
                this.Elem.append(view.Elem);
                view.Refresh();
                view.DispatchEvent(Events.Attached);
            }
        }

        public Remove(view: IView): void {
            const index = this.Children.indexOf(view);
            if (index != -1) {
                view.SetParent(null);
                this.Children.splice(index, 1);
                view.Elem.detach();
                view.DispatchEvent(Events.Detached);
            }
        }

        public Refresh(): void {
            if (this._isSuppressLayout)
                return;

            // 子ViewもRefreshさせる。
            _.each(this.Children, (view: IView) => {
                view.Refresh();
            });

            if (this._lastRefreshTimer != null) {
                clearTimeout(this._lastRefreshTimer);
                this._lastRefreshTimer = null;

                if (!this._lastRefreshedTime)
                    this._lastRefreshedTime = new Date();

                const now = new Date();
                const elapsed = (now.getTime() - this._lastRefreshedTime.getTime());

                // 描画抑止中でも、300msに一度は描画する。
                if (elapsed > 300) {
                    this.InnerRefresh();
                    return;
                }
            }

            this._lastRefreshTimer = setTimeout(() => {
                this.InnerRefresh();
            }, 10);
        }

        protected InnerRefresh(): void {
            try {
                //Dump.Log(`${this.ClassName}.InnerRefresh`);
                const parent = $(this.Elem.parent());

                if (parent.length <= 0)
                    return;

                if (!this._page)
                    this.InitPage();

                this.SuppressEvent(Events.SizeChanged);
                this.SuppressEvent(Events.PositionChanged);
                this.SuppressLayout();

                // 最初の描画開始直前を初期化終了とする。
                if (!this._initialized) {
                    this.DispatchEvent(Events.Initialized);
                    this._initialized = true;
                }

                const parentWidth = (this.Parent)
                    ? this.Parent.Size.Width
                    : parent.width();
                const parentHeight = (this.Parent)
                    ? this.Parent.Size.Height
                    : parent.height();

                const pHalfWidth = (parentWidth / 2);
                const pHalfHeight = (parentHeight / 2);

                //let isAnchoredX: boolean = false;
                //let isAnchoredY: boolean = false;

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

                const myHalfWidth = this.Size.Width / 2;
                const myHalfHeight = this.Size.Height / 2;
                let elemLeft = pHalfWidth - myHalfWidth + this.Position.X;
                let elemTop = pHalfHeight - myHalfHeight + this.Position.Y;

                if (this.Page) {
                    if (!this.Anchor.HasAnchorX)
                        elemLeft += this.Page.DraggedPosition.X;
                    if (!this.Anchor.HasAnchorY)
                        elemTop += this.Page.DraggedPosition.Y;
                }

                //Dump.Log({
                //    left: this.Position.Left,
                //    pHalfWidth: pHalfWidth,
                //    myHalfWidth: myHalfWidth,
                //    positionX: this.Position.X,
                //    elemLeft: elemLeft
                //});

                this.Dom.style.left = `${elemLeft}px`;
                this.Dom.style.top = `${elemTop}px`;
                this.Dom.style.width = `${this.Size.Width}px`;
                this.Dom.style.height = `${this.Size.Height}px`;
                this.Dom.style.zIndex = `${this.ZIndex}`;
                this.Dom.style.color = `${this._color}`;
                this.Dom.style.backgroundColor = `${this._backgroundColor}`;

                this._lastRefreshedTime = new Date();
            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeEvent(Events.SizeChanged);
                this.ResumeEvent(Events.PositionChanged);
                this.ResumeLayout();
            }
        }

        public SuppressLayout(): void {
            this._isSuppressLayout = true;
        }

        public IsSuppressedLayout(): boolean {
            return this._isSuppressLayout;
        }

        public ResumeLayout(): void {
            this._isSuppressLayout = false;
        }

        public Show(duration: number = 200): void {
            if (this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams = Anim.Params.GetResized(this, 0.8);
            animator.FromParams.Opacity = 0;
            animator.ToParams.Opacity = 1.0;
            animator.OnComplete = () => {
                this.Dom.style.display = `block`;
                this.Refresh();
                this.DispatchEvent(Events.Shown);
            }

            animator.Invoke(duration);
        }

        public Hide(duration: number = 200): void {
            if (!this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams.Opacity = 1.0;
            animator.ToParams = Anim.Params.GetResized(this, 0.8);
            animator.ToParams.Opacity = 0.0;
            animator.OnComplete = () => {
                this.Dom.style.display = `none`;
                this.Refresh();
                this.DispatchEvent(Events.Hidden);
            };

            animator.Invoke(duration);
        }

        public IsVisible(): boolean {
            return this.Elem.is(':visible');
        }

        public Dispose(): void {
            super.Dispose();

            _.each(this.Children, (view) => {
                view.Dispose();
            });
            this._children = null;

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