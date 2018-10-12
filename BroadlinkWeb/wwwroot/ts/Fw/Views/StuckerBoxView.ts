/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/StuckerBoxViewEvents.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="BoxView.ts" />
/// <reference path="Property/Size.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.StuckerBoxViewEvents;
    import ControlViewEvents = Fw.Events.ControlViewEvents;

    export class StuckerBoxView extends BoxView {

        public get Children(): Array<IView> {
            return this._innerBox.Children;
        }

        private _margin: number;
        public get Margin(): number {
            return this._margin;
        }
        public set Margin(value: number) {
            this._margin = value;
            this.Refresh();
        }

        private _referencePoint: Property.ReferencePoint;
        public get ReferencePoint(): Property.ReferencePoint {
            return this._referencePoint;
        }
        public set ReferencePoint(value: Property.ReferencePoint) {
            this._referencePoint = value;
            this.Refresh();
        }

        private _innerBox: BoxView;
        private _scrollMargin: number = 0;

        private _backupView: IView;
        private _dummyView: IView;
        private _isChildRelocation: boolean = false;
        private _isChildDragging: boolean = false;
        private _isInnerDragging: boolean = false;
        private _relocationTargetView: IView = null;
        private _dragStartMousePosition: Property.Position = new Property.Position();
        private _dragStartViewPosition: Property.Position = new Property.Position();

        protected Init(): void {
            super.Init();

            this.SetClassName('StuckerBoxView');
            this.Elem.addClass(this.ClassName);

            this._margin = 10;
            this._referencePoint = Property.ReferencePoint.LeftTop;
            this._scrollMargin = 0;

            this._innerBox = new BoxView();
            this._innerBox.HasBorder = false;
            this._innerBox.SetTransAnimation(false);
            this._innerBox.SetLeftTop(0, 0);
            this._innerBox.BackgroundColor = 'transparent';
            this.Elem.append(this._innerBox.Elem);
            //super.Add(this._innerBox); // Addメソッドでthis.Childrenを呼ぶため循環参照になる。

            this._backupView = null;
            this._dummyView = new Fw.Views.BoxView();
            this._dummyView.Elem.addClass('Shadow');
            this._dummyView.Position.Policy = Property.PositionPolicy.LeftTop;

            // 下に定義済みのメソッドをthisバインドしておく。
            this.OnSingleClick = this.OnSingleClick.bind(this);
            this.OnChildMouseDown = this.OnChildMouseDown.bind(this);
            this.OnChildMouseMove = this.OnChildMouseMove.bind(this);
            this.OnChildMouseUp = this.OnChildMouseUp.bind(this);

            this.Elem.on('click touchend', this.OnSingleClick);
        }

        public Add(view: IView): void {
            view.Position.Policy = Property.PositionPolicy.LeftTop;
            this._innerBox.Add(view);

            view.AddEventListener(ControlViewEvents.LongClick, this.OnChildLongClick, this);
            view.Elem.on('touchstart mousedown', this.OnChildMouseDown);
            view.Elem.on('touchmove mousemove', this.OnChildMouseMove);
            view.Elem.on('touchend mouseup', this.OnChildMouseUp);
        }

        public Remove(view: IView): void {
            this._innerBox.Remove(view);

            view.RemoveEventListener(ControlViewEvents.LongClick, this.OnChildLongClick);
            view.Elem.off('touchstart mousedown', this.OnChildMouseDown);
            view.Elem.off('touchmove mousemove', this.OnChildMouseMove);
            view.Elem.off('touchend mouseup', this.OnChildMouseUp);
        }

// #region "上下スクロール"

        private OnInnerMouseDown(e: JQueryEventObject): void {
            if (this._isChildRelocation)
                return;

            this._isInnerDragging = true;
        }

        private OnInnerMouseMove(e: JQueryEventObject): void {
            if (this._isChildRelocation)
                return;

        }

        private OnInnerMouseUp(e: JQueryEventObject): void {
            if (this._isChildRelocation)
                return;

            this._isInnerDragging = false;
        }

// #endregion "上下スクロール"

// #region "子View再配置"

        /**
         * 子要素がロングクリックされたとき
         * @param e1
         */
        private OnChildLongClick(e: JQueryEventObject): void {
            //Dump.Log(`${this.ClassName}.OnChildLongClick`);
            this.StartRelocation();
        }

        public StartRelocation(): void {
            //Dump.Log(`${this.ClassName}.StartRelocation`);
            this._isChildRelocation = true;
            Fw.Root.Instance.SetTextSelection(false);

            _.each(this._innerBox.Children, (v: IView) => {
                v.Opacity = 0.7;
                v.SuppressEvent(ControlViewEvents.SingleClick);
                v.SuppressEvent(ControlViewEvents.LongClick);
            });

            this.Refresh();
        }

        /**
         * スタッカーBox自身がクリックされたとき
         * @param e1
         */
        private OnSingleClick(e: JQueryEventObject): void {
            if (e.eventPhase !== 2)
                return;

            //Dump.Log(`${this.ClassName}.OnSingleClick`);
            if (this._isChildRelocation) {
                // 子要素再配置モードのとき、配置を確定させる。
                this.CommitRelocation();
            }
        }

        public CommitRelocation(): void {
            //Dump.Log(`${this.ClassName}.CommitRelocation`);
            if (this._relocationTargetView) {
                this.RestoreDummyView();
                this._relocationTargetView.SetTransAnimation(true);
                this._relocationTargetView = null;
            }

            this._isChildRelocation = false;
            Fw.Root.Instance.SetTextSelection(true);

            _.each(this._innerBox.Children, (v: IView) => {
                v.Opacity = 1.0;
                v.ResumeEvent(ControlViewEvents.SingleClick);
                v.ResumeEvent(ControlViewEvents.LongClick);
            });

            this.Refresh();
        }

        /**
         * 子要素上でマウスボタンが押されたとき
         * @param e
         */
        private OnChildMouseDown(e: JQueryEventObject): void {
            //Dump.Log(`${this.ClassName}.OnChildMouseDown`);
            if (!this._isChildRelocation)
                return;

            const rect = this.Dom.getBoundingClientRect();
            const innerLeft = e.pageX - rect.left;
            const innerTop = e.pageY - rect.top;
            const view = this.GetNearestByPosition(innerLeft, innerTop);
            if (view) {
                //Dump.Log('OnChildMouseDown - view found: ' + (view as ButtonView).Label);
                this._isChildDragging = true;
                this._relocationTargetView = view;
                this._dragStartMousePosition.X = e.pageX;
                this._dragStartMousePosition.Y = e.pageY;
                this._dragStartViewPosition.X = view.Position.Left;
                this._dragStartViewPosition.Y = view.Position.Top;
                this.SetDummyView(view);
                view.SetTransAnimation(false);
            }
        }

        /**
         * 子要素上でマウスが動いたとき
         * @param e1
         */
        private OnChildMouseMove(e: JQueryEventObject): void {
            
            if (!this._isChildRelocation || !this._isChildDragging)
                return;

            //Dump.Log(`${this.ClassName}.OnChildMouseMove`);

            const view = this._relocationTargetView;
            const addX = e.pageX - this._dragStartMousePosition.X;
            const addY = e.pageY - this._dragStartMousePosition.Y;

            view.Position.Left = this._dragStartViewPosition.X + addX;
            view.Position.Top = this._dragStartViewPosition.Y + addY;

            const replaceView = this.GetNearestByView(view);
            if (replaceView !== null && replaceView !== this._dummyView) {
                this.Swap(replaceView, this._dummyView);
            }
        }

        /**
         * 子要素上でマウスボタンが離れたとき
         * @param e
         */
        private OnChildMouseUp(e: JQueryEventObject): void {
            //Dump.Log(`${this.ClassName}.OnChildMouseUp`);
            if (!this._isChildRelocation) {
                this._isChildDragging = false;
            } else {
                this._isChildDragging = false;

                if (this._relocationTargetView) {
                    this._relocationTargetView.SetTransAnimation(true);
                    this._relocationTargetView = null;
                }
                
                this.RestoreDummyView();
                this.Refresh();
            }
        }

        private Swap(view1: IView, view2: IView): void {
            const view1Index = this._innerBox.Children.indexOf(view1);
            const view2Index = this._innerBox.Children.indexOf(view2);

            if (view1Index < 0)
                throw new Error('Not contained view1');

            if (view2Index < 0)
                throw new Error('Not contained view2');

            this._innerBox.Children[view1Index] = view2;
            this._innerBox.Children[view2Index] = view1;
        }

        private GetNearestByView(view: IView): IView {
            let diff = Number.MAX_VALUE;
            let result: IView = null;
            _.each(this._innerBox.Children, (v: IView) => {
                // 渡されたViewは対象外
                if (v === view)
                    return;

                const tmpDiff = Math.abs(v.Position.Left - view.Position.Left)
                    + Math.abs(v.Position.Top - view.Position.Top);

                if (tmpDiff < diff) {
                    diff = tmpDiff;
                    result = v;
                }
            });

            return result;
        }

        private GetNearestByPosition(x: number, y: number): IView {
            let diff = Number.MAX_VALUE;
            let result: IView = null;
            _.each(this._innerBox.Children, (v: IView) => {
                // ダミーViewは対象外
                if (v === this._dummyView)
                    return;

                const left = v.Position.Left + (v.Size.Width / 2);
                const top = v.Position.Top + (v.Size.Height / 2);
                const tmpDiff = Math.abs(left - x) + Math.abs(top - y);

                if (tmpDiff < diff) {
                    diff = tmpDiff;
                    result = v;
                }
            });

            return result;
        }

        private SetDummyView(view: IView): void {
            if (this._backupView)
                this.RestoreDummyView();

            _.each(this._innerBox.Children, (v: IView, index: number) => {
                if (v === view) {
                    this._backupView = v;
                    this._innerBox.Children[index] = this._dummyView;
                    this._dummyView.Color = v.Color;
                    this._dummyView.SetSize(v.Size.Width, v.Size.Height);
                }
            });
            this._innerBox.Elem.append(this._dummyView.Elem);
        }

        private RestoreDummyView(): void {
            if (!this._backupView)
                return;

            _.each(this._innerBox.Children, (v: IView, index: number) => {
                if (v === this._dummyView)
                    this._innerBox.Children[index] = this._backupView;
            });
            this._backupView = null;
            this._dummyView.Elem.detach();
        }

// #endregion "子View再配置"

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();
                this._innerBox.SuppressLayout();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.SuppressLayout();
                });

                this._innerBox.Size.Width = this.Size.Width;
                this._innerBox.Size.Height = this.Size.Height;

                // 先に描画領域を計算し、this._scrollMargin を得る。
                switch (this._referencePoint) {
                    case Property.ReferencePoint.LeftTop:
                        this.InnerRefreshLeftTop(true);
                        break;
                    case Property.ReferencePoint.RightTop:
                        this.InnerRefreshRightTop(true);
                        break;
                    case Property.ReferencePoint.LeftBottom:
                        this.InnerRefreshLeftBottom(true);
                        break;
                    case Property.ReferencePoint.RightBottom:
                        this.InnerRefreshRightBottom(true);
                        break;
                    default:
                        throw new Error(`ReferencePoint not found: ${this._referencePoint}`);
                }

                // this._scrollMargin の分だけ、内部Viewを広げる。
                this._innerBox.Size.Height = this.Size.Height + Math.abs(this._scrollMargin);

                // 子Viewを配置する。
                switch (this._referencePoint) {
                    case Property.ReferencePoint.LeftTop:
                        this.InnerRefreshLeftTop(false);
                        break;
                    case Property.ReferencePoint.RightTop:
                        this.InnerRefreshRightTop(false);
                        break;
                    case Property.ReferencePoint.LeftBottom:
                        this.InnerRefreshLeftBottom(false);
                        break;
                    case Property.ReferencePoint.RightBottom:
                        this.InnerRefreshRightBottom(false);
                        break;
                    default:
                        throw new Error(`ReferencePoint not found: ${this._referencePoint}`);
                }

                super.InnerRefresh();

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
                this._innerBox.ResumeLayout();
                this._innerBox.Refresh();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.ResumeLayout();
                });
            }
        }

        private InnerRefreshLeftTop(calcScrollMargin: boolean): void {
            const maxRight = this.Size.Width - this._margin;

            let currentLeft = this._margin;
            let currentTop = this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this._innerBox.Children, (view: IView) => {

                const isOverWidth = (maxRight < (currentLeft + view.Size.Width));
                if (isOverWidth && rowElemCount !== 0) {
                    // 表示幅を超え、かつ既にその行に要素が出力されているとき
                    // 改行後に要素を出力する。
                    currentTop += rowMaxHeight + this._margin;
                    currentLeft = this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }

                rowElemCount++;

                if (!calcScrollMargin) {
                    view.Position.Left = currentLeft;
                    view.Position.Top = currentTop;
                }

                if (rowMaxHeight < view.Size.Height)
                    rowMaxHeight = view.Size.Height;

                currentLeft += view.Size.Width + this._margin;

                if (isOverWidth && rowElemCount === 0) {
                    // 表示幅を超え、かつその行先頭要素のとき
                    // 要素を出力したあとで改行する。
                    currentLeft = this._margin;
                    currentTop += rowMaxHeight + this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }
            });

            if (calcScrollMargin) {
                const maxBotton = currentTop + rowMaxHeight + this._margin;
                if (this.Size.Height < maxBotton) {
                    this._scrollMargin = maxBotton - this.Size.Height;
                } else {
                    this._scrollMargin = 0;
                }
            }
        }

        private InnerRefreshRightTop(calcScrollMargin: boolean): void {
            const minLeft = this._margin;

            let currentRight = this.Size.Width - this._margin;
            let currentTop = this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this._innerBox.Children, (view: IView) => {

                const isOverWidth = ((currentRight - view.Size.Width) < minLeft);
                if (isOverWidth && rowElemCount !== 0) {
                    // 表示幅を超え、かつ既にその行に要素が出力されているとき
                    // 改行後に要素を出力する。
                    currentTop += rowMaxHeight + this._margin;
                    currentRight = this.Size.Width - this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }

                rowElemCount++;
                if (!calcScrollMargin) {
                    view.Position.Left = currentRight - view.Size.Width;
                    view.Position.Top = currentTop;
                }

                if (rowMaxHeight < view.Size.Height)
                    rowMaxHeight = view.Size.Height;

                currentRight -= view.Size.Width + this._margin;

                if (isOverWidth && rowElemCount === 0) {
                    // 表示幅を超え、かつその行先頭要素のとき
                    // 要素を出力したあとで改行する。
                    currentTop += rowMaxHeight + this._margin;
                    currentRight = this.Size.Width - this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }
            });

            if (calcScrollMargin) {
                const maxBotton = currentTop + rowMaxHeight + this._margin;
                if (this.Size.Height < maxBotton) {
                    this._scrollMargin = maxBotton - this.Size.Height;
                } else {
                    this._scrollMargin = 0;
                }
            }
        }

        private InnerRefreshLeftBottom(calcScrollMargin: boolean): void {
            const maxRight = this.Size.Width - this._margin;

            let currentLeft = this._margin;
            let currentBottom = (calcScrollMargin)
                ? this.Size.Height - this._margin
                : this._innerBox.Size.Height - this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this._innerBox.Children, (view: IView) => {

                const isOverWidth = (maxRight < (currentLeft + view.Size.Width));
                if (isOverWidth && rowElemCount !== 0) {
                    // 表示幅を超え、かつ既にその行に要素が出力されているとき
                    // 改行後に要素を出力する。
                    currentBottom -= rowMaxHeight + this._margin;
                    currentLeft = this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }

                rowElemCount++;
                if (!calcScrollMargin) {
                    view.Position.Left = currentLeft;
                    view.Position.Top = currentBottom - view.Size.Height;
                }

                if (rowMaxHeight < view.Size.Height)
                    rowMaxHeight = view.Size.Height;

                currentLeft += view.Size.Width + this._margin;

                if (isOverWidth && rowElemCount === 0) {
                    // 表示幅を超え、かつその行先頭要素のとき
                    // 要素を出力したあとで改行する。
                    currentBottom -= rowMaxHeight + this._margin;
                    currentLeft = this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }
            });

            const minTop = currentBottom - rowMaxHeight - this._margin;

            if (calcScrollMargin) {
                if (minTop < 0) {
                    this._scrollMargin = minTop;
                } else {
                    this._scrollMargin = 0;
                }
            }
        }

        private InnerRefreshRightBottom(calcScrollMargin: boolean): void {
            const minLeft = this._margin;

            let currentRight = this.Size.Width - this._margin;
            let currentBottom = (calcScrollMargin)
                ? this.Size.Height - this._margin
                : this._innerBox.Size.Height - this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this._innerBox.Children, (view: IView) => {

                const isOverWidth = ((currentRight - view.Size.Width) < minLeft);
                if (isOverWidth && rowElemCount !== 0) {
                    // 表示幅を超え、かつ既にその行に要素が出力されているとき
                    // 改行後に要素を出力する。
                    currentBottom -= rowMaxHeight + this._margin;
                    currentRight = this.Size.Width - this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }

                rowElemCount++;
                if (!calcScrollMargin) {
                    view.Position.Left = currentRight - view.Size.Width;
                    view.Position.Top = currentBottom - view.Size.Height;
                }

                if (rowMaxHeight < view.Size.Height)
                    rowMaxHeight = view.Size.Height;

                currentRight -= view.Size.Width + this._margin;

                if (isOverWidth && rowElemCount === 0) {
                    // 表示幅を超え、かつその行先頭要素のとき
                    // 要素を出力したあとで改行する。
                    currentBottom -= rowMaxHeight + this._margin;
                    currentRight = this.Size.Width - this._margin;
                    rowElemCount = 0;
                    rowMaxHeight = 0;
                }
            });

            if (calcScrollMargin) {
                const minTop = currentBottom - rowMaxHeight - this._margin;
                if (minTop < 0) {
                    this._scrollMargin = minTop;
                } else {
                    this._scrollMargin = 0;
                }
            }
        }

        public Dispose(): void {
            this.Elem.off('click touchend');
            this._innerBox.Elem.off('touchstart mousedown');
            this._innerBox.Elem.off('touchmove mousemove');
            this._innerBox.Elem.off('touchend mouseup mouseout');

            super.Dispose();

            this._margin = null;
        }
    }
}