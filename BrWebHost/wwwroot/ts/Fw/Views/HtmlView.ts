/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FontWeight.ts" />
/// <reference path="../Util/Num.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Property = Fw.Views.Property;
    import Num = Fw.Util.Num;

    export class HtmlView extends ViewBase {

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
            if (Num.IsNaN(value) || value === null || value === undefined)
                value = 0;

            if (value < 0)
                value = 0;
            if (value > 50)
                value = 50;

            this._borderRadius = value;

            this.SetStyle('borderRadius', `${this._borderRadius}%`);
            this.Refresh();
        }

        private _innerHtml: string;
        public get InnerHtml(): string {
            return this._innerHtml;
        }
        public set InnerHtml(value: string) {
            const changed = (this._innerHtml !== value);
            this._innerHtml = value;

            if (changed) {
                this.Elem.html(this._innerHtml);
                this.Refresh();
            }
        }

        constructor(elementType: string) {
            super($(`<${elementType}></${elementType}>`));

            this.SetClassName('HtmlView');
            this.Elem.addClass(this.ClassName);

            this._innerHtml = '';

            this.BackgroundColor = 'transparent';
            this.SetTransAnimation(false);

            this.HasBorder = false;
            this.BorderRadius = 0;
        }
    }
}
