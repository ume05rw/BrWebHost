/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FontWeight.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Property = Fw.Views.Property;

    export class HtmlView extends ViewBase {

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

            this.SetStyles({
                borderWidth: '0',
                borderRadius: '0'
            });
        }
    }
}
