/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Number = Fw.Util.Number;
    import FitPolicy = Fw.Views.Property.FitPolicy;

    export class ImageView extends ViewBase {
        private _image: HTMLImageElement;

        private _src: string;
        public get Src(): string {
            return this._src;
        }
        public set Src(value: string) {
            this._src = value;
            this._image.src = value;
            this.Refresh();
        }

        private _firPolicy: FitPolicy;
        public get FitPolicy(): FitPolicy {
            return this._firPolicy;
        }
        public set FitPolicy(value: FitPolicy) {
            this._firPolicy = value;
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

            // 注) ImageオブジェクトはDomツリーに入れない。
            this._image = new Image();
            this._image.onload = () => {
                Dump.Log('Image Loaded!!');
                this.Refresh();
            };

            this._firPolicy = FitPolicy.Auto;
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();

            this.Dom.style.backgroundPosition = 'center center';
            this.Dom.style.backgroundRepeat = 'no-repeat';
            this.Dom.style.backgroundSize = this.FitPolicy;
            this.Dom.style.backgroundImage = `url(${this._src})`;
        }

        public Dispose(): void {
            super.Dispose();

            this._image = null;
            this._src = null;
            this._firPolicy = null;
        }
    }
}