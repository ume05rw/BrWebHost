/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/StuckerBoxViewEvents.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="BoxView.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="Property/MouseLocation.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Property = Fw.Views.Property;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.StuckerBoxViewEvents;
    import ControlViewEvents = Fw.Events.ControlViewEvents;
    import MouseLocation = Fw.Views.Property.MouseLocation;

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

        private _rightMargin: number;
        public get RightMargin(): number {
            return this._rightMargin;
        }
        public set RightMargin(value: number) {
            this._rightMargin = value;
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

        private _isChildRelocatable: boolean;
        public get IsChildRelocatable(): boolean {
            return this._isChildRelocatable;
        }
        public set IsChildRelocatable(value: boolean) {
            this._isChildRelocatable = value;
            this.Refresh();
        }

        private _isChildRelocation: boolean;
        public get IsChildRelocation(): boolean {
            return this._isChildRelocation;
        }

        public LockedImage: string = '';
        public UnlockedImage: string = '';
        public get LockButton(): ButtonView {
            return this._lockButton;
        }

        private _innerBox: BoxView;
        private _positionBarMax: LineView;
        private _positionBarCurrent: LineView;
        private _lockButton: ButtonView;
        private _scrollMargin: number = 0;

        private _backupView: IView;
        private _dummyView: IView;
        private _childrenOrder: Array<string> = null;
        
        private _isChildDragging: boolean = false;
        private _isInnerDragging: boolean = false;
        private _relocationTargetView: IView = null;
        private _sbvInMouseStartPosition: Property.Position = new Property.Position();
        private _sbvInViewStartPosition: Property.Position = new Property.Position();
        private _sbvChMouseStartPosition: Property.Position = new Property.Position();
        private _sbvChViewStartPosition: Property.Position = new Property.Position();

        constructor() {
            super();

            this._innerBox = new BoxView();
            this._positionBarMax = new LineView(Property.Direction.Vertical);
            this._positionBarCurrent = new LineView(Property.Direction.Vertical);
            this._lockButton = new ButtonView();
            this._dummyView = new Fw.Views.BoxView();

            this.LockedImage = 'images/Fw/Locked.png';
            this.UnlockedImage = 'images/Fw/Unlocked.png';

            this.SetClassName('StuckerBoxView');
            this.Elem.addClass(this.ClassName);

            this._margin = 10;
            this._rightMargin = 20;
            this._referencePoint = Property.ReferencePoint.LeftTop;
            this._scrollMargin = 0;
            this._isChildRelocatable = true;
            this._isChildRelocation = false;

            this._innerBox.HasBorder = false;
            this._innerBox.SetTransAnimation(false);
            this._innerBox.SetLeftTop(0, 0);
            this._innerBox.BackgroundColor = 'transparent';
            this._innerBox.SetParent(this);
            this.Elem.append(this._innerBox.Elem);
            //super.Add(this._innerBox); // Addメソッドでthis.Childrenを呼ぶため循環参照になる。

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

            this._lockButton.SetSize(30, 30);
            this._lockButton.Position.Policy = Property.PositionPolicy.LeftTop;
            this._lockButton.BorderRadius = 50;
            this._lockButton.HasBorder = true;
            this._lockButton.Color = '#9d9e9e';
            this._lockButton.BackgroundColor = '#FFFFFF';
            this._lockButton.HoverColor = '#F4F4F4';
            this._lockButton.ImageFitPolicy = Property.FitPolicy.Auto;
            this._lockButton.ImageSrc = this.LockedImage;
            this._lockButton.Hide(0);

            this._backupView = null;
            this._dummyView.Elem.addClass('Shadow');
            this._dummyView.Position.Policy = Property.PositionPolicy.LeftTop;

            // 下に定義済みのメソッドをthisバインドしておく。
            this.OnInnerMouseDown = this.OnInnerMouseDown.bind(this);
            this.OnInnerMouseMove = this.OnInnerMouseMove.bind(this);
            this.OnInnerMouseUp = this.OnInnerMouseUp.bind(this);

            this.OnChildMouseDown = this.OnChildMouseDown.bind(this);
            this.OnChildMouseMove = this.OnChildMouseMove.bind(this);
            this.OnInnerMouseWheel = this.OnInnerMouseWheel.bind(this);
            this.OnChildMouseUp = this.OnChildMouseUp.bind(this);

            this.OnInnerSingleClick = this.OnInnerSingleClick.bind(this);
            this.OnLockButtonClick = this.OnLockButtonClick.bind(this);

            this._innerBox.Elem.on('touchstart mousedown', this.OnInnerMouseDown);
            this._innerBox.Elem.on('touchmove mousemove', this.OnInnerMouseMove);
            this._innerBox.Elem.on('touchend mouseup mouseout', this.OnInnerMouseUp);

            this._lockButton.Elem.on('click', this.OnLockButtonClick)

            var mouseWheelEvent = 'onwheel' in document
                ? 'wheel'
                : 'onmousewheel' in document
                    ? 'mousewheel'
                    : 'DOMMouseScroll';
            this._innerBox.Elem.on(mouseWheelEvent, this.OnInnerMouseWheel);

            this.AddEventListener(Events.Attached, () => {
                this.Parent.Add(this._lockButton);
            });
            this.AddEventListener(Events.Detached, () => {
                this.Parent.Remove(this._lockButton);
            });
        }

        public Add(view: IView): void {
            view.Position.Policy = Property.PositionPolicy.LeftTop;
            this._innerBox.Add(view);

            //view.AddEventListener(ControlViewEvents.LongClick, this.OnChildLongClick, this);
            view.Elem.on('touchstart mousedown', this.OnChildMouseDown);
            view.Elem.on('touchmove mousemove', this.OnChildMouseMove);
            view.Elem.on('touchend mouseup', this.OnChildMouseUp);
        }

        public Remove(view: IView): void {
            this._innerBox.Remove(view);

            //view.RemoveEventListener(ControlViewEvents.LongClick, this.OnChildLongClick, this);
            view.Elem.off('touchstart mousedown', this.OnChildMouseDown);
            view.Elem.off('touchmove mousemove', this.OnChildMouseMove);
            view.Elem.off('touchend mouseup', this.OnChildMouseUp);
        }

        public AddSpacer(): void {
            const spacer = new Views.BoxView();
            spacer.BackgroundColor = App.Items.Color.Transparent;
            spacer.Color = App.Items.Color.Transparent;
            spacer.HasBorder = false;
            spacer.Opacity = 0;
            spacer.SetAnchor(null, 0, 0, null);
            spacer.Size.Height = 0;
            this.Add(spacer);
        }

// #region "上下スクロール"

        private _mouseClickTime: Date;
        private OnInnerMouseDown(e: JQueryEventObject): void {

            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            //this.Log(`mousedown`);

            this._mouseClickTime = new Date();

            const ml = MouseLocation.Create(e);
            this._sbvInMouseStartPosition.X = ml.ClientX;
            this._sbvInMouseStartPosition.Y = ml.ClientY;

            this._sbvInViewStartPosition.X = this._innerBox.Position.Left;
            this._sbvInViewStartPosition.Y = this._innerBox.Position.Top;

            if (this._isChildRelocation) {
            } else {
                //this.Log(`${this.ClassName}.OnInnerMouseDown`);

                this._isInnerDragging = true;
                Fw.Root.Instance.SetTextSelection(false);
            }
        }

        private OnInnerMouseMove(e: JQueryEventObject): void {

            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            //this.Log(`mousemove`);

            if (this._isChildRelocation || this._scrollMargin === 0)
                return;

            // * ドラッグ処理中でないとき *　は無視する。
            if (!this._isInnerDragging)
                return;

            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            const ml = MouseLocation.Create(e);
            const addY = ml.ClientY - this._sbvInMouseStartPosition.Y;
            let top = this._sbvInViewStartPosition.Y + addY;

            const margin = this._scrollMargin * -1;
            if (top < margin)
                top = margin;
            else if (0 < top)
                top = 0;

            this._innerBox.Position.Top = top;
            this.Refresh();
        }

        private OnInnerMouseWheel(e: JQueryEventObject): void {
            if (this._isChildRelocation || this._scrollMargin === 0)
                return;

            // * ドラッグ処理中のとき *　は無視する。
            if (this._isInnerDragging)
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

            let top = this._innerBox.Position.Top + (direction * 20);
            const margin = this._scrollMargin * -1;
            if (top < margin)
                top = margin;
            else if (0 < top)
                top = 0;

            this._innerBox.Position.Top = top;
            this.Refresh();
        }

        private OnInnerMouseUp(e: JQueryEventObject): void {

            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            this.Log(`mouseup`);

            // シングルクリック判定
            if (this._mouseClickTime) {
                const elasped = (new Date()).getTime() - this._mouseClickTime.getTime();
                const ml = MouseLocation.Create(e);
                const addX = ml.ClientX - this._sbvInMouseStartPosition.X;
                const addY = ml.ClientY - this._sbvInMouseStartPosition.Y;
                if (elasped < 800
                    && (Math.abs(addX) + Math.abs(addY)) < 30
                ) {
                    this.OnInnerSingleClick();
                }
                this._mouseClickTime = null;
            }

            //this.Log(`${this.ClassName}.OnInnerMouseUp`);
            if (this._isChildRelocation) {
                // 子View再配置モードのとき
            } else {
                // 内部Viewドラッグ中のとき

                // ドラッグ終了処理。
                this._isInnerDragging = false;
                Fw.Root.Instance.SetTextSelection(true);
            }
        }

// #endregion "上下スクロール"

// #region "子View再配置"

        /**
         * スタッカーBox自身がクリックされたとき
         * @param e1
         */
        private OnInnerSingleClick(): void {
            //this.Log(`${this.ClassName}.OnSingleClick`);

            // 再配置不能のとき
            if (!this._isChildRelocatable) {
                if (this._lockButton.IsVisible) {
                    this._lockButton.ClearAnimatedClass();
                    this._lockButton.Hide();
                }
                if (this._isChildRelocation) {
                    // 子View再配置モードのとき
                    // 配置を確定させる。
                    this.CommitRelocation();
                }
                return;
            }

            if (this._lockButton.IsVisible) {
                // ロックボタン表示中のとき
                if (!this._isChildRelocation) {
                    this._lockButton.ClearAnimatedClass();
                    this._lockButton.Hide();
                }
            } else {
                // ロックボタン非表示のとき
                // 現在のロック状態を表示する。
                const image = (this._isChildRelocation)
                    ? this.UnlockedImage
                    : this.LockedImage;

                if (image !== this._lockButton.ImageSrc)
                    this._lockButton.ImageSrc = image;

                this._lockButton.ClearAnimatedClass();
                this._lockButton.Show();

                // 再配置モードでないとき、2秒後も再配置モードにしていなければ、ボタンを消す。
                if (!this._isChildRelocation) {
                    _.delay(() => {
                        if (!this._isChildRelocation)
                            this._lockButton.Hide();
                    }, 2000);
                }
            }
        }

        /**
         * ロックボタンがクリックされたとき
         * 
         * @param e
         */
        private OnLockButtonClick(e: JQueryEventObject): void {

            //if (e.eventPhase !== 2)
            //    return;

            // 一旦、変更後のロック状態を表示。
            this._lockButton.ImageSrc = (this._isChildRelocation)
                ? this.LockedImage
                : this.UnlockedImage;

            if (this._isChildRelocation) {
                // 子View再配置モードのとき
                // 配置を確定させる。
                this.CommitRelocation();

                _.delay(() => {
                    this._lockButton.Hide();
                }, 700);

            } else {
                // 通常モードのとき
                // 子View再配置モードを開始する。
                this.StartRelocation();
            }
        }

        public StartRelocation(): void {
            //this.Log(`${this.ClassName}.StartRelocation`);
            this._isChildRelocation = true;

            // 再配置開始時点の配置順を保持する。
            this._childrenOrder = new Array<string>();
            _.each(this._innerBox.Children, (v: IView) => {
                this._childrenOrder.push(v.InstanceId);
            });

            Fw.Root.Instance.SetTextSelection(false);

            _.each(this._innerBox.Children, (v: IView) => {
                v.Opacity = 0.7;
                v.SuppressEvent(ControlViewEvents.SingleClick);
                v.SuppressEvent(ControlViewEvents.LongClick);
            });

            if (!this._lockButton.IsVisible) {
                _.delay(() => {
                    if (!this._lockButton.IsVisible) {
                        if (this._lockButton.ImageSrc !== this.UnlockedImage)
                            this._lockButton.ImageSrc = this.UnlockedImage;

                        this._lockButton.ClearAnimatedClass();
                        this._lockButton.Show();
                    }
                }, 500);
            }

            this.DispatchEvent(Events.RelocationStarted);

            this.Refresh();
        }

        public CommitRelocation(): void {
            //this.Log(`${this.ClassName}.CommitRelocation`);
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

            let changed = false;
            _.each(this._innerBox.Children, (v: IView, idx: number) => {
                if (v.InstanceId !== this._childrenOrder[idx])
                    changed = true;
            });

            this._childrenOrder = null;

            if (this._lockButton.IsVisible
                && this._lockButton.ImageSrc !== this.LockedImage
            ) {
                if (this._lockButton.ImageSrc !== this.LockedImage)
                    this._lockButton.ImageSrc = this.LockedImage;
            }

            _.delay(() => {
                if (this._lockButton.IsVisible) {
                    this._lockButton.ClearAnimatedClass();
                    this._lockButton.Hide();
                    this.Refresh();
                }
            }, 700);

            if (changed)
                this.DispatchEvent(Events.OrderChanged);

            this.DispatchEvent(Events.RelocationEnded);

            this.Refresh();
        }

        /**
         * 子要素上でマウスボタンが押されたとき
         * @param e
         */
        private OnChildMouseDown(e: JQueryEventObject): void {
            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            //this.Log(`${this.ClassName}.OnChildMouseDown`);
            if (!this._isChildRelocation)
                return;

            const rect = this.Dom.getBoundingClientRect();

            const ml = MouseLocation.Create(e);
            const innerLeft = ml.PageX - rect.left;
            const innerTop = ml.PageY - rect.top + (this._innerBox.Position.Top * -1);
            const view = this.GetNearestByPosition(innerLeft, innerTop);
            if (view) {
                //this.Log('OnChildMouseDown - view found: ' + (view as ButtonView).Label);
                this._isChildDragging = true;
                this._relocationTargetView = view;
                this._sbvChMouseStartPosition.X = ml.PageX;
                this._sbvChMouseStartPosition.Y = ml.PageY;
                this._sbvChViewStartPosition.X = view.Position.Left;
                this._sbvChViewStartPosition.Y = view.Position.Top;
                this.SetDummyView(view);
                view.SetTransAnimation(false);
            }
        }

        /**
         * 子要素上でマウスが動いたとき
         * @param e1
         */
        private OnChildMouseMove(e: JQueryEventObject): void {
            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            if (!this._isChildRelocation || !this._isChildDragging)
                return;

            //this.Log(`${this.ClassName}.OnChildMouseMove`);

            const view = this._relocationTargetView;

            const ml = MouseLocation.Create(e);
            const addX = ml.PageX - this._sbvChMouseStartPosition.X;
            const addY = ml.PageY - this._sbvChMouseStartPosition.Y;

            view.Position.Left = this._sbvChViewStartPosition.X + addX;
            view.Position.Top = this._sbvChViewStartPosition.Y + addY;

            const replaceView = this.GetNearestByView(view);
            if (replaceView !== null && replaceView !== this._dummyView) {
                this.MoveView(this._dummyView, replaceView);
            }

            this.Refresh();
        }

        private MoveView(movingView: IView, toView: IView): void {
            const movingIndex = this._innerBox.Children.indexOf(movingView);
            let toIndex = this._innerBox.Children.indexOf(toView);

            if (movingIndex < 0)
                throw new Error('Not contained movingView');

            if (toIndex < 0)
                throw new Error('Not contained toView');


            // 差し込み対象を一旦配列から削除
            this._innerBox.Children.splice(movingIndex, 1);

            // 差し込み対象を目標位置に差し込む。※toIndexは配列に存在しなくても(=末尾でも)良い。
            this._innerBox.Children.splice(toIndex, 0, movingView);
        }

        /**
         * 子要素上でマウスボタンが離れたとき
         * @param e
         */
        private OnChildMouseUp(e: JQueryEventObject): void {
            //// 子Viewからのバブルアップイベント等は無視、自身のイベントのみ見る。
            //if (e.eventPhase !== 2)
            //    return;

            //this.Log(`${this.ClassName}.OnChildMouseUp`);
            if (!this._isChildRelocation) {
                this._isChildDragging = false;
            } else {
                this._isChildDragging = false;

                if (this._relocationTargetView) {
                    this._relocationTargetView.SetTransAnimation(true);
                    this._relocationTargetView = null;
                }
                
                this.RestoreDummyView();

                let changed = false;
                _.each(this._innerBox.Children, (v: IView, idx: number) => {
                    if (v.InstanceId !== this._childrenOrder[idx])
                        changed = true;
                });
                if (changed)
                    this.DispatchEvent(Events.OrderUncommitChanged);

                this.Refresh();
            }
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
                this.Log(`${this.ClassName}.InnerRefresh`);
                this.SuppressLayout();
                this._innerBox.SuppressLayout();
                this._positionBarMax.SuppressLayout();
                this._positionBarCurrent.SuppressLayout();
                this._lockButton.SuppressLayout()
                _.each(this._innerBox.Children, (view: IView) => {
                    view.SuppressLayout();
                });

                super.InnerRefresh();

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
                this._lockButton.ResumeLayout()
                this._lockButton.Refresh()
                //this.Log(`${this.ClassName}.InnerRefresh-End`);
            }
        }

        public CalcLayout(): void {
            try {
                this.SuppressLayout();
                this._innerBox.SuppressLayout();
                this._positionBarMax.SuppressLayout();
                this._positionBarCurrent.SuppressLayout();
                this._lockButton.SuppressLayout();
                _.each(this._innerBox.Children, (view: IView) => {
                    view.SuppressLayout();
                });

                // 子Viewより前に、自身のサイズを確定させる。
                super.CalcLayout();

                this._innerBox.Size.Width = this.Size.Width;
                this._innerBox.Size.Height = this.Size.Height;

                _.each(this._innerBox.Children, (view: IView) => {
                    view.CalcLayout();
                });

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

                // リサイズ後、過剰にスクロールしていた場合は戻す。
                if ((this._scrollMargin * -1) > this._innerBox.Position.Top) {
                    this._innerBox.Position.Top = (this._scrollMargin * -1);
                }

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

                this.InnerRefreshPositionLine();

                this._lockButton.Position.Left
                    = this.Position.Left + this.Size.Width - this._lockButton.Size.Width;
                this._lockButton.Position.Top
                    = this.Position.Top - (this._lockButton.Size.Height / 2);

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
                this._lockButton.ResumeLayout();
                this._lockButton.Refresh();
            }
        }

        private InnerRefreshLeftTop(calcScrollMargin: boolean): void {
            const maxRight = this.Size.Width - this._margin;

            let currentLeft = this._margin;
            let currentTop = this._margin;
            let rowMaxHeight = 0;
            let rowElemCount = 0;

            _.each(this._innerBox.Children, (view: IView) => {

                if (!view.IsVisible)
                    return;

                const isOverWidth = (maxRight < (currentLeft + view.Size.Width + this._rightMargin));
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

                if (!view.IsVisible)
                    return;

                const isOverWidth = ((currentRight - view.Size.Width + this._rightMargin) < minLeft);
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

                if (!view.IsVisible)
                    return;

                const isOverWidth = (maxRight < (currentLeft + view.Size.Width + this._rightMargin));
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

            if (calcScrollMargin) {
                const minTop = currentBottom - rowMaxHeight - this._margin;
                if (minTop < 0) {
                    this._scrollMargin = minTop * -1;
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

                if (!view.IsVisible)
                    return;

                const isOverWidth = ((currentRight - view.Size.Width) < minLeft + this._rightMargin);
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
                    this._scrollMargin = minTop * -1;
                } else {
                    this._scrollMargin = 0;
                }
            }
        }

        private InnerRefreshPositionLine(): void {
            switch (this._referencePoint) {
                case Property.ReferencePoint.LeftTop:
                case Property.ReferencePoint.LeftBottom:
                    this._positionBarMax.SetAnchor(this._margin, null, this._margin, this._margin);
                    this._positionBarCurrent.SetAnchor(null, null, this._margin, null);
                    break;
                case Property.ReferencePoint.RightTop:
                case Property.ReferencePoint.RightBottom:
                    this._positionBarMax.SetAnchor(this._margin, this._margin, null, this._margin);
                    this._positionBarCurrent.SetAnchor(null, this._margin, null, null);
                    break;
                default:
                    throw new Error(`ReferencePoint not found: ${this._referencePoint}`);
            }

            this._positionBarMax.Length = this.Size.Height - (this._margin * 2);

            this._positionBarCurrent.Length
                = this._positionBarMax.Length
                * (this.Size.Height / this._innerBox.Size.Height);

            const maxTop = this._innerBox.Size.Height - this.Size.Height;
            const currentTop = this._innerBox.Position.Top;
            const posRate = (maxTop === 0)
                ? 1
                : currentTop / maxTop;
            const topLength
                = this._positionBarMax.Length - this._positionBarCurrent.Length;

            this._positionBarCurrent.Position.Top = this._margin - (topLength * posRate);

            this._positionBarMax.CalcLayout();
            this._positionBarCurrent.CalcLayout();

            if (this._innerBox.Size.Height <= this.Size.Height) {
                this._positionBarMax.Hide();
                this._positionBarCurrent.Hide();
            } else {
                this._positionBarMax.Show();
                this._positionBarCurrent.Show();
            }
        }

        public Dispose(): void {
            this._innerBox.Elem.off();

            super.Dispose();

            this._margin = null;
        }
    }
}
