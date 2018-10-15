﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="ButtonView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class RelocatableButtonView extends ButtonView {

        private _isRelocatable: boolean = false;
        public get IsRelocatable(): boolean {
            return this._isRelocatable;
        }

        private _shadow: JQuery;
        private _isMouseMoveEventListened: boolean = false;
        private _isDragging: boolean = false;
        private _dragStartMousePosition: Property.Position;
        private _dragStartViewPosition: Property.Position;

        private _gridSize: number = 60;
        public get GridSize(): number {
            return this._gridSize;
        }
        public set GridSize(value: number) {
            this._gridSize = value;
            this.Refresh();
        }

        private _margin: number = 0;
        public get Margin(): number {
            return this._margin;
        }
        public set Margin(value: number) {
            this._margin = value;
            this.Refresh();
        }

        constructor() {
            super()

            this._shadow = $('<div class="IView BoxView Shadow"></div>');
            this._dragStartMousePosition = new Property.Position();
            this._dragStartViewPosition = new Property.Position();

            this.SetClassName('RelocatableControlView');
            this.Elem.addClass(this.ClassName);

            this.AddEventListener(Events.LongClick, () => {
                if (!this._isRelocatable)
                    this.SetRelocatable(true);
            });

            this.Elem.on('touchstart mousedown', (e) => {
                if (!this._isRelocatable) {
                    this._isDragging = false;
                } else {
                    this._isDragging = true;
                    this._dragStartMousePosition.X = e.pageX;
                    this._dragStartMousePosition.Y = e.pageY;

                    if (this.Position.Policy === Property.PositionPolicy.Centering) {
                        this._dragStartViewPosition.X = this.Position.X;
                        this._dragStartViewPosition.Y = this.Position.Y;
                    } else {
                        this._dragStartViewPosition.X = this.Position.Left;
                        this._dragStartViewPosition.Y = this.Position.Top;
                    }

                    this.Refresh();
                }
            });

            // ↓mouseoutイベントは捕捉しない。途切れまくるので。
            this.Elem.on('touchend mouseup', (e) => {
                if (!this._isRelocatable) {
                    this._isDragging = false;
                } else {
                    this._isDragging = false;

                    if (this.Position.Policy === Property.PositionPolicy.Centering) {
                        this.Position.X = (Math.round(this.Position.X / this.GridSize) * this.GridSize) + this._margin;
                        this.Position.Y = (Math.round(this.Position.Y / this.GridSize) * this.GridSize) + this._margin;
                    } else {
                        this.Position.Left = (Math.round(this.Position.Left / this.GridSize) * this.GridSize) + this._margin;
                        this.Position.Top = (Math.round(this.Position.Top     / this.GridSize) * this.GridSize) + this._margin;
                    }

                    this.Refresh();
                }
            });

            const onMouseMove = this.OnMouseMove.bind(this);

            this.AddEventListener(Events.Attached, () => {
                const parent = $(this.Elem.parent());
                if (parent.length <= 0 || this._isMouseMoveEventListened)
                    return;

                parent.on('touchmove mousemove', onMouseMove);
                this._isMouseMoveEventListened = true;
            });

            this.AddEventListener(Events.Detached, () => {
                const parent = $(this.Elem.parent());
                if (parent.length <= 0 || !this._isMouseMoveEventListened)
                    return;
                parent.off('touchmove mousemove', onMouseMove);
                this._isMouseMoveEventListened = false;
            });
        }

        private OnMouseMove(e: JQueryEventObject): void {
            if (this._isRelocatable && this._isDragging) {

                const addX = e.pageX - this._dragStartMousePosition.X;
                const addY = e.pageY - this._dragStartMousePosition.Y;

                if (this.Position.Policy === Property.PositionPolicy.Centering) {
                    this.Position.X = this._dragStartViewPosition.X + addX;
                    this.Position.Y = this._dragStartViewPosition.Y + addY;
                } else {
                    this.Position.Left = this._dragStartViewPosition.X + addX;
                    this.Position.Top = this._dragStartViewPosition.Y + addY;
                }

                // マウスボタン押下中のクリックイベント発火を抑止する。
                if (!this.IsSuppressedEvent(Events.LongClick))
                    this.SuppressEvent(Events.LongClick);
                if (!this.IsSuppressedEvent(Events.SingleClick))
                    this.SuppressEvent(Events.SingleClick);
                Fw.Root.Instance.SetTextSelection(false);
                this.DelayedResume();
            }
        }

        private _delayedResumeTimer: number = null;
        private DelayedResume(): void {
            if (this._delayedResumeTimer !== null) {
                clearTimeout(this._delayedResumeTimer);
                this._delayedResumeTimer = null;
            }

            this._delayedResumeTimer = setTimeout(() => {
                //Dump.Log('ResumeMouseEvents');
                if (this.IsSuppressedEvent(Events.LongClick))
                    this.ResumeEvent(Events.LongClick);
                if (this.IsSuppressedEvent(Events.SingleClick))
                    this.ResumeEvent(Events.SingleClick);
                Fw.Root.Instance.SetTextSelection(true);
            }, 100);
        }

        public SetRelocatable(relocatable: boolean): void {
            if (this._isRelocatable) {
                // 固定する。
                this._isRelocatable = false;
                this._shadow.detach();

            } else {
                // 移動可能にする。
                this._isRelocatable = true;
                this.Elem.parent().append(this._shadow);
            }

            this.Refresh();
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                const parent = $(this.Elem.parent());
                if (parent.length <= 0)
                    return;

                if (!this._isRelocatable) {
                    if (this.Position.Policy === Property.PositionPolicy.Centering) {
                        this.Position.X = (Math.round(this.Position.X / this.GridSize) * this.GridSize) + this._margin;
                        this.Position.Y = (Math.round(this.Position.Y / this.GridSize) * this.GridSize) + this._margin;
                    } else {
                        this.Position.Left = (Math.round(this.Position.Left / this.GridSize) * this.GridSize) + this._margin;
                        this.Position.Top = (Math.round(this.Position.Top / this.GridSize) * this.GridSize) + this._margin;
                    }
                }

                const shadowDom = this._shadow.get(0);

                if (!this._isRelocatable) {
                    shadowDom.style.display = 'none';
                    this.Opacity = 1.0;

                    super.InnerRefresh();
                    return;
                }

                this.Opacity = 0.7;
                super.InnerRefresh();

                if (this._isDragging) {
                    const parentWidth = (this.Parent)
                        ? this.Parent.Size.Width
                        : parent.width();
                    const parentHeight = (this.Parent)
                        ? this.Parent.Size.Height
                        : parent.height();

                    const centerLeft = (parentWidth / 2);
                    const centerTop = (parentHeight / 2);

                    let sX: number, sY: number, sLeft: number, sTop: number;
                    if (this.Position.Policy === Property.PositionPolicy.Centering) {
                        sX = (Math.round(this.Position.X / this.GridSize) * this.GridSize) + this._margin;
                        sY = (Math.round(this.Position.Y / this.GridSize) * this.GridSize) + this._margin;
                        sLeft = centerLeft + sX - (this.Size.Width / 2);
                        sTop = centerTop + sY - (this.Size.Height / 2);
                    } else {
                        sX = (Math.round(this.Position.Left / this.GridSize) * this.GridSize) + this._margin;
                        sY = (Math.round(this.Position.Top / this.GridSize) * this.GridSize) + this._margin;
                        sLeft = sX;
                        sTop = sY;
                    }

                    shadowDom.style.display = 'block';
                    shadowDom.style.left = `${sLeft}px`;
                    shadowDom.style.top = `${sTop}px`;
                    shadowDom.style.width = `${this.Size.Width}px`;
                    shadowDom.style.height = `${this.Size.Height}px`;
                    shadowDom.style.color = `${this.Color}`;
                    shadowDom.style.borderColor = `${this.Color}`;
                    shadowDom.style.backgroundColor = `${this.BackgroundColor}`;
                } else {
                    shadowDom.style.display = 'none';
                }

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._isRelocatable = null;
            this._shadow.remove();
            this._shadow = null;
            this._isMouseMoveEventListened = null;
            this._isDragging = null;
            this._gridSize = null;
        }
    }
}