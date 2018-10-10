/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="ControlView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class RelocatableControlView extends ControlView {

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


        protected Init(): void {
            super.Init();

            this.SetClassName('RelocatableControlView');
            this.Elem.addClass(this.ClassName);

            this._shadow = $('<div class="IView ControlView Shadow"></div>');
            this._dragStartMousePosition = new Property.Position();
            this._dragStartViewPosition = new Property.Position();

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
                    this._dragStartViewPosition.X = this.Position.X;
                    this._dragStartViewPosition.Y = this.Position.Y;
                    this.Refresh();
                }
            });

            // ↓mouseoutイベントは捕捉しない。途切れまくるので。
            this.Elem.on('touchend mouseup', (e) => {
                if (!this._isRelocatable) {
                    this._isDragging = false;
                } else {
                    this._isDragging = false;
                    this.Position.X = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                    this.Position.Y = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
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
                this.Position.X = this._dragStartViewPosition.X + addX;
                this.Position.Y = this._dragStartViewPosition.Y + addY;

                // マウスボタン押下中のクリックイベント発火を抑止する。
                if (!this.IsSuppressedEvent(Events.LongClick))
                    this.SuppressEvent(Events.LongClick);
                if (!this.IsSuppressedEvent(Events.SingleClick))
                    this.SuppressEvent(Events.SingleClick);
                this.DelayedResumeMouseEvents();
            }
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

        public SetRelocatable(relocatable: boolean): void {
            if (this._isRelocatable) {
                // 固定する。
                this._isRelocatable = false;
                this._shadow.detach();

            } else {
                // 移動可能にする。
                //this._beforeX = this.Position.X;
                //this._beforeY = this.Position.Y;
                this._isRelocatable = true;
                this.Elem.parent().append(this._shadow);
            }

            this.Refresh();
        }

        protected InnerRefresh(): void {
            const parent = $(this.Elem.parent());
            if (parent.length <= 0)
                return;

            if (!this._isRelocatable) {
                Dump.Log('before');
                Dump.Log(this.Position);
                Dump.Log('parent');
                Dump.Log(this.Parent.Size);
                this.Position.X = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                this.Position.Y = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
                Dump.Log('after');
                Dump.Log(this.Position);
            }

            super.InnerRefresh();

            const shadowDom = this._shadow.get(0);

            if (!this._isRelocatable) {
                shadowDom.style.display = 'none';
                this.Dom.style.opacity = '1.0';
                return;
            }

            this.Dom.style.opacity = '0.7';

            if (this._isDragging) {
                const parentWidth = (this.Parent)
                    ? this.Parent.Size.Width
                    : parent.width();
                const parentHeight = (this.Parent)
                    ? this.Parent.Size.Height
                    : parent.height();

                const centerLeft = (parentWidth / 2);
                const centerTop = (parentHeight / 2);
                const sX = Math.round(this.Position.X / this.GridSize) * this.GridSize;
                const sY = Math.round(this.Position.Y / this.GridSize) * this.GridSize;
                const sLeft = centerLeft + sX - (this.Size.Width / 2);
                const sTop = centerTop + sY - (this.Size.Height / 2);

                shadowDom.style.display = 'block';
                shadowDom.style.left = `${sLeft}px`;
                shadowDom.style.top = `${sTop}px`;
                shadowDom.style.width = `${this.Size.Width}px`;
                shadowDom.style.height = `${this.Size.Height}px`;
                shadowDom.style.opacity = '0.4';
                shadowDom.style.color = `${this.Color}`;
                shadowDom.style.borderColor = `${this.Color}`;
                shadowDom.style.borderStyle = 'dashed';
                shadowDom.style.borderWidth = '2px';
                shadowDom.style.backgroundColor = `${this.BackgroundColor}`;
            } else {
                shadowDom.style.display = 'none';
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