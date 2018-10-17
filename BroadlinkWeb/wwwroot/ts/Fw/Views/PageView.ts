﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/App.ts" />
/// <reference path="../Events/PageViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />


namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.PageViewEvents;
    import App = Fw.Util.App;
    import Config = Fw.Config;

    export class PageView extends ViewBase {
        private _isNeedDragX: boolean = false;
        private _isNeedDragY: boolean = false;
        private _isDragging: boolean = false;
        private _isSuppressDrag: boolean = false;

        private _minDragPosition: Property.Position;
        private _maxDragPosition: Property.Position;

        private _dragStartMousePosition: Property.Position;
        private _dragStartViewPosition: Property.Position;

        private _draggedPosition: Property.Position;
        public get DraggedPosition(): Property.Position {
            return this._draggedPosition;
        }

        private _isMasked: boolean = false;
        public get IsMasked(): boolean {
            return this._isMasked;
        }

        private _isModal: boolean = false;
        public get IsModal(): boolean {
            return this._isModal;
        }

        constructor(jqueryElem?: JQuery) {
            super(jqueryElem);

            Fw.Root.Instance.StartPageInitialize();

            if (!this.Dom) {
                const elem = $(`<div class="IController IView TransAnimation"></div>`);
                Fw.Root.Instance.Elem.append(elem);
                this.SetElem(elem);
            }

            this._minDragPosition = new Property.Position();
            this._maxDragPosition = new Property.Position();
            this._dragStartMousePosition = new Property.Position();
            this._dragStartViewPosition = new Property.Position();
            this._draggedPosition = new Property.Position();

            this._isMasked = false;
            this._isNeedDragX = false;
            this._isNeedDragY = false;
            this._isDragging = false;
            this._isSuppressDrag = false;

            this.SetClassName('PageView');
            this.Elem.addClass(this.ClassName);

            this.Size.Width = Fw.Root.Instance.Size.Width;
            this.Size.Height = Fw.Root.Instance.Size.Height;
            this.IsVisible = false;

            //this.Elem.on('touchstart mousedown', (e) => {
            //    //Dump.Log(`${this.ClassName}.MouseDown`);
            //    this._isDragging = true;
            //    this._dragStartMousePosition.X = e.pageX;
            //    this._dragStartMousePosition.Y = e.pageY;
            //    this._dragStartViewPosition.X = this._draggedPosition.X;
            //    this._dragStartViewPosition.Y = this._draggedPosition.Y;
            //    this.DetectToNeedDrags();
            //});

            //this.Elem.on('touchmove mousemove', (e) => {
            //    //Dump.Log(`${this.ClassName}.MouseMove`);
            //    if (!this._isDragging || this._isSuppressDrag)
            //        return;

            //    if (!this._isNeedDragX && !this._isNeedDragY)
            //        return;

            //    //Dump.Log({
            //    //    pageX: e.pageX,
            //    //    pageY: e.pageY,
            //    //    screenX: e.screenX,
            //    //    screenY: e.screenY,
            //    //    clientX: e.clientX,
            //    //    clientY: e.clientY,
            //    //    offsetX: e.offsetX,
            //    //    offsetY: e.offsetY
            //    //});

            //    const addX = e.pageX - this._dragStartMousePosition.X;
            //    const addY = e.pageY - this._dragStartMousePosition.Y;

            //    if (this._isNeedDragX) {
            //        this._draggedPosition.X = this._dragStartViewPosition.X + addX;

            //        if (this._draggedPosition.X < this._minDragPosition.X)
            //            this._draggedPosition.X = this._minDragPosition.X;
            //        if (this._maxDragPosition.X < this._draggedPosition.X)
            //            this._draggedPosition.X = this._maxDragPosition.X;
            //    }

            //    if (this._isNeedDragY) {
            //        this._draggedPosition.Y = this._dragStartViewPosition.Y + addY;

            //        if (this._draggedPosition.Y < this._minDragPosition.Y)
            //            this._draggedPosition.Y = this._minDragPosition.Y;
            //        if (this._maxDragPosition.Y < this._draggedPosition.Y)
            //            this._draggedPosition.Y = this._maxDragPosition.Y;
            //    }

            //    const dragEventMargin = 10;
            //    if (
            //        Math.abs(this._dragStartMousePosition.X - this._draggedPosition.X) > dragEventMargin
            //        || Math.abs(this._dragStartMousePosition.Y - this._draggedPosition.Y) > dragEventMargin
            //    ) {
            //        this.DispatchEvent(Events.Dragging);
            //    }

            //    this.Refresh();
            //});

            //this.Elem.on('touchend mouseup mouseout', (e) => {
            //    //Dump.Log(`${this.ClassName}.MouseUp`);
            //    this._isDragging = false;
            //});

            // ブラウザのリサイズ時、ページ全体を再描画
            Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, () => {
                //Dump.Log(`${this.ClassName}.Resized`);
                this.Size.Width = Fw.Root.Instance.Size.Width;
                this.Size.Height = Fw.Root.Instance.Size.Height;
                this.Refresh();
            });

            // マスクをクリックしたとき、戻る。
            Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.MaskClicked, () => {

                //TODO: 自分がモーダル表示されているとき、引っ込む。
                if (this.IsVisible && this._isModal)
                    this.HideModal();

                if (this._isMasked)
                    this.UnMask();
            });
        }

        public SuppressDragging(): void {
            this._isSuppressDrag = true;
        }

        public IsSuppressDragging(): boolean {
            return this._isSuppressDrag;
        }

        public ResumeDragging(): void {
            this._isSuppressDrag = false;
        }

        private DetectToNeedDrags(): void {
            const phWidth: number = this.Size.Width / 2;
            const phHeight: number = this.Size.Height / 2;
            let minLeft: number = 0;
            let minTop: number = 0;
            let maxRight: number = 0;
            let maxBottom: number = 0;

            _.each(this.Children, (view: IView) => {
                const left = phWidth + view.Position.X - (view.Size.Width / 2);
                const top = phHeight + view.Position.Y - (view.Size.Height / 2);
                const right = phWidth + view.Position.X + (view.Size.Width / 2);
                const bottom = phHeight + view.Position.Y + (view.Size.Height / 2);

                if (left < minLeft)
                    minLeft = left;
                if (top < minTop)
                    minTop = top;
                if (maxRight < right)
                    maxRight = right;
                if (maxBottom < bottom)
                    maxBottom = bottom;
            });

            this._isNeedDragX = (minLeft < 0 || this.Size.Width < maxRight);
            this._isNeedDragY = (minTop < 0 || this.Size.Height < maxBottom);
            const margin = 20;

            this._minDragPosition.X = (this.Size.Width < maxRight)
                ? this.Size.Width - maxRight - margin
                : 0;
            this._minDragPosition.Y = (this.Size.Height < maxBottom)
                ? this.Size.Height - maxBottom - margin
                : 0;
            this._maxDragPosition.X = (minLeft < 0)
                ? (minLeft * -1) + margin
                : 0;
            this._maxDragPosition.Y = (minTop < 0)
                ? (minTop * -1) + margin
                : 0;

            //Dump.Log({
            //    minLeft: minLeft,
            //    minTop: minTop,
            //    maxRight: maxRight,
            //    maxBottom: maxBottom,
            //    _isNeedDragX: this._isNeedDragX,
            //    _isNeedDragY: this._isNeedDragY,
            //    _minDragPositionX: this._minDragPosition.X,
            //    _minDragPositionY: this._minDragPosition.Y,
            //    _maxDragPositionX: this._maxDragPosition.X,
            //    _maxDragPositionY: this._maxDragPosition.Y,
            //});
        }

        public Show(duration: number = 200): void {
            Dump.Log(`PageView.Show: ${this.ClassName}`);
            if (this.IsVisible && !this.IsModal) {
                this.Refresh();
                return;
            }

            this.SetStyle('zIndex', '0');
            this.Dom.style.zIndex = '0';

            if (duration <= 0) {
                this.IsVisible = true;
                this.DispatchEvent(Events.Shown);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
                animator.FromParams.Opacity = 0.5;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = () => {
                    this.IsVisible = true;
                    this._isModal = false;
                    _.delay(() => {
                        this.Refresh();
                    }, 50);
                    this.DispatchEvent(Events.Shown);
                };
                animator.Invoke(duration);
            }
        }

        public Hide(duration: number = 200): void {
            //Dump.Log(`PageView.Hide: ${this.Elem.data('controller')}`);
            if (!this.IsVisible && !this.IsModal) {
                this.Refresh();
                return;
            }

            this.SetStyle('zIndex', '0');
            this.Dom.style.zIndex = '0';

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, -1, 0);
                animator.ToParams.Opacity = 0.5;
                animator.OnComplete = () => {
                    this.IsVisible = false;
                    this._isModal = false;
                    this.Refresh();
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

        public ShowModal(duration: number = 200, width: number = 300): void {
            Dump.Log(`PageView.ShowModal: ${this.ClassName}`);
            if (this.IsVisible && this._isModal) {
                this.Refresh();
                return;
            }

            this.SetStyle('zIndex', '1');
            this.Dom.style.zIndex = '1';

            if (duration <= 0) {
                this.IsVisible = true;
                this.DispatchEvent(Events.Shown);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetSlided(this, 1, 0);
                animator.FromParams.Opacity = 0.5;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.ToParams.X = animator.ToParams.Width - width;

                animator.OnComplete = () => {
                    this.IsVisible = true;
                    this._isModal = true;
                    this.Position.X = animator.ToParams.X;
                    _.delay(() => {
                        this.Refresh();
                    }, 50);
                    this.DispatchEvent(Events.Shown);
                };
                animator.Invoke(duration);
            }
        }

        public HideModal(duration: number = 200): void {
            //Dump.Log(`PageView.HideModal: ${this.Elem.data('controller')}`);
            if (!this.IsVisible) {
                this.Refresh();
                return;
            }

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, 1, 0);
                animator.ToParams.X = this.Size.Width - this.Position.X;
                animator.ToParams.Opacity = 0.5;
                animator.OnComplete = () => {
                    this.SetStyle('zIndex', '0');
                    this.Dom.style.zIndex = '0';

                    this.IsVisible = false;
                    this._isModal = false;
                    this.Position.X = 0;
                    this.Position.Y = 0;
                    this.Refresh();
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

        public SetUnmodal(duration: number = 200): void {
            //Dump.Log(`PageView.SetUnmodal: ${this.Elem.data('controller')}`);
            if (this.IsVisible && !this._isModal) {
                this.Refresh();
                return;
            }

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, 0, 0);
                animator.ToParams.X = - this.Position.X;
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = () => {
                    this.SetStyle('zIndex', '0');
                    this.Dom.style.zIndex = '0';

                    this.IsVisible = true;
                    this._isModal = false;
                    this.Position.X = 0;
                    this.Position.Y = 0;
                    this.Refresh();
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

        public Mask(): void {
            //Dump.Log(`${this.ClassName}.Mask`);
            this._isMasked = true;
            Fw.Root.Instance.Mask();
            //this.Dom.style.zIndex = '-1';
            this.SetStyle('zIndex', '-1');
            this.Refresh();
        }

        public UnMask(): void {
            //Dump.Log(`${this.ClassName}.UnMask`);
            this._isMasked = false;
            Fw.Root.Instance.UnMask();
            //this.Dom.style.zIndex = '0';
            this.SetStyle('zIndex', '0');
            this.Refresh();
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                //const pHalfWidth = Root.Instance.Size.Width / 2;
                //const pHalfHeight = Root.Instance.Size.Height / 2;
                //const myHalfWidth = Root.Instance.Size.Width / 2;
                //const myHalfHeight = Root.Instance.Size.Height / 2;
                //let elemLeft = pHalfWidth - myHalfWidth + this.Position.X;
                //let elemTop = pHalfHeight - myHalfHeight + this.Position.Y;

                this.SetStyles({
                    left: `${this.Position.X}px`,
                    top: `${this.Position.Y}px`,
                    width: `100%`,
                    height: `100%`,
                    zIndex: `${this.ZIndex}`,
                    color: `${this.Color}`,
                    backgroundColor: `${this.BackgroundColor}`,
                    display: (this.IsVisible) ? 'block' : 'none'
                });
                _.defer(() => {
                    this.ApplyStyles();
                });

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._isNeedDragX = null;
            this._isNeedDragY = null;
            this._isDragging = null;
            this._isSuppressDrag = null;

            this._minDragPosition.Dispose();
            this._minDragPosition = null;

            this._maxDragPosition.Dispose();
            this._maxDragPosition = null;

            this._dragStartMousePosition.Dispose();
            this._dragStartMousePosition = null;

            this._dragStartViewPosition.Dispose();
            this._dragStartViewPosition = null;

            this._draggedPosition.Dispose();
            this._draggedPosition = null;
        }
    }
}