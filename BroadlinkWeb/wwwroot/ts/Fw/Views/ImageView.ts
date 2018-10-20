/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;
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
            super($('<div></div>'));

            this._image = new Image();

            this.SetClassName('ImageView');
            this.Elem.addClass(this.ClassName);

            this.BackgroundColor = 'transparent';

            this.SetStyles({
                borderWidth: '0',
                borderRadius: '0'
            });

            // 注) ImageオブジェクトはDomツリーに入れない。
            this._image.onload = () => {
                //Dump.Log('Image Loaded!!');
                this.Refresh();
            };

            this._firPolicy = FitPolicy.Auto;
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                super.InnerRefresh();

                this.SetStyles({
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: this.FitPolicy,
                    backgroundImage: (this._src) ? `url(${this._src})` : null
                });
            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._image = null;
            this._src = null;
            this._firPolicy = null;
        }
    }
}
