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
            this._hasBorder = value;
            //this.Dom.style.borderWidth = (value) ? '1px' : '0';
            this.SetStyle('borderWidth', (value)
                ? '1px'
                : '0');
            this.Refresh();
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

            this.SetStyle('borderRadius', `${this._borderRadius}%`);
            this.Refresh();
        }

        constructor() {
            super($('<div></div>'));

            this.SetClassName('BoxView');
            this.Elem.addClass(this.ClassName);

            this.HasBorder = true;
            this.BorderRadius = 0;
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                super.InnerRefresh();

                this.SetStyle('borderColor', `${this.Color}`);
            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._hasBorder = null;
            this._borderRadius = null;
        }
    }
}