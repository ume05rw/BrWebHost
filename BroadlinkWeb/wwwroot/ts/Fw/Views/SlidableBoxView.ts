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

    export class SlidableBoxView extends BoxView {

        public get Children(): Array<IView> {
            return this._innerBox.Children;
        }

        private _direction: Property.Direction;
        public get Direction(): Property.Direction {
            return this._direction;
        }

        private _innerBackgroundColor: string = '#F5F5F5';
        public get InnerBackgroundColor(): string {
            return this._innerBackgroundColor;
        }
        public set InnerBackgroundColor(value: string) {
            this._innerBackgroundColor = value;
            this.Refresh();
        }

        private _innerLength: number = 2;
        public get InnerLength(): number {
            return this._innerLength;
        }
        public set InnerLength(value: number) {
            this._innerLength = value;
            this.Refresh();
        }

        private _innerBox: BoxView;
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

            this.HasBorder = false;
            this.BorderRadius = 0;

            this._innerBox.HasBorder = false;
            this._innerBox.SetTransAnimation(false);
            this.Elem.append(this._innerBox.Elem);
            //super.Add(this._innerBox); // Addメソッドでthis.Childrenを呼ぶため循環参照になる。

            // コンストラクタ完了後に実行。
            // コンストラクタ引数で取得したDirectionがセットされていないため。
            this._positionBarMax.Position.Policy = Property.PositionPolicy.LeftTop;
            this._positionBarMax.SetTransAnimation(false);
            this._positionBarMax.Color = '#888888';
            super.Add(this._positionBarMax);
            this._positionBarCurrent.Position.Policy = Property.PositionPolicy.LeftTop;
            this._positionBarCurrent.SetTransAnimation(false);
            this._positionBarCurrent.Color = '#EEEEEE';
            super.Add(this._positionBarCurrent);

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
                //Fw.Root.Instance.SetTextSelection(false);
            });
            this._innerBox.Elem.on('touchmove mousemove', (e) => {
                if (!this._isDragging || this._spcvMouseSuppressor)
                    return;

                // 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
                if (e.eventPhase !== 2)
                    return;

                const addX = e.clientX - this._dragStartMousePosition.X;
                const addY = e.clientY - this._dragStartMousePosition.Y;

                if (this._direction === Property.Direction.Horizontal) {
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
                //Fw.Root.Instance.SetTextSelection(true);
                _.delay(() => {
                    this.AdjustSlidePosition();
                }, 200);
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
            if (this.Direction === Property.Direction.Horizontal) {
                animator.ToParams.X = (toLeft - left);
            } else {
                animator.ToParams.Y = (toTop - top);
            }
            animator.OnComplete = () => {
                if (this.Direction === Property.Direction.Horizontal) {
                    this._innerBox.SetLeftTop(toLeft, null, false);
                } else {
                    this._innerBox.SetLeftTop(null, toTop, false);
                }
                this._spcvMouseSuppressor = false;
            }

            this._spcvMouseSuppressor = true;
            animator.Invoke(500);
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

                if (this.Direction === Property.Direction.Horizontal) {
                    // 横方向
                    if (this.InnerLength < this.Size.Width)
                        this.InnerLength = this.Size.Width;

                    //this.Dom.style.overflowX = 'hidden';//'scroll';
                    //this.Dom.style.overflowY = 'hidden';


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

                    //Dump.Log({
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

                    //this.Dom.style.overflowY = 'hidden';//'scroll';
                    //this.Dom.style.overflowX = 'hidden';
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
                }
                this._innerBox.BackgroundColor = this._innerBackgroundColor;
                
                super.InnerRefresh();

                this.SetStyles({
                    overflowY: 'hidden',
                    overflowX: 'hidden'
                });

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            this._innerBox.Elem.off('touchstart mousedown');
            this._innerBox.Elem.off('touchmove mousemove');
            this._innerBox.Elem.off('touchend mouseup mouseout');

            super.Dispose();

            this._innerBackgroundColor = null;
            this._innerLength = null;
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