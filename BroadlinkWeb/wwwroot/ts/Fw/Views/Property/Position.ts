/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />
/// <reference path="PositionPolicy.ts" />

namespace Fw.Views.Property {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;
    import Number = Fw.Util.Number;

    export class Position {
        private _view: IView = null;

        private _policy: PositionPolicy = PositionPolicy.Centering;
        public get Policy(): PositionPolicy {
            return this._policy;
        }
        public set Policy(value: PositionPolicy) {
            if (!value)
                throw new Error("value type not allowed");

            const changed = (this._policy !== value);

            if (changed) {
                if (this._policy === PositionPolicy.Centering) {
                    // 更新前が中央ポリシーのとき
                    // 現在の値を左上ポリシー値に計算して保持させる。
                    this._left = this.Left || 0;
                    this._top = this.Top || 0;
                } else {
                    // 更新前が左上ポリシーのとき
                    // 現在の値を中央ポリシー値に計算して保持させる。
                    this._x = this.X || 0;
                    this._y = this.Y || 0;
                }
            }

            this._policy = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionPolicyChanged);
        }

        private _x: number = 0;
        public get X(): number {
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                return this._x;
            } else {
                // 左上ポリシー
                if (!this._view)
                    return null;

                const sset = this.GetSizeSet();
                return sset.MyHalfWidth + this._left - sset.ParentHalfWidth;
            }
        }
        public set X(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            let changed: boolean = false;
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                changed = (this._x !== value);
                this._x = value;
            } else {
                // 左上ポリシー
                const sset = this.GetSizeSet();

                // 更新後のLeftを取得
                const newValue = sset.ParentHalfWidth - sset.MyHalfWidth + value;
                changed = (this._left !== newValue);
                this._left = newValue;
            }

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionChanged);
        }

        private _y: number = 0;
        public get Y(): number {
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                return this._y;
            } else {
                // 左上ポリシー
                if (!this._view)
                    return null;

                const sset = this.GetSizeSet();
                return sset.MyHalfHeight + this._top - sset.ParentHalfHeight;
            }
        }
        public set Y(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            let changed: boolean = false;
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                changed = (this._y !== value);
                this._y = value;
            } else {
                // 左上ポリシー
                const sset = this.GetSizeSet();

                // 更新後のTopを取得
                const newValue = sset.ParentHalfHeight - sset.MyHalfHeight + value;
                changed = (this._top !== newValue);
                this._top = newValue;
            }

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionChanged);
        }

        private _left: number = 0;
        public get Left(): number {
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                if (!this._view)
                    return null;

                const sset = this.GetSizeSet();
                return sset.ParentHalfWidth - sset.MyHalfWidth + this._x;
            } else {
                // 左上ポリシー
                return this._left;
            }
        }
        public set Left(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            let changed: boolean = false;
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                const sset = this.GetSizeSet();

                // 更新後のXを取得
                const newValue = sset.MyHalfWidth + value - sset.ParentHalfWidth;
                changed = (this._x !== newValue);
                this._x = newValue;
            } else {
                // 左上ポリシー
                changed = (this._left !== value);
                this._left = value;
            }

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionChanged);
        }

        private _top: number = 0;
        public get Top(): number {
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                if (!this._view)
                    return null;

                const sset = this.GetSizeSet();
                return sset.ParentHalfHeight - sset.MyHalfHeight + this._y;
            } else {
                // 左上ポリシー
                return this._top;
            }
        }
        public set Top(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            let changed: boolean = false;
            if (this._policy === PositionPolicy.Centering) {
                // 中央ポリシー
                const sset = this.GetSizeSet();

                // 更新後のYを取得
                const newValue = sset.MyHalfHeight + value - sset.ParentHalfHeight;
                changed = (this._y !== newValue);
                this._y = newValue;
            } else {
                // 左上ポリシー
                changed = (this._top !== value);
                this._top = value;
            }

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionChanged);
        }


        constructor(view: IView = null) {
            this._view = view;
        }

        private GetSizeSet(): SizeSet {
            return new SizeSet(this._view);
        }

        public Dispose(): void {
            this._view = null;
            this._x = null;
            this._y = null;
        }
    }

    class SizeSet {
        //public readonly ParentWidth: number;
        //public readonly ParentHeight: number;
        //public readonly MyWidth: number;
        //public readonly MyHeight: number;

        public readonly ParentHalfWidth: number;
        public readonly ParentHalfHeight: number;

        public readonly MyHalfWidth: number;
        public readonly MyHalfHeight: number;

        constructor(view: IView) {
            let parentWidth: number;
            let parentHeight: number;

            if (view.Parent) {
                // 親Viewが存在する
                parentWidth = view.Parent.Size.Width;
                parentHeight = view.Parent.Size.Height;
            } else {
                // 親Viewが存在しない
                const parent = $(view.Elem.parent());
                parentWidth = parent.width();
                parentHeight = parent.height();
            }


            this.ParentHalfWidth = parentWidth / 2;
            this.ParentHalfHeight = parentHeight / 2;

            this.MyHalfWidth = view.Size.Width / 2;
            this.MyHalfHeight = view.Size.Height / 2;

            //this.ParentWidth = parentWidth;
            //this.ParentHeight = parentHeight;
            //this.MyWidth = view.Size.Width;
            //this.MyHeight = view.Size.Height;
        }
    }
}