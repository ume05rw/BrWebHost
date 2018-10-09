/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Number.ts" />

namespace Fw.Views.Property {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;
    import Number = Fw.Util.Number;

    export class Position {
        private _view: IView = null;

        private _x: number = 0;
        public get X(): number {
            return this._x;
        }
        public set X(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._x !== value);
            this._x = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionChanged);
        }

        private _y: number = 0;
        public get Y(): number {
            return this._y;
        }
        public set Y(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._y !== value);
            this._y = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.PositionChanged);
        }

        public get Left(): number {
            if (!this._view)
                return null;

            const parent = $(this._view.Elem.parent());
            const parentWidth = (this._view.Parent)
                ? this._view.Parent.Size.Width
                : parent.width();

            const pHalfWidth = (parentWidth / 2);
            const myHalfWidth = (this._view.Size.Width / 2);

            return pHalfWidth - myHalfWidth + this._x;
        }

        public get Top(): number {
            if (!this._view)
                return null;

            const parent = $(this._view.Elem.parent());
            const parentHeight = (this._view.Parent)
                ? this._view.Parent.Size.Height
                : parent.height();

            const pHalfHeight = (parentHeight / 2);
            const myHalfHeight = (this._view.Size.Height / 2);

            return pHalfHeight - myHalfHeight + this._y;
        }


        constructor(view: IView = null) {
            this._view = view;
        }

        public Dispose(): void {
            this._view = null;
            this._x = null;
            this._y = null;
        }
    }
}