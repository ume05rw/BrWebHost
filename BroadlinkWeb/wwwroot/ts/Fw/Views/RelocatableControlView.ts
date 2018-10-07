/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ControlView.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ControlEvents;
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

            this.Elem.bind('touchstart mousedown', (e) => {
                if (!this._isRelocatable) {
                    this._isDragging = false;
                } else {
                    this._isDragging = true;
                    this.Refresh();
                }
            });
            this.Elem.bind('touchend mouseup', (e) => {
                if (!this._isRelocatable) {
                    this._isDragging = false;
                } else {
                    this._isDragging = false;
                    this.X = Math.round(this.X / this.GridSize) * this.GridSize;
                    this.Y = Math.round(this.Y / this.GridSize) * this.GridSize;
                    this.Refresh();
                }
            });

            this.AddEventListener(Events.Attached, () => {
                const parent = $(this.Elem.parent());
                if (parent.length <= 0 || this._isMouseMoveEventListened)
                    return;

                this._isMouseMoveEventListened = true;
                parent.bind('touchmove mousemove', (e) => {
                    if (this._isRelocatable && this._isDragging) {
                        const parentWidth = parent.width();
                        const parentHeight = parent.height();
                        const centerLeft = (parentWidth / 2);
                        const centerTop = (parentHeight / 2);
                        const left = e.clientX;
                        const top = e.clientY;

                        this.X = left - centerLeft;
                        this.Y = top - centerTop;
                        this.Refresh();
                    }
                });
            });
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
                this._beforeX = this.X;
                this._beforeY = this.Y;
                this.Elem.parent().append(this._shadow);
            }

            this.Refresh();
        }

        protected InnerRefresh(): void {
            const parent = $(this.Elem.parent());
            if (!parent)
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
                const sX = Math.round(this.X / this.GridSize) * this.GridSize;
                const sY = Math.round(this.Y / this.GridSize) * this.GridSize;
                const sLeft = centerLeft + sX - (this.Width / 2);
                const sTop = centerTop + sY - (this.Height / 2);

                shadowDom.style.display = 'block';
                shadowDom.style.left = `${sLeft}px`;
                shadowDom.style.top = `${sTop}px`;
                shadowDom.style.width = `${this.Width}px`;
                shadowDom.style.height = `${this.Height}px`;
                shadowDom.style.opacity = '0.4';
                shadowDom.style.color = `#${this.Color}`;
                shadowDom.style.borderColor = `#${this.Color}`;
                shadowDom.style.borderStyle = 'dashed';
                shadowDom.style.borderWidth = '2px';
                shadowDom.style.backgroundColor = `#${this.BackgroundColor}`;
            } else {
                shadowDom.style.display = 'none';
            }
        }
    }
}