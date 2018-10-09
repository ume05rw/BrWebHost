/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="Property/Size.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;

    export class Root {
        private static _instance: Root = null;
        public static get Instance(): Root {
            if (!Root._instance)
                throw new Error('Root.Init() has not been executed.');

            return Root._instance;
        }
        public static Init(selectorString: string): void {
            Root._instance = new Root($(selectorString));
        }


        public Elem: JQuery;
        public readonly Dom: HTMLElement;
        public ClassName: string;

        private _size: Property.Size;
        public get Size(): Property.Size {
            return this._size;
        }

        private constructor(jqueryElem: JQuery) {
            this.Elem = jqueryElem;
            this.Dom = jqueryElem.get(0) as HTMLElement;
            this.ClassName = 'Root';
            this._size = new Property.Size();
            this.Refresh();

            $(window).resize(() => {
                this.Refresh();
            });
        }

        public Refresh(): void {
            // this.Sizeのセッターが無いので、フィールドに直接書き込む。
            this._size.Width = this.Elem.width();
            this._size.Height = this.Elem.height();
        }
    }
}