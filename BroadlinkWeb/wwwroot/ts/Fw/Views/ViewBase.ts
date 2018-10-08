/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/Animation/Animator.ts" />
/// <reference path="../../Fw/Views/Animation/Params.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="./Size.ts" />

namespace Fw.Views {
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;
    import Dump = Fw.Util.Dump;

    export abstract class ViewBase implements IView {
        // Refresh() Multiple execution suppressor
        private _lastRefreshTimer: number;
        private _lastRefreshedTime: Date;

        private _initialized: boolean = false;

        private _suppressedEvents: Array<string> = new Array<string>();

        // Properties
        public Elem: JQuery;
        public readonly Dom: HTMLElement;
        public Parent: IView;
        public Children: Array<IView>;
        public ClassName: string;

        private _size: Size;
        public get Size(): Size {
            return this._size;
        }

        private _position: Position;
        public get Position(): Position {
            return this._position;
        }

        private _anchor: Anchor;
        public get Anchor(): Anchor {
            return this._anchor;
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
            this.Children = new Array<IView>();
            this.Elem = jqueryElem;
            this.Dom = jqueryElem.get(0) as HTMLElement
            this.ClassName = 'ViewBase';

            this.Init();
        }

        protected Init(): void {
            this._size = new Size(this);
            this._position = new Position(this);
            this._anchor = new Anchor(this);

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

            this._color = '#000000';

            this.Elem.addClass('IView');

            this.IsVisible()
                ? this.DispatchEvent(Events.Shown)
                : this.DispatchEvent(Events.Hidden);
        }

        public SetSize(width: number, height: number): void {
            this.Size.Width = width;
            this.Size.Height = height;
        }

        public SetPosition(x: number, y: number): void {
            this.Position.X = x;
            this.Position.Y = y;
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

        public SetPositionByLeftTop(left: number, top: number): void {
            const parent = $(this.Elem.parent());

            const parentWidth = (this.Parent)
                ? this.Parent.Size.Width
                : parent.width();
            const parentHeight = (this.Parent)
                ? this.Parent.Size.Height
                : parent.height();

            const pHalfLeft = (parentWidth / 2);
            const pHalfTop = (parentHeight / 2);

            const myHalfLeft = (this.Size.Width / 2);
            const myHalfTop = (this.Size.Height / 2);

            if (_.isNumber(left))
                this.Position.X = myHalfLeft - pHalfLeft + left;
            if (_.isNumber(top))
                this.Position.Y = myHalfTop - pHalfTop + top;
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

        public Add(view: IView): void {
            if (this.Children.indexOf(view) == -1) {
                view.Parent = this;
                this.Children.push(view);
                this.Elem.append(view.Elem);
                view.Refresh();
                view.DispatchEvent(Events.Attached);
            }
        }

        public Remove(view: IView): void {
            const index = this.Children.indexOf(view);
            if (index != -1) {
                view.Parent = null;
                this.Children.splice(index, 1);
                view.Elem.detach();
                view.DispatchEvent(Events.Detached);
            }
        }

        public Show(duration: number = 200): void {
            if (this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams = Anim.Params.GetResized(this, 0.8);
            animator.FromParams.Opacity = 0;
            animator.ToParams = Anim.Params.GetCurrent(this);
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
            animator.FromParams = Anim.Params.GetCurrent(this);
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

        public Refresh(): void {
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
                Dump.Log(`${this.ClassName}.InnerRefresh`);
                const parent = $(this.Elem.parent());

                if (parent.length <= 0)
                    return;

                // 最初の描画開始直前を初期化終了とする。
                if (!this._initialized) {
                    this.DispatchEvent(Events.Initialized);
                    this._initialized = true;
                }

                this.SuppressEvent(Events.SizeChanged);
                this.SuppressEvent(Events.PositionChanged);

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

                const myHalfWidth = this.Size.Width / 2;
                const myHalfHeight = this.Size.Height / 2;
                const elemLeft = pHalfWidth - myHalfWidth + this.Position.X;
                const elemTop = pHalfHeight - myHalfHeight + this.Position.Y;

                Dump.Log({
                    left: this.Position.Left,
                    pHalfWidth: pHalfWidth,
                    myHalfWidth: myHalfWidth,
                    positionX: this.Position.X,
                    elemLeft: elemLeft
                });

                this.Dom.style.left = `${elemLeft}px`;
                this.Dom.style.top = `${elemTop}px`;
                this.Dom.style.width = `${this.Size.Width}px`;
                this.Dom.style.height = `${this.Size.Height}px`;
                this.Dom.style.color = `${this._color}`;
                this.Dom.style.backgroundColor = `${this._backgroundColor}`;

                this._lastRefreshedTime = new Date();
            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeEvent(Events.SizeChanged);
                this.ResumeEvent(Events.PositionChanged);
            }
        }

        public AddEventListener(name: string, handler: (e: JQueryEventObject) => void): void {
            this.Elem.on(name, handler);
        }

        public RemoveEventListener(name: string, handler: (e: JQueryEventObject) => void): void {
            this.Elem.off(name, handler);
        }

        public DispatchEvent(name: string): void {
            if (this.IsSuppressedEvent(name))
                return;

            Dump.Log(`${this.ClassName}.DispatchEvent: ${name}`);
            this.Elem.trigger(name);
        }

        public SuppressEvent(name: string): void {
            if (this.IsSuppressedEvent(name))
                return;

            this._suppressedEvents.push(name);
        }

        public IsSuppressedEvent(name: string): boolean {
            return (this._suppressedEvents.indexOf(name) !== -1);
        }

        public ResumeEvent(name: string): void {
            if (!this.IsSuppressedEvent(name))
                return;

            const idx = this._suppressedEvents.indexOf(name);
            this._suppressedEvents.splice(idx, 1);
        }

        public Dispose(): void {
            _.each(this.Children, (view) => {
                view.Dispose();
            });
            this.Children = null;

            this.Elem.remove();
            this.Elem = null;

            this._size.Dispose();
            this._position.Dispose();
            this._anchor.Dispose();
        }
    }
}