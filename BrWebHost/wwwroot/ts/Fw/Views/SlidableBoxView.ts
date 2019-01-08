/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/SlidableBoxViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="BoxView.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="Property/MouseLocation.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.SlidableBoxViewEvents;
    import MouseLocation = Fw.Views.Property.MouseLocation;

    export class SlidableBoxView extends BoxView {

        public get Children(): Array<IView> {
            return this._innerBox.Children;
        }

        private _direction: Property.Direction;
        public get Direction(): Property.Direction {
            return this._direction;
        }

        //private _innerBackgroundColor: string = '#F5F5F5';
        //public get InnerBackgroundColor(): string {
        //    return this._innerBackgroundColor;
        //}
        //public set InnerBackgroundColor(value: string) {
        //    this._innerBackgroundColor = value;
        //    this.Refresh();
        //}

        private _innerLength: number = 10;
        public get InnerLength(): number {
            return this._innerLength;
        }
        public set InnerLength(value: number) {
            this._innerLength = value;
            this.Refresh();
        }

        // TODO: 一時的にpublic化。あとでprivateに戻す。
        public _innerBox: BoxView;
        private _positionBarMax: LineView;
        private _positionBarCurrent: LineView;
        private _barMargin: number = 10;
        private _isDragging: boolean = false;
        private _spcvMouseSuppressor = false;
        private _dragStartMousePosition: Property.Position;
        private _dragStartViewPosition: Property.Position;

        constructor(direction: Property.Direction) {
            super();

            // nullやundefinedを入れさせない。
            this._direction = (direction === Property.Direction.Horizontal)
                ? Property.Direction.Horizontal
                : Property.Direction.Vertical;

            this._innerBox = new BoxView();
            this._positionBarMax = new LineView(this._direction);
            this._positionBarCurrent = new LineView(this._direction);

            this.SetClassName('SlidablePanelView');
            this.Elem.addClass(this.ClassName);

            this._dragStartMousePosition = new Property.Position();
            this._dragStartViewPosition = new Property.Position();

            this.Position.Policy = Property.PositionPolicy.LeftTop;
            this.HasBorder = false;
            this.BorderRadius = 0;

            this._innerBox.HasBorder = false;
            this._innerBox.SetTransAnimation(false);
            this._innerBox.SetLeftTop(0, 0);
            this._innerBox.BackgroundColor = 'transparent';
            this._innerBox.SetParent(this);
            this.Elem.append(this._innerBox.Elem);


            //this.EnableLog = true;

            // コンストラクタ完了後に実行。
            // コンストラクタ引数で取得したDirectionがセットされていないため。
            this._positionBarMax.Position.Policy = Property.PositionPolicy.LeftTop;
            this._positionBarMax.SetTransAnimation(false);
            this._positionBarMax.Color = '#EEEEEE';
            this._positionBarMax.SetParent(this);
            this.Elem.append(this._positionBarMax.Elem);

            this._positionBarCurrent.Position.Policy = Property.PositionPolicy.LeftTop;
            this._positionBarCurrent.SetTransAnimation(false);
            this._positionBarCurrent.Color = '#888888';
            this._positionBarCurrent.SetParent(this);
            this.Elem.append(this._positionBarCurrent.Elem);

            this.AddEventListener(Events.Initialized, (e) => {
                this.InitView();
            });

            this._innerBox.Elem.addClass('SlidablePanelInnerView');


            this._innerBox.Elem.on('touchstart mousedown', (e) => {
                //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
                //if (e.eventPhase !== 2)
                //    return;

                this._isDragging = true;

                const ml = MouseLocation.Create(e);
                this._dragStartMousePosition.X = ml.PageX;
                this._dragStartMousePosition.Y = ml.PageY;

                this._dragStartViewPosition.X = this._innerBox.Position.Left;
                this._dragStartViewPosition.Y = this._innerBox.Position.Top;
                Fw.Root.Instance.SetTextSelection(false);
            });
            this._innerBox.Elem.on('touchmove mousemove', (e) => {
                // * ドラッグ処理中でないとき *　は無視する。
                if (!this._isDragging || this._spcvMouseSuppressor)
                    return;

                //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
                //if (e.eventPhase !== 2)
                //    return;

                const ml = MouseLocation.Create(e);
                const addX = ml.ClientX - this._dragStartMousePosition.X;
                const addY = ml.ClientY - this._dragStartMousePosition.Y;
                
                if (this._direction === Property.Direction.Horizontal) {
                    // 横方向
                    let left = this._dragStartViewPosition.X + addX;
                    const margin = this.Size.Width - this.InnerLength;

                    if (left < margin)
                        left = margin;
                    else if (0 < left)
                        left = 0;

                    this._innerBox.Position.Left = left;

                } else {
                    // 縦方向
                    let top = this._dragStartViewPosition.Y + addY;
                    const margin = this.Size.Height - this.InnerLength;

                    if (top < margin)
                        top = margin;
                    else if (0 < top)
                        top = 0;

                    this._innerBox.Position.Top = top;
                }
                this.Refresh();
            });

            var mouseWheelEvent = 'onwheel' in document
                ? 'wheel'
                : 'onmousewheel' in document
                        ? 'mousewheel'
                        : 'DOMMouseScroll';

            this._innerBox.Elem.on(mouseWheelEvent, (e) => {
                // * ドラッグ処理中 * のときは無視する。
                if (this._isDragging || this._spcvMouseSuppressor)
                    return;

                const orgEv = e.originalEvent as any;
                const delta = orgEv.deltaY
                    ? -(orgEv.deltaY)
                    : orgEv.wheelDelta
                        ? orgEv.wheelDelta
                        : -(orgEv.detail);
                const direction = (delta === 0)
                    ? 0
                    : (delta > 0)
                        ? 1
                        : -1;

                if (this._direction === Property.Direction.Horizontal) {
                    // 横方向
                    let left = this._innerBox.Position.Left + (direction * 20);
                    const margin = this.Size.Width - this.InnerLength;

                    if (left < margin)
                        left = margin;
                    else if (0 < left)
                        left = 0;

                    this._innerBox.Position.Left = left;

                } else {
                    // 縦方向
                    let top = this._innerBox.Position.Top + (direction * 10);
                    const margin = this.Size.Height - this.InnerLength;

                    if (top < margin)
                        top = margin;
                    else if (0 < top)
                        top = 0;

                    this._innerBox.Position.Top = top;
                }
                this.Refresh();
            });

            this._innerBox.Elem.on('touchend mouseup mouseout', (e) => {
                //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
                //if (e.eventPhase !== 2)
                //    return;

                this._isDragging = false;
                Fw.Root.Instance.SetTextSelection(true);
            });
        }

        private InitView(): void {
            if (this.Direction === Property.Direction.Horizontal) {
                // 横方向
                if (this.InnerLength < this.Size.Width)
                    this.InnerLength = this.Size.Width;

                //this.Dom.style.overflowX = 'hidden';//'scroll';
                //this.Dom.style.overflowY = 'hidden';
                this.SetStyles({
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                });

                this._innerBox.Size.Width = this.InnerLength;
                this._innerBox.Size.Height = this.Size.Height;
                this._innerBox.Position.X = (this._innerBox.Size.Width - this.Size.Width) / 2;
                this._innerBox.Position.Y = 0;
            } else {
                // 縦方向
                if (this.InnerLength < this.Size.Height)
                    this.InnerLength = this.Size.Height;

                //this.Dom.style.overflowY = 'hidden';//'scroll';
                //this.Dom.style.overflowX = 'hidden';
                this.SetStyles({
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                });

                this._innerBox.Size.Height = this.InnerLength;
                this._innerBox.Size.Width = this.Size.Width;
                this._innerBox.Position.Y = (this._innerBox.Size.Height - this.Size.Height) / 2;
                this._innerBox.Position.X = 0;
            }
        }

        public Add(view: IView): void {
            this._innerBox.Add(view);
        }

        public Remove(view: IView): void {
            this._innerBox.Remove(view);
        }


        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();
                this._innerBox.SuppressLayout();
                this._positionBarMax.SuppressLayout();
                this._positionBarCurrent.SuppressLayout();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.SuppressLayout();
                });

                //this._innerBox.BackgroundColor = this._innerBackgroundColor;


                super.InnerRefresh();

                this.SetStyles({
                    overflowY: 'hidden',
                    overflowX: 'hidden'
                });

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
                this._innerBox.ResumeLayout();
                this._innerBox.Refresh();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.ResumeLayout();
                    view.Refresh();
                });
                this._positionBarMax.ResumeLayout();
                this._positionBarMax.Refresh();
                this._positionBarCurrent.ResumeLayout();
                this._positionBarCurrent.Refresh();
            }
        }

        public CalcLayout(): void {
            try {
                this.SuppressLayout();
                this._innerBox.SuppressLayout();
                this._positionBarMax.SuppressLayout();
                this._positionBarCurrent.SuppressLayout();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.SuppressLayout();
                });

                // 子Viewより前に、自身のサイズを確定させる。
                super.CalcLayout();

                if (this.Direction === Property.Direction.Horizontal) {
                    // 横方向
                    if (this.InnerLength < this.Size.Width)
                        this.InnerLength = this.Size.Width;

                    const maxInnerLength = this.GetMaxInnerLength();
                    if (this.InnerLength < maxInnerLength)
                        this.InnerLength = maxInnerLength;

                    const margin = this.Size.Width - this.InnerLength;
                    if (this._innerBox.Position.Left < margin)
                        this._innerBox.Position.Left = margin;
                    else if (0 < this._innerBox.Position.Left)
                        this._innerBox.Position.Left = 0;

                    this._innerBox.Size.Width = this.InnerLength;
                    this._innerBox.Size.Height = this.Size.Height;

                    this._positionBarMax.SetAnchor(null, this._barMargin, this._barMargin, this._barMargin);
                    this._positionBarMax.Length = this.Size.Width - (this._barMargin * 2);

                    this._positionBarCurrent.SetAnchor(null, null, null, this._barMargin);
                    this._positionBarCurrent.Length
                        = this._positionBarMax.Length
                        * (this.Size.Width / this.InnerLength);

                    const maxLeft = this.InnerLength - this.Size.Width;
                    const currentLeft = this._innerBox.Position.Left;
                    const posRate = (maxLeft === 0)
                        ? 1
                        : currentLeft / maxLeft;
                    const leftLength
                        = this._positionBarMax.Length - this._positionBarCurrent.Length;
                    this._positionBarCurrent.Position.Left = this._barMargin - (leftLength * posRate);

                    this._positionBarMax.CalcLayout();
                    this._positionBarCurrent.CalcLayout();

                    if (this.InnerLength <= this.Size.Width) {
                        this._positionBarMax.Hide();
                        this._positionBarCurrent.Hide();
                    } else {
                        this._positionBarMax.Show();
                        this._positionBarCurrent.Show();
                    }
                        
                    //this.Log({
                    //    max_Length: this._positionBarMax.Length,
                    //    current_Length: this._positionBarCurrent.Length,
                    //    maxLeft: maxLeft,
                    //    currentLeft: currentLeft,
                    //    posRate: posRate,
                    //    leftLength: leftLength,
                    //    current_Left: this._positionBarCurrent.Position.Left
                    //});

                } else {
                    // 縦方向
                    if (this.InnerLength < this.Size.Height)
                        this.InnerLength = this.Size.Height;

                    const maxInnerLength = this.GetMaxInnerLength();
                    if (this.InnerLength < maxInnerLength)
                        this.InnerLength = maxInnerLength;

                    const margin = this.Size.Height - this.InnerLength;
                    if (this._innerBox.Position.Top < margin)
                        this._innerBox.Position.Top = margin;
                    else if (0 < this._innerBox.Position.Top)
                        this._innerBox.Position.Top = 0;

                    this._innerBox.Size.Height = this.InnerLength;
                    this._innerBox.Size.Width = this.Size.Width;

                    this._positionBarMax.SetAnchor(this._barMargin, null, this._barMargin, this._barMargin);
                    this._positionBarMax.Length = this.Size.Height - (this._barMargin * 2);

                    this._positionBarCurrent.SetAnchor(null, null, this._barMargin, null);
                    this._positionBarCurrent.Length
                        = this._positionBarMax.Length
                        * (this.Size.Height / this.InnerLength);

                    const maxTop = this.InnerLength - this.Size.Height;
                    const currentTop = this._innerBox.Position.Top;
                    const posRate = (maxTop === 0)
                        ? 1
                        : currentTop / maxTop;
                    const topLength
                        = this._positionBarMax.Length - this._positionBarCurrent.Length;
                    this._positionBarCurrent.Position.Top = this._barMargin - (topLength * posRate);

                    this._positionBarMax.CalcLayout();
                    this._positionBarCurrent.CalcLayout();

                    if (this.InnerLength <= this.Size.Height) {
                        this._positionBarMax.Hide();
                        this._positionBarCurrent.Hide();
                    } else {
                        this._positionBarMax.Show();
                        this._positionBarCurrent.Show();
                    }
                }

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
                this._innerBox.ResumeLayout();
                this._positionBarMax.ResumeLayout();
                this._positionBarCurrent.ResumeLayout();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.ResumeLayout();
                });
            }
        }

        private GetMaxInnerLength(): number {

            let maxWidth = 0;
            let maxHeight = 0;

            _.each(this._innerBox.Children, (view: IView) => {
                const right = view.Position.Left + view.Size.Width + this._barMargin;
                const bottom = view.Position.Top + view.Size.Height + this._barMargin;
                if (maxWidth < right)
                    maxWidth = right;
                if (maxHeight < bottom)
                    maxHeight = bottom;
            });

            return (this.Direction === Property.Direction.Horizontal)
                ? maxWidth
                : maxHeight;
        }

        public Dispose(): void {
            

            this._innerBox.SetParent(null);
            this._positionBarMax.SetTransAnimation(null);
            this._positionBarCurrent.SetParent(null);
            this._innerBox.Elem.remove();
            this._positionBarMax.Elem.remove();
            this._positionBarCurrent.Elem.remove();

            super.Dispose();

            this._innerLength = null;

            this._innerBox.Elem.off();
            this._innerBox.Dispose();
            this._innerBox = null;

            this._isDragging = null;
            this._spcvMouseSuppressor = null;
            this._dragStartMousePosition.Dispose();
            this._dragStartMousePosition = null;
            this._dragStartViewPosition.Dispose();
            this._dragStartViewPosition = null;
        }
    }
}
