/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="PanelControlView.ts" />
/// <reference path="Property/Size.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ControlViewEvents;

    export enum Direction {
        Horizontal,
        Vertical
    }

    export class SlidablePanelControlView extends PanelControlView {

        public readonly Direction: Direction;

        private _innerBackgroundColor: string = '#F5F5F5';
        public get InnerBackgroundColor(): string {
            return this._innerBackgroundColor;
        }
        public set InnerBackgroundColor(value: string) {
            this._innerBackgroundColor = value;
            this.Refresh();
        }

        private _innerPanelCount: number = 2;
        public get InnerPanelCount(): number {
            return this._innerPanelCount;
        }
        public set InnerPanelCount(value: number) {
            this._innerPanelCount = value;
            this.Refresh();
        }

        private _innerPanel: PanelControlView;
        private _isDragging: boolean = false;
        private _mouseMoveSuppressor = false;
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

            this._innerPanel = new PanelControlView();
            this.Add(this._innerPanel);

            this.AddEventListener(Events.Initialized, () => {
                this.InitView();
            });

            this._innerPanel.Elem.addClass('SlidablePanelInnerView');

            this._innerPanel.Elem.on('touchstart mousedown', (e) => {
                this._isDragging = true;
                this._dragStartMousePosition.X = e.clientX;
                this._dragStartMousePosition.Y = e.clientY;
                this._dragStartViewPosition.X = this._innerPanel.Position.X;
                this._dragStartViewPosition.Y = this._innerPanel.Position.Y;
            });
            this._innerPanel.Elem.on('touchmove mousemove', (e) => {
                if (!this._isDragging && !this._mouseMoveSuppressor)
                    return;

                if (e.eventPhase !== 2)
                    return;

                const addX = e.clientX - this._dragStartMousePosition.X;
                const addY = e.clientY - this._dragStartMousePosition.Y;

                if (this.Direction === Direction.Horizontal) {
                    // 横方向
                    this._innerPanel.Position.X = this._dragStartViewPosition.X + addX;
                } else {
                    // 縦方向
                    this._innerPanel.Position.Y = this._dragStartViewPosition.Y + addY;
                }
                this.Refresh();

                // マウスボタン押下中のクリックイベント発火を抑止する。
                if (!this.IsSuppressedEvent(Events.LongClick))
                    this.SuppressEvent(Events.LongClick);
                if (!this.IsSuppressedEvent(Events.SingleClick))
                    this.SuppressEvent(Events.SingleClick);
                this.DelayedResumeMouseEvents();
            });
            this._innerPanel.Elem.on('touchend mouseup mouseout', () => {
                this._isDragging = false;
                _.delay(() => {
                    this.AdjustSlidePosition();
                }, 200);
            });
        }

        private _delayedResumeMouseEventsTimer: number = null;
        private DelayedResumeMouseEvents(): void {
            if (this._delayedResumeMouseEventsTimer !== null) {
                clearTimeout(this._delayedResumeMouseEventsTimer);
                this._delayedResumeMouseEventsTimer = null;
            }

            this._delayedResumeMouseEventsTimer = setTimeout(() => {
                //Dump.Log('ResumeMouseEvents');
                if (this.IsSuppressedEvent(Events.LongClick))
                    this.ResumeEvent(Events.LongClick);
                if (this.IsSuppressedEvent(Events.SingleClick))
                    this.ResumeEvent(Events.SingleClick);
            }, 100);
        }

        private InitView(): void {
            if (this.Direction === Direction.Horizontal) {
                // 横方向
                this.Dom.style.overflowX = 'scroll';
                this.Dom.style.overflowY = 'hidden';
                this._innerPanel.Size.Width = this.Size.Width * this.InnerPanelCount;
                this._innerPanel.Size.Height = this.Size.Height;
                this._innerPanel.Position.X = (this._innerPanel.Size.Width - this.Size.Width) / 2;
                this._innerPanel.Position.Y = 0;
            } else {
                // 縦方向
                this.Dom.style.overflowY = 'scroll';
                this.Dom.style.overflowX = 'hidden';
                this._innerPanel.Size.Height = this.Size.Height * this.InnerPanelCount;
                this._innerPanel.Size.Width = this.Size.Width;
                this._innerPanel.Position.Y = (this._innerPanel.Size.Height - this.Size.Height) / 2;
                this._innerPanel.Position.X = 0;
            }
        }

        private AdjustSlidePosition() {
            const unitWidth = this.Size.Width / 2;
            const unitHeight = this.Size.Height / 2;
            const maxLeft = 0;
            const maxTop = 0;
            const minLeft = this.Size.Width - this._innerPanel.Size.Width;
            const minTop = this.Size.Height - this._innerPanel.Size.Height;
            const left = this._innerPanel.Position.Left;
            const top = this._innerPanel.Position.Top;

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

            const animator = new Anim.Animator(this._innerPanel);
            if (this.Direction === Direction.Horizontal) {
                animator.ToParams.X = (toLeft - left);
            } else {
                animator.ToParams.Y = (toTop - top);
            }
            animator.OnComplete = () => {
                if (this.Direction === Direction.Horizontal) {
                    this._innerPanel.SetPositionByLeftTop(toLeft, null);
                } else {
                    this._innerPanel.SetPositionByLeftTop(null, toTop);
                }
                this._mouseMoveSuppressor = false;
            }

            this._mouseMoveSuppressor = true;
            animator.Invoke(500);
        }

        protected InnerRefresh(): void {
            try {
                if (this.Direction === Direction.Horizontal) {
                    // 横方向
                    this.Dom.style.overflowX = 'scroll';
                    this.Dom.style.overflowY = 'hidden';
                    this._innerPanel.Size.Width = this.Size.Width * this.InnerPanelCount;
                    this._innerPanel.Size.Height = this.Size.Height;
                } else {
                    // 縦方向
                    this.Dom.style.overflowY = 'scroll';
                    this.Dom.style.overflowX = 'hidden';
                    this._innerPanel.Size.Height = this.Size.Height * this.InnerPanelCount;
                    this._innerPanel.Size.Width = this.Size.Width;
                }
                this._innerPanel.BackgroundColor = this._innerBackgroundColor;
                
                super.InnerRefresh();
            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._innerBackgroundColor = null;
            this._innerPanelCount = null;
            this._innerPanel.Dispose();
            this._innerPanel = null;
            this._isDragging = null;
            this._mouseMoveSuppressor = null;
            this._dragStartMousePosition.Dispose();
            this._dragStartMousePosition = null;
            this._dragStartViewPosition.Dispose();
            this._dragStartViewPosition = null;
        }
    }
}