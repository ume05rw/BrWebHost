﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="./PanelView.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ControlEvents;
    import Dump = Fw.Util.Dump;

    export enum Direction {
        Horizontal,
        Vertical
    }

    export class SlidablePanelView extends PanelView {

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

        private _innerPanel: PanelView;
        private _isDragging: boolean = false;
        private _dragStartMousePosition: Position;
        private _dragStartPanelPosition: Position;

        constructor(direction: Direction) {
            super();

            this.ClassName = 'SlidablePanelView';

            // nullやundefinedを入れさせない。
            this.Direction = (direction === Direction.Horizontal)
                ? Direction.Horizontal
                : Direction.Vertical;
        }

        protected Init(): void {
            super.Init();

            this._dragStartMousePosition = new Position();
            this._dragStartPanelPosition = new Position();

            this.HasBorder = false;
            this.BorderRadius = 0;
            this.Elem.addClass('SlidablePanelView');

            this._innerPanel = new PanelView();
            this.Add(this._innerPanel);

            this.AddEventListener(Events.Initialized, () => {
                this.InitView();
            });

            this._innerPanel.Elem.addClass('SlidablePanelInnerView');

            this._innerPanel.Elem.on('touchstart mousedown', (e) => {
                this._isDragging = true;
                this._dragStartMousePosition.X = e.clientX;
                this._dragStartMousePosition.Y = e.clientY;
                this._dragStartPanelPosition.X = this._innerPanel.Position.X;
                this._dragStartPanelPosition.Y = this._innerPanel.Position.Y;
            });
            this._innerPanel.Elem.on('touchmove mousemove', (e) => {
                if (!this._isDragging)
                    return;

                if (e.eventPhase !== 2)
                    return;

                const addX = e.clientX - this._dragStartMousePosition.X;
                const addY = e.clientY - this._dragStartMousePosition.Y;

                if (this.Direction === Direction.Horizontal) {
                    // 横方向
                    this._innerPanel.Position.X = this._dragStartPanelPosition.X + addX;
                } else {
                    // 縦方向
                    this._innerPanel.Position.Y = this._dragStartPanelPosition.Y + addY;
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
                }, 300);
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
            console.log('left: ' + this._innerPanel.Position.Left);

            this._innerPanel.SetPositionByLeftTop(10, null);

            //const unitWidth = this.Size.Width / 2;
            //const unitHeight = this.Size.Height / 2;
            //const currentLeft = this._innerPanel.Position.Left;
            //const currentTop = this._innerPanel.Position.Top;

            //const remainderLeft = Math.abs(currentLeft % unitWidth);
            //const remainderTop = Math.abs(currentTop % unitHeight);
            //let widthUnitCount = Math.abs(Math.floor(currentLeft / unitWidth));
            //let heightUnitCount = Math.abs(Math.floor(currentTop / unitHeight));

            //if (remainderLeft > (unitWidth / 2))
            //    widthUnitCount++;
            //if (remainderTop > (unitHeight / 2))
            //    heightUnitCount++;

            //const toLeft = widthUnitCount * (-unitWidth);
            //const toTop = heightUnitCount * (-unitHeight);

            //if (this.Direction === Direction.Horizontal) {
            //    console.log('toLeft: ' + toLeft);
            //    this._innerPanel.SetPositionByLeftTop(toLeft, null);
            //} else {
            //    console.log('toTop: ' + toTop);
            //    this._innerPanel.SetPositionByLeftTop(null, toTop);
            //}
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
    }
}