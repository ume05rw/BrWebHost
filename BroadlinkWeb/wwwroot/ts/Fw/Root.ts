/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

/// <reference path="EventableBase.ts" />

/// <reference path="Events/RootEvents.ts" />
/// <reference path="Util/Dump.ts" />
/// <reference path="Views/Property/Size.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.RootEvents;
    import Property = Fw.Views.Property;

    export class Root extends EventableBase {
        private static _instance: Root = null;
        public static get Instance(): Root {
            if (!Root._instance) {
                throw new Error('Root.Init() has not been executed.');
            }

            return Root._instance;
        }
        public static Init(selectorString: string): void {
            Root._instance = new Root($(selectorString));
        }


        private _dom: HTMLElement;
        public get Dom(): HTMLElement {
            return this._dom;
        }

        private _size: Property.Size;
        public get Size(): Property.Size {
            return this._size;
        }

        private _masked: boolean;

        private _mask: Fw.Views.BoxView;

        private _renderInitializer: Fw.Util.DelayedOnceExecuter;

        private constructor(jqueryElem: JQuery) {
            super();

            this.SetElem(jqueryElem);
            this.SetClassName('Root');

            this._size = new Property.Size();
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();
            this._dom = jqueryElem.get(0) as HTMLElement;

            this._masked = false;

            //this.EnableLog = true;

            const $window = $(window);
            $window.on('resize', () => {
                this.Refresh();
                this.DispatchEvent(Events.Resized);
            });

            this._renderInitializer = new Fw.Util.DelayedOnceExecuter(
                this,
                () => {
                    this._viewRefreshInterval = 30;
                    this._releaseInitialized = true;
                    this.DispatchEvent(Events.PageInitializeCompleted);
                    Dump.Log('Root.ReleasePageInitialize - Released');
                },
                300,
                -1,
                true
            );
            this._renderInitializer.Name = 'RenderInitializer';


            // Root.Init()の終了後にViewBaseからFw.Root.Instanceを呼び出す。
            _.defer(() => {
                this._mask = new Fw.Views.BoxView();
                this._mask.Elem.removeClass('TransAnimation');
                this._mask.Elem.addClass('RootMask');
                this._mask.HasBorder = false;
                this._mask.BackgroundColor = '#000000';
                this._mask.ZIndex = -1;

                // RootはIViewでないので、this.Addは出来ない。
                this.Elem.append(this._mask.Elem);

                this._mask.Elem.on('click touchend', () => {
                    this.DispatchEvent(Events.MaskClicked);
                });

                this.Refresh();
            });
        }

        public Mask(): void {
            //this.Log(`${this.ClassName}.Mask`);
            this._masked = true;
            this.Refresh();
        }

        public UnMask(): void {
            //this.Log(`${this.ClassName}.UnMask`);
            this._masked = false;
            
            this.Refresh();
        }

        public SetTextSelection(enable: boolean): void {
            if (enable && this.Elem.hasClass('TextUnselect'))
                this.Elem.removeClass('TextUnselect');
            else if (!enable && !this.Elem.hasClass('TextUnselect'))
                this.Elem.addClass('TextUnselect');
        }

        private _viewRefreshInterval: number = 3000;
        public get ViewRefreshInterval(): number {
            return this._viewRefreshInterval;
        }

        /**
         * @description ページ生成開始から一定時間、ViewのDom更新頻度を大幅に下げる。
         */
        public StartPageInitialize(): void {
            // ViewのDom更新を抑止する。
            this._releaseInitialized = false;
            this._viewRefreshInterval = 3000;
            this.DispatchEvent(Events.PageInitializeStarted);
            Dump.Log('Root.StartPageInitialize');
        }

        private _releaseInitialized: boolean = false;
        public ReleasePageInitialize(view: Fw.Views.IView): void {
            if (this._releaseInitialized)
                return;

            //this.Log('Root.ReleasePageInitialize: ' + view.ObjectIdentifier);
            this._renderInitializer.Exec();
        }


        public Refresh(): void {
            // this.Sizeのセッターが無いので、フィールドに直接書き込む。
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();

            if (this._mask) {
                this._mask.SetSize(this._size.Width, this._size.Height);

                if (this._masked) {
                    this._mask.ZIndex = 0;
                    this._mask.Opacity = 0.4;
                } else {
                    this._mask.ZIndex = -1;
                    this._mask.Opacity = 0.0;
                }
            }
        }

        public Dispose(): void {
            super.Dispose();

            this._dom = null;
            this._size.Dispose();
            this._size = null;
        }
    }
}
