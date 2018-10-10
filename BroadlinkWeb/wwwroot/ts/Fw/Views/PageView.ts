/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/App.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />


namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;
    import App = Fw.Util.App;
    import Config = Fw.Config;

    export class PageView extends ViewBase {

        private _id: string;
        public get Id(): string {
            return this._id;
        }

        private _isDragging: boolean = false;
        private _dragStartMousePosition: Property.Position;
        private _dragStartViewPosition: Property.Position;
        private _isSuppressDrag: boolean = false;

        private _draggedPosition: Property.Position;
        public get DraggedPosition(): Property.Position {
            return this._draggedPosition;
        }

        constructor(jqueryElem: JQuery) {
            super(jqueryElem);
        }

        protected Init(): void {
            super.Init();

            this.SetClassName('PageView');

            if (this.Dom) {
                this._id = this.Elem.data('');
            } else {
                this._id = App.CreateId();
                const elem = $(`<div class="IController" ${Config.PageIdAttribute}="${this._id}"></div>`);
                Fw.Root.Instance.Elem.append(elem);
                this.SetElem(elem);
            }

            this.Elem.addClass(this.ClassName);

            this._dragStartMousePosition = new Property.Position();
            this._dragStartViewPosition = new Property.Position();
            this._draggedPosition = new Property.Position();

            this.Elem.on('touchstart mousedown', (e) => {
                this._isDragging = true;
                this._dragStartMousePosition.X = e.clientX;
                this._dragStartMousePosition.Y = e.clientY;
                this._dragStartViewPosition.X = this._draggedPosition.X;
                this._dragStartViewPosition.Y = this._draggedPosition.Y;
            });

            this.Elem.on('touchmove mousemove', (e) => {
                if (!this._isDragging || this._isSuppressDrag)
                    return;

                if (e.eventPhase !== 2)
                    return;

                const addX = e.clientX - this._dragStartMousePosition.X;
                const addY = e.clientY - this._dragStartMousePosition.Y;
                this._draggedPosition.X = this._dragStartViewPosition.X + addX;
                this._draggedPosition.Y = this._dragStartViewPosition.Y + addY;
                this.Refresh();
            });

            this.Elem.on('touchend mouseup mouseout', (e) => {
                this._isDragging = false;
            });

            // 画面リサイズ時に、自身のサイズを再セットする。
            Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, () => {
                this.Size.Width = this.Elem.width();
                this.Size.Height = this.Elem.height();
                this.Refresh();
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

        public Show(duration: number = 200): void {
            //Dump.Log(`PageView.Show: ${this.Elem.data('controller')}`);
            if (this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
            animator.FromParams.Opacity = 0.5;
            animator.ToParams = Anim.Params.GetCurrent(this);
            animator.ToParams.Opacity = 1.0;
            animator.OnComplete = () => {
                this.Dom.style.display = `block`;
                this.Refresh();
                this.DispatchEvent(Events.Shown);
            };
            animator.Invoke(duration);
        }

        public Hide(duration: number = 200): void {
            //Dump.Log(`PageView.Hide: ${this.Elem.data('controller')}`);
            if (!this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams = Anim.Params.GetCurrent(this);
            animator.FromParams.Opacity = 1.0;
            animator.ToParams = Anim.Params.GetSlided(this, -1, 0);
            animator.ToParams.Opacity = 0.5;
            animator.OnComplete = () => {
                this.Dom.style.display = `none`;
                this.Refresh();
                this.DispatchEvent(Events.Hidden);
            };

            animator.Invoke(duration);
        }

        protected InnerRefresh(): void {
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
                const bottom = phHeight + view.Position.Y + (view.Size.Width / 2);

                if (left < minLeft)
                    minLeft = left;
                if (top < minTop)
                    minTop = top;
                if (maxRight < right)
                    maxRight = right;
                if (maxBottom < bottom)
                    maxBottom = bottom;
            });

            if (minLeft < 0
                || minTop < 0
                || this.Size.Width < maxRight
                || this.Size.Height < maxBottom
            ) {
                // はみ出したコンテンツがある -> ページのドラッグ操作あり
                this.Dom.style.left = `${this.Position.X}px`;
                this.Dom.style.top = `${this.Position.Y}px`;
            } else {
                // コンテンツが自身の範囲内 -> ページ固定表示
                this.Dom.style.left = `0px`;
                this.Dom.style.top = `0px`;
            }
            this.Dom.style.width = `100%`;
            this.Dom.style.height = `100%`;
        }

        public Dispose(): void {
            super.Dispose();

            this._id = null;
        }
    }
}