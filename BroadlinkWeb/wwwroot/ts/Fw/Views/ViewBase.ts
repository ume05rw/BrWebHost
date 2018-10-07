/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Views/Animation/Animator.ts" />
/// <reference path="../../Fw/Views/Animation/Params.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />

namespace Fw.Views {
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;

    export abstract class ViewBase implements IView {
        // events
        protected EventShown: Event = new Event(Events.Shown);
        protected EventHidden: Event = new Event(Events.Hidden);

        // Refresh() Multiple execution suppressor
        private _lastRefreshTimer: number;

        // Properties
        public Elem: JQuery;
        public readonly Dom: HTMLElement;
        public Children: Array<IView>;

        // Properties with set/get
        private _x: number;
        public get X(): number {
            return this._x;
        }
        public set X(value: number) {
            this._x = value;
            this.Refresh();
        }

        private _y: number;
        public get Y(): number {
            return this._y;
        }
        public set Y(value: number) {
            this._y = value;
            this.Refresh();
        }

        private _width: number;
        public get Width(): number {
            return this._width;
        }
        public set Width(value: number) {
            this._width = value;
            this.Refresh();
        }

        private _height: number;
        public get Height(): number {
            return this._height;
        }
        public set Height(value: number) {
            this._height = value;
            this.Refresh();
        }

        private _isAnchorTop: boolean = false;
        public get IsAnchorTop(): boolean {
            return this._isAnchorTop;
        }
        public set IsAnchorTop(value: boolean) {
            this._isAnchorTop = value;
            this.Refresh();
        }

        private _isAnchorLeft: boolean = false;
        public get IsAnchorLeft(): boolean {
            return this._isAnchorLeft;
        }
        public set IsAnchorLeft(value: boolean) {
            this._isAnchorLeft = value;
            this.Refresh();
        }

        private _isAnchorRight: boolean = false;
        public get IsAnchorRight(): boolean {
            return this._isAnchorRight;
        }
        public set IsAnchorRight(value: boolean) {
            this._isAnchorRight = value;
            this.Refresh();
        }

        private _isAnchorBottom: boolean = false;
        public get IsAnchorBottom(): boolean {
            return this._isAnchorBottom;
        }
        public set IsAnchorBottom(value: boolean) {
            this._isAnchorBottom = value;
            this.Refresh();
        }

        private _anchorMarginTop: number = 0;
        public get AnchorMarginTop(): number {
            return this._anchorMarginTop;
        }
        public set AnchorMarginTop(value: number) {
            this._anchorMarginTop = value;
            this.Refresh();
        }

        private _anchorMarginLeft: number = 0;
        public get AnchorMarginLeft(): number {
            return this._anchorMarginLeft;
        }
        public set AnchorMarginLeft(value: number) {
            this._anchorMarginLeft = value;
            this.Refresh();
        }

        private _anchorMarginRight: number = 0;
        public get AnchorMarginRight(): number {
            return this._anchorMarginRight;
        }
        public set AnchorMarginRight(value: number) {
            this._anchorMarginRight = value;
            this.Refresh();
        }

        private _anchorMarginBottom: number = 0;
        public get AnchorMarginBottom(): number {
            return this._anchorMarginBottom;
        }
        public set AnchorMarginBottom(value: number) {
            this._anchorMarginBottom = value;
            this.Refresh();
        }


        private _color: string;
        public get Color(): string {
            return this._color;
        }
        public set Color(value: string) {
            this._color = value;
            this.Refresh();
        }

        private _backgroundColor: string;
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
        }

        protected Init(): void {
            this._width = this.Elem.width();
            this._height = this.Elem.height();
            this._x = 0;
            this._y = 0;
            this._color = '000000';

            this.Elem.addClass('IView');

            this.IsVisible()
                ? this.Dom.dispatchEvent(this.EventShown)
                : this.Dom.dispatchEvent(this.EventHidden);
        }

        public SetDisplayParams(
            x: number,
            y: number,
            width?: number,
            height?: number,
            color?: string
        ): void {
            if (x != undefined && x != null)
                this._x = x;
            if (y != undefined && y != null)
                this._y = y;
            if (width != undefined && width != null)
                this._width = width;
            if (height != undefined && height != null)
                this._height = height;
            if (color != undefined && color != null)
                this._color = color;

            this.Refresh();
        }

