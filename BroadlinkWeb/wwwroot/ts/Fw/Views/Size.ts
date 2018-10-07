/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Number.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ViewEvents;
    import Number = Fw.Util.Number;

    export class Size {
        private _view: IView;

        private _width: number = 0;
        public get Width(): number {
            return this._width;
        }
        public set Width(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._width !== value);
            this._width = value;

            if (changed)
                this._view.DispatchEvent(Events.SizeChanged);
        }

        private _height: number = 0;
        public get Height(): number {
            return this._height;
        }
        public set Height(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._height !== value);
            this._height = value;

            if (changed)
                this._view.DispatchEvent(Events.SizeChanged);
        }

        constructor(view: IView) {
            this._view = view;
        }

        public Dispose(): void {
            this._view = null;
            this._width = null;
            this._height = null;
        }
    }
}