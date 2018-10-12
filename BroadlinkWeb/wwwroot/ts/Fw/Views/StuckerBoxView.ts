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


        protected Init(): void {
            super.Init();

            this.SetClassName('ContainerBoxView');
            this.Elem.addClass(this.ClassName);

            this._margin = 10;
            this._referencePoint = Property.ReferencePoint.LeftTop;

            this._backupView = null;
            this._dummyView = new Fw.Views.BoxView();
            this._dummyView.Elem.addClass('Shadow');
            this._dummyView.Position.Policy = Property.PositionPolicy.LeftTop;
        }

        public Add(view: IView): void {
            view.Position.Policy = Property.PositionPolicy.LeftTop;
            super.Add(view);

            view.AddEventListener(ControlViewEvents.LongClick, this.OnChildLongClick);
            view.Elem.on('touchstart mousedown', this.OnChildMouseDown);
            view.Elem.on('touchmove mousemove', this.OnChildMouseMove);
            view.Elem.on('touchend mouseup', this.OnChildMouseUp);
        }

        public Remove(view: IView): void {
            super.Remove(view);

            view.RemoveEventListener(ControlViewEvents.LongClick, this.OnChildLongClick);
            view.Elem.off('touchstart mousedown', this.OnChildMouseDown);
            view.Elem.off('touchmove mousemove', this.OnChildMouseMove);
            view.Elem.off('touchend mouseup', this.OnChildMouseUp);
        }

        private _backupView: IView;
        private _dummyView: IView;
        private _isChildRelocation: boolean = false;
        private _isChildDragging: boolean = false;
        private _relocationTargetView: IView = null;
        private _dragStartMousePosition: Property.Position = new Property.Position();
        private _dragStartViewPosition: Property.Position = new Property.Position();

        /**
         * 子要素がロングクリックされたとき
         * @param e1
         */
        private OnChildLongClick(e1: JQueryEventObject): void {
            this.StartRelocation();
        }

        public StartRelocation(): void {
            this._isChildRelocation = true;
            Fw.Root.Instance.SetTextSelection(false);

            _.each(this.Children, (v: IView) => {
                v.Opacity = 0.7;
            });

            this.Refresh();
        }

        /**
         * スタッカーBox自身がクリックされたとき
         * @param e1
         */
        private OnSingleClick(e1: JQueryEventObject): void {
            const logic = (e2: JQueryEventObject) => {
                this.CommitRelocation();
            };
            logic(e1);
        }

        public CommitRelocation(): void {
            if (this._relocationTargetView)
                this.RestoreDummyView();

            this._isChildRelocation = false;
            Fw.Root.Instance.SetTextSelection(true);

            _.each(this.Children, (v: IView) => {
                v.Opacity = 1.0;
            });

            this.Refresh();
        }

        /**
         * 子要素上でマウスボタンが押されたとき
         * @param e
         */
        private OnChildMouseDown(e1: JQueryEventObject): void {
            const logic = (e2: JQueryEventObject) => {
                if (!this._isChildRelocation)
                    return;

                const view = this.GetNearestByPosition(e2.clientX, e2.clientY);
                if (view) {
                    this._isChildDragging = true;
                    this._relocationTargetView = view;
                    this._dragStartMousePosition.X = e2.clientX;
                    this._dragStartMousePosition.Y = e2.clientY;
                    this._dragStartViewPosition.X = view.Position.Left;
                    this._dragStartViewPosition.Y = view.Position.Top;
                    this.SetDummyView(view);
                }
            };
            logic(e1);
        }

        /**
         * 子要素上でマウスが動いたとき
         * @param e1
         */
        private OnChildMouseMove(e1: JQueryEventObject): void {
            const logic = (e2: JQueryEventObject) => {
                if (!this._isChildRelocation || !this._isChildDragging)
                    return;

                const view = this._relocationTargetView;
                const addX = e2.clientX - this._dragStartMousePosition.X;
                const addY = e2.clientY - this._dragStartMousePosition.Y;

                view.Position.Left = this._dragStartViewPosition.X + addX;
                view.Position.Top = this._dragStartViewPosition.Y + addY;

                const replaceView = this.GetNearestByView(view);
                if (replaceView !== null && replaceView !== this._dummyView) {
                    this.MoveInFronOf(replaceView, this._dummyView);
                }
            };
            logic(e1);
        }

        /**
         * 子要素上でマウスボタンが離れたとき
         * @param e1
         */
        private OnChildMouseUp(e1: JQueryEventObject): void {
            const logic = (e2: JQueryEventObject) => {
                if (!this._isChildRelocation) {
                    this._isChildDragging = false;
                } else {
                    this._isChildDragging = false;
                    this.RestoreDummyView();
                    this._relocationTargetView = null;
                }
            };
            logic(e1);
        }


        private MoveInFronOf(baseView: IView, moveView: IView): void {
            let baseIndex = this.Children.indexOf(baseView);
            const moveIndex = this.Children.indexOf(moveView);

            if (baseIndex < 0)
                throw new Error('Not contained baseView');

            if (moveIndex < 0)
                throw new Error('Not contained moveView');

            this.Children.splice(moveIndex, 1);

            baseIndex = this.Children.indexOf(baseView);
            this.Children.splice(baseIndex, 0, moveView);
        }

        private GetNearestByView(view: IView): IView {
            let diff = Number.MAX_VALUE;
            let result: IView = null;
            _.each(this.Children, (v: IView) => {
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
            _.each(this.Children, (v: IView) => {
                // ダミーViewは対象外
                if (v === this._dummyView)
                    return;

                const tmpDiff = Math.abs(v.Position.X - x)
                    + Math.abs(v.Position.Y - y);

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

            _.each(this.Children, (v: IView, index: number) => {
                if (v === view) {
                    this._backupView = v;
                    this.Children[index] = this._dummyView;
                    this._dummyView.Color = v.Color;
                    this._dummyView.SetSize(v.Size.Width, v.Size.Height);
                }
            });
        }

        private RestoreDummyView(): void {
            if (!this._backupView)
                return;

            _.each(this.Children, (v: IView, index: number) => {
                if (v === this._dummyView)
                    this.Children[index] = this._backupView;
            });
            this._backupView = null;
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                switch (this._referencePoint) {
                    case Property.ReferencePoint.LeftTop:
                        this.InnerRefreshLeftTop();
                        break;
                    case Property.ReferencePoint.RightTop:
                        this.InnerRefreshRightTop();
                        break;
                    case Property.ReferencePoint.LeftBottom:
                        this.InnerRefreshLeftBottom();
                        break;
                    case Property.ReferencePoint.RightBottom:
                        this.InnerRefreshRightBottom();
                        break;
                    default:
                        throw new Error(`ReferencePoint not found: ${this._referencePoint}`);
                }

                this.InnerRefreshLeftTop();

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        private InnerRefreshLeftTop(): void {
            const maxRight = this.Size.Width - this._margin;

            let currentLeft = this._margin;
            let currentTop = this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this.Children, (view: IView) => {

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
                view.Position.Left = currentLeft;
                view.Position.Top = currentTop;

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
        }

        private InnerRefreshRightTop(): void {
            const minLeft = this._margin;

            let currentRight = this.Size.Width - this._margin;
            let currentTop = this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this.Children, (view: IView) => {

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
                view.Position.Left = currentRight - view.Size.Width;
                view.Position.Top = currentTop;

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
        }

        private InnerRefreshLeftBottom(): void {
            const maxRight = this.Size.Width - this._margin;

            let currentLeft = this._margin;
            let currentBottom = this.Size.Height - this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this.Children, (view: IView) => {

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
                view.Position.Left = currentLeft;
                view.Position.Top = currentBottom - view.Size.Height;

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
        }

        private InnerRefreshRightBottom(): void {
            const minLeft = this._margin;

            let currentRight = this.Size.Width - this._margin;
            let currentBottom = this.Size.Height - this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this.Children, (view: IView) => {

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
                view.Position.Left = currentRight - view.Size.Width;
                view.Position.Top = currentBottom - view.Size.Height;

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
        }

        public Dispose(): void {
            super.Dispose();

            this._margin = null;
        }
    }
}