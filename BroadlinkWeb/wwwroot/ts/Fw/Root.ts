/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />
/// <reference path="Events/RootEvents.ts" />
/// <reference path="Util/Dump.ts" />
/// <reference path="Views/Property/Size.ts" />

namespace Fw {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.RootEvents;
    import Property = Fw.Views.Property;

    export class Root extends ObjectBase {
        private static _instance: Root = null;
        public static get Instance(): Root {
            if (!Root._instance)
                throw new Error('Root.Init() has not been executed.');

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

        private _isDragging: boolean = false;
        private _dragStartMousePosition: Property.Position;

        private constructor(jqueryElem: JQuery) {
            super();

            this.SetElem(jqueryElem);
            this.SetClassName('Root');

            this._size = new Property.Size();
            this._dom = jqueryElem.get(0) as HTMLElement;
            this._dragStartMousePosition = new Property.Position();

            const $window = $(window);
            $window.on('resize', () => {
                this.Refresh();
                this.DispatchEvent(Events.Resized);
            });

            this.Refresh();
        }

        public Refresh(): void {
            // this.Sizeのセッターが無いので、フィールドに直接書き込む。
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();
        }

        public Dispose(): void {
            super.Dispose();

            this._dom = null;
            this._size.Dispose();
            this._size = null;
        }
    }
}