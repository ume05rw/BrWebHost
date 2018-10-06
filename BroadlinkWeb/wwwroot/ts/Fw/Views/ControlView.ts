/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./ViewBase.ts" />

namespace Fw.Views {
    export class ControlView extends ViewBase {

        private _label: JQuery;
        public get Label(): string {
            return this._label.html();
        }
        public set Label(value: string) {
            this._label.html(value);
            this.Refresh();
        }

        constructor() {
            super($('<div></div>'));
            this.Init();
        }

        protected Init(): void {
            super.Init();

            this.Elem.addClass('ControlView');
            this._label = $('<span></span>');
            this.Elem.append(this._label);
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();
            const dom = this.Elem.get(0) as HTMLElement;
            dom.style.borderColor = `#${this.Color}`;
        }
    }
}