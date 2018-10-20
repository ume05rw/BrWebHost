/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="../../Util/Num.ts" />

namespace Fw.Views.Property {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;
    import Num = Fw.Util.Num;

    export class Size {
        private _view: IView = null;

        private _width: number = 0;
        public get Width(): number {
            return this._width;
        }
        public set Width(value: number) {
            // nullは許可、その他は例外
            if (Num.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._width !== value);
            this._width = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.SizeChanged);
        }

        private _height: number = 0;
        public get Height(): number {
            return this._height;
        }
        public set Height(value: number) {
            // nullは許可、その他は例外
            if (Num.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._height !== value);
            this._height = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.SizeChanged);
        }

        constructor(view: IView = null) {
            this._view = view;
        }

        public Dispose(): void {
            this._view = null;
            this._width = null;
            this._height = null;
        }
    }
}