/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlEvents;
    import Number = Fw.Util.Number;

    export class ImageView extends ViewBase {
        private _image: JQuery;

        public get Source(): string {
            return this._image.attr('src');
        }
        public set Source(value: string) {
            this._image.attr('src', value);
            this.Refresh();
        }

        constructor() {
            super($('<a></a>'));
            this.ClassName = 'ImageView';
        }

        protected Init(): void {
            super.Init();

            this.Elem.addClass('ImageView');
            this._image = $('<img class="ControlViewProperty"></img>');
            this.Elem.append(this._image);

            this.Dom.style.borderWidth = '0';
            this.Dom.style.borderRadius = '0';
        }
    }
}