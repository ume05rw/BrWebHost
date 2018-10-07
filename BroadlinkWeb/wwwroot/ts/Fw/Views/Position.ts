/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Number.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ViewEvents;
    import Number = Fw.Util.Number;

    export class Position {
        private _view: IView;

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

            if (changed)
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

            if (changed)
                this._view.DispatchEvent(Events.PositionChanged);
        }

        constructor(view: IView) {
            this._view = view;
        }

        public Dispose(): void {
            this._view = null;
            this._x = null;
            this._y = null;
        }
    }
}