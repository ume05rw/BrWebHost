/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ControlView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class ButtonView extends ControlView {

        private _imageView: ImageView;

        public get ImageSrc(): string {
            return this._imageView.Src;
        }
        public set ImageSrc(value: string) {
            this._imageView.Src = value;
        }

        protected Init(): void {
            super.Init();

            this.SetClassName('ButtonView');
            this.Elem.addClass(this.ClassName);

            this._imageView = new ImageView();
            this._imageView.Src = null;
            this.Add(this._imageView);
        }

        protected InnerRefresh(): void {

            this._imageView.Size.Width = this.Size.Width;
            this._imageView.Size.Height = this.Size.Height;

            super.InnerRefresh()
        }
    }
}