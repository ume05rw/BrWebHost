/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
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
        }

        protected Init(): void {
            super.Init();

            this.SetClassName('ImageView');
            this.Elem.addClass(this.ClassName);

            this.Dom.style.borderWidth = '0';
            this.Dom.style.borderRadius = '0';

            this._image = $('<img class="ImageViewProperty"></img>');
            this._image.on('load', () => {
                Dump.Log('Image Loaded!!');
                this.Refresh();
            });

            this.Elem.append(this._image);
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();

            const imgDom = this._image.get(0) as HTMLImageElement;
            const imgWidth = imgDom.naturalWidth;
            const imgHeight = imgDom.naturalHeight;


            Dump.Log({
                event: this.ClassName + '.InnerRefresh',
                imgWidth: imgWidth,
                imgHeight: imgHeight,

            });
        }

        public Dispose(): void {
            super.Dispose();

            this._image.remove();
            this._image = null;
        }
    }
}