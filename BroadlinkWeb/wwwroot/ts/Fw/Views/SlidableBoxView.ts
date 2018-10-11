/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/SlidableBoxViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="BoxView.ts" />
/// <reference path="Property/Size.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.SlidableBoxViewEvents;

    export enum Direction {
        Horizontal,
        Vertical
    }

    export class SlidableBoxView extends BoxView {

        public readonly Direction: Direction;

        private _innerBackgroundColor: string = '#F5F5F5';
        public get InnerBackgroundColor(): string {
            return this._innerBackgroundColor;
        }
        public set InnerBackgroundColor(value: string) {
            this._innerBackgroundColor = value;
            this.Refresh();
        }

        private _innerBoxCount: number = 2;
        public get InnerPanelCount(): number {
            return this._innerBoxCount;
        }
        public set InnerPanelCount(value: number) {
            this._innerBoxCount = value;
            this.Refresh();
        }

        private _innerBox: BoxView;
        private _isDragging: boolean = false;
        private _spcvMouseSuppressor = false;
        private _spcvDelayedResumeEventsTimer: number = null;
        private _dragStartMousePosition: Property.Position;
        private _dragStartViewPosition: Property.Position;

        constructor(direction: Direction) {
            super();

            // nullやundefinedを入れさせない。
            this.Direction = (direction === Direction.Horizontal)
                ? Direction.Horizontal
                : Direction.Vertical;
        }

        protected Init(): void {
            super.Init();

            this.SetClassName('SlidablePanelView');
            this.Elem.addClass(this.ClassName);

            this._dragStartMousePosition = new Property.Position();
            this._dragStartViewPosition = new Property.Position();

            this.HasBorder = false;
            this.BorderRadius = 0;

            this._innerBox = new BoxView();
            this.Add(this._innerBox);

            this.AddEventListener(Events.Initialized, () => {
                this.InitView();
            });

            this._innerBox.Elem.addClass('SlidablePanelInnerView');

            this._innerBox.Elem.on('touchstart mousedown', (e) => {
                this._isDragging = true;
                this._dragStartMousePosition.X = e.clientX;
                this._dragStartMousePosition.Y = e.clientY;
                this._dragStartViewPosition.X = this._innerBox.Position.X;
                this._dragStartViewPosition.Y = this._innerBox.Position.Y;
            });
            this._innerBox.Elem.on('touchmove mousemove', (e) => {
                if (!this._isDragging && !this._spcvMouseSuppressor)
                    return;

                if (e.eventPhase !== 2)
                    return;

                const addX = e.clientX - this._dragStartMousePosition.X;
                const addY = e.clientY - this._dragStartMousePosition.Y;

                if (this.Direction === Direction.Horizontal) {
                    // 横方向
                    this._innerBox.Position.X = this._dragStartViewPosition.X + addX;
                } else {
                    // 縦方向
                    this._innerBox.Position.Y = this._dragStartViewPosition.Y + addY;
                }
                this.Refresh();
            });
            this._innerBox.Elem.on('touchend mouseup mouseout', () => {
                this._isDragging = false;
                _.delay(() => {
                    this.AdjustSlidePosition();
                }, 200);
            });
        }

        private InitView(): void {
            if (this.Direction === Direction.Horizontal) {
                // 横方向
                this.Dom.style.overflowX = 'scroll';
                this.Dom.style.overflowY = 'hidden';
                this._innerBox.Size.Width = this.Size.Width * this.InnerPanelCount;
                this._innerBox.Size.Height = this.Size.Height;
                this._innerBox.Position.X = (this._innerBox.Size.Width - this.Size.Width) / 2;
                this._innerBox.Position.Y = 0;
            } else {
                // 縦方向
                this.Dom.style.overflowY = 'scroll';
                this.Dom.style.overflowX = 'hidden';
                this._innerBox.Size.Height = this.Size.Height * this.InnerPanelCount;
                this._innerBox.Size.Width = this.Size.Width;
                this._innerBox.Position.Y = (this._innerBox.Size.Height - this.Size.Height) / 2;
                this._innerBox.Position.X = 0;
            }
        }

        private AdjustSlidePosition() {
            const unitWidth = this.Size.Width / 2;
            const unitHeight = this.Size.Height / 2;
            const maxLeft = 0;
            const maxTop = 0;
            const minLeft = this.Size.Width - this._innerBox.Size.Width;
            const minTop = this.Size.Height - this._innerBox.Size.Height;
            const left = this._innerBox.Position.Left;
            const top = this._innerBox.Position.Top;

            // 座標値がマイナスのため、floorでなくceilで切り捨てる。
            let toLeft = Math.ceil(left / unitWidth) * unitWidth;
            let toTop = Math.ceil(top / unitHeight) * unitHeight;

            if (toLeft < minLeft) {
                toLeft = minLeft;
            } else if (maxLeft < toLeft) {
                toLeft = maxLeft;
            } else {
                const remainderLeft = Math.abs(left % unitWidth);
                if (remainderLeft > (unitWidth / 2))
                    toLeft -= unitWidth;
            }

            if (toTop < minTop) {
                toTop = minTop;
            } else if (maxTop < toTop) {
                toTop = maxTop;
            } else {
                const remainderTop = Math.abs(top % unitHeight);
                if (remainderTop > (unitHeight / 2))
                    toTop -= unitHeight;
            }

            const animator = new Anim.Animator(this._innerBox);
            if (this.Direction === Direction.Horizontal) {
                animator.ToParams.X = (toLeft - left);
            } else {
                animator.ToParams.Y = (toTop - top);
            }
            animator.OnComplete = () => {
                if (this.Direction === Direction.Horizontal) {
                    this._innerBox.SetLeftTop(toLeft, null, false);
                } else {
                    this._innerBox.SetLeftTop(null, toTop, false);
                }
                this._spcvMouseSuppressor = false;
            }

            this._spcvMouseSuppressor = true;
            animator.Invoke(500);
        }

        protected InnerRefresh(): void {
            try {
                if (this.Direction === Direction.Horizontal) {
                    // 横方向
                    this.Dom.style.overflowX = 'scroll';
                    this.Dom.style.overflowY = 'hidden';
                    this._innerBox.Size.Width = this.Size.Width * this.InnerPanelCount;
                    this._innerBox.Size.Height = this.Size.Height;
                } else {
                    // 縦方向
                    this.Dom.style.overflowY = 'scroll';
                    this.Dom.style.overflowX = 'hidden';
                    this._innerBox.Size.Height = this.Size.Height * this.InnerPanelCount;
                    this._innerBox.Size.Width = this.Size.Width;
                }
                this._innerBox.BackgroundColor = this._innerBackgroundColor;
                
                super.InnerRefresh();
            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._innerBackgroundColor = null;
            this._innerBoxCount = null;
            this._innerBox.Dispose();
            this._innerBox = null;
            this._isDragging = null;
            this._spcvMouseSuppressor = null;
            this._spcvDelayedResumeEventsTimer = null;
            this._dragStartMousePosition.Dispose();
            this._dragStartMousePosition = null;
            this._dragStartViewPosition.Dispose();
            this._dragStartViewPosition = null;
        }
    }
}