/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="./ViewBase.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Number = Fw.Util.Number;

    export class BoxView extends ViewBase {

        private _hasBorder: boolean;
        public get HasBorder(): boolean {
            return this._hasBorder;
        }
        public set HasBorder(value: boolean) {
            this.Dom.style.borderWidth = (value)
                ? '1px'
                : '0';
        }

        private _borderRadius: number;
        public get BorderRadius(): number {
            return this._borderRadius;
        }
        public set BorderRadius(value: number) {
            if (Number.IsNaN(value) || value === null || value === undefined)
                value = 0;

            if (value < 0)
                value = 0;
            if (value > 50)
                value = 50;

            this._borderRadius = value;

            this.Dom.style.borderRadius = `${this._borderRadius}%`;
        }

        constructor() {
            super($('<a></a>'));
        }

        protected Init(): void {
            super.Init();

            this.SetClassName('BoxView');
            this.Elem.addClass(this.ClassName);

            this.HasBorder = true;
            this.BorderRadius = 0;
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();
            this.Dom.style.borderColor = `${this.Color}`;
        }

        public Dispose(): void {
            super.Dispose();

            this._hasBorder = null;
            this._borderRadius = null;
        }
    }
}