        public SetAnchor(
            top: number,
            left: number,
            right: number,
            bottom: number
        ): void {

            if (_.isNumber(top)) {
                this._isAnchorTop = true;
                this._anchorMarginTop = top;
            } else {
                this._isAnchorTop = false;
            }

            if (_.isNumber(left)) {
                this._isAnchorLeft = true;
                this._anchorMarginLeft = left;
            } else {
                this._isAnchorLeft = false;
            }

            if (_.isNumber(right)) {
                this._isAnchorRight = true;
                this._anchorMarginRight = right;
            } else {
                this._isAnchorRight = false;
            }

            if (_.isNumber(bottom)) {
                this._isAnchorBottom = true;
                this._anchorMarginBottom     = bottom;
            } else {
                this._isAnchorBottom = false;
            }

            this.Refresh();
        }

        public Add(view: IView): void {
            if (this.Children.indexOf(view) == -1) {
                this.Children.push(view);
                this.Elem.append(view.Elem);
                view.Refresh();
            }
        }

        public Remove(view: IView): void {
            const index = this.Children.indexOf(view);
            if (index != -1) {
                this.Children.splice(index, 1);
                view.Elem.detach();
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
                this.Dom.dispatchEvent(this.EventShown);
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
                this.Dom.dispatchEvent(this.EventHidden);
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
            }

            this._lastRefreshTimer = setTimeout(() => {
                this.InnerRefresh();
            }, 10);
        }

        protected InnerRefresh(): void {
            const parent = $(this.Elem.parent());

            if (!parent)
                return;

            const parentWidth = parent.width();
            const parentHeight = parent.height();
            const centerLeft = (parentWidth / 2);
            const centerTop = (parentHeight / 2);

            if (this.IsAnchorLeft && this.IsAnchorRight) {
                this._width = parentWidth - this.AnchorMarginLeft - this.AnchorMarginRight;
                this._x = this.AnchorMarginLeft - centerLeft + (this._width / 2);
            } else {
                this._width = _.isNumber(this._width)
                    ? this._width
                    : 30;

                if (this.IsAnchorLeft) {
                    this._x = this.AnchorMarginLeft - centerLeft + (this._width / 2);
                } else if (this.IsAnchorRight) {
                    let left = parentWidth - this.AnchorMarginRight - this._width;
                    this._x = left - centerLeft + (this._width / 2);
                }
            }

            if (this.IsAnchorTop && this._isAnchorBottom) {
                this._height = parentHeight - this.AnchorMarginTop - this.AnchorMarginBottom;
                this._y = this.AnchorMarginTop - centerTop + (this._height / 2);
            } else {
                this._height = _.isNumber(this._height)
                    ? this._height
                    : 30;

                if (this.IsAnchorTop) {
                    this._y = this.AnchorMarginTop - centerTop + (this._height / 2);
                } else if (this.IsAnchorBottom) {
                    let top = parentHeight - this.AnchorMarginBottom - this._height;
                    this._y = top - centerTop + (this._height / 2);
                }
            }

            const elemLeft = centerLeft + this._x - (this.Width / 2);
            const elemTop = centerTop + this._y - (this.Height / 2);

            this.Dom.style.left = `${elemLeft}px`;
            this.Dom.style.top = `${elemTop}px`;
            this.Dom.style.width = `${this._width}px`;
            this.Dom.style.height = `${this._height}px`;
            this.Dom.style.color = `#${this._color}`;
            this.Dom.style.backgroundColor = `#${this._backgroundColor}`;
        }

        public AddEventListener(name: string, listener: EventListenerOrEventListenerObject): void {
            this.Dom.addEventListener(name, listener, false);
        }

        public Dispose(): void {
            _.each(this.Children, (view) => {
                view.Dispose();
            });
            this.Children = null;

            this.Elem.remove();
            this.Elem = null;

            this.EventShown = null;
            this.EventHidden = null;
        }
    }
}