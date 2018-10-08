/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ControlView.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ControlEvents;
    import Dump = Fw.Util.Dump;

    export class RelocatableControlView extends ControlView {

        private _isRelocatable: boolean = false;
        public get IsRelocatable(): boolean {
            return this._isRelocatable;
        }

        private _shadow: JQuery;
        private _beforeX: number = 0;
        private _beforeY: number = 0;
        private _isMouseMoveEventListened: boolean = false;
        private _isDragging: boolean = false;

        public GridSize: number = 60;

        protected Init(): void {
            super.Init();

            this._shadow = $('<div class="IView ControlView Shadow"></div>');

            this.AddEventListener(Events.LongClick, () => {
                if (!this._isRelocatable)
                    this.SetRelocatable(true);
            });

            this.Elem.on('touchstart mousedown', (e) => {
                if (!this._isRelocatable) {
                    this._isDragging = false;
                } else {
                    this._isDragging = true;
                    this.Refresh();
                }
            });
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
                const parent = $(this.Elem.parent());
                const parentWidth = parent.width();
                const parentHeight = parent.height();
                const centerLeft = (parentWidth / 2);
                const centerTop = (parentHeight / 2);
                const left = e.clientX;
                const top = e.clientY;

                // マウスボタン押下中のクリックイベント発火を抑止する。
                if (!this.IsSuppressedEvent(Events.LongClick))
                    this.SuppressEvent(Events.LongClick);
                if (!this.IsSuppressedEvent(Events.SingleClick))
                    this.SuppressEvent(Events.SingleClick);

                this.Position.X = left - centerLeft;
                this.Position.Y = top - centerTop;
                this.Refresh();
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
            console.log('SetRelocatable');

            if (this._isRelocatable) {
                // 固定する。
                this._isRelocatable = false;
                this._shadow.detach();

            } else {
                // 移動可能にする。
                this._isRelocatable = true;
                this._beforeX = this.Position.X;
                this._beforeY = this.Position.Y;
                this.Elem.parent().append(this._shadow);
            }

            this.Refresh();
        }

        protected InnerRefresh(): void {
            const parent = $(this.Elem.parent());
            if (parent.length <= 0)
                return;

            super.InnerRefresh();

            const shadowDom = this._shadow.get(0);

            if (!this._isRelocatable) {
                shadowDom.style.display = 'none';
                this.Dom.style.opacity = '1.0';
                return;
            }

            this.Dom.style.opacity = '0.7';

            if (this._isDragging) {
                const parentWidth = parent.width();
                const parentHeight = parent.height();
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
    }
}