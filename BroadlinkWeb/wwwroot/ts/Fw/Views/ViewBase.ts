/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Views {
    export abstract class ViewBase implements IView {
        // Refresh() Multiple execution suppressor
        private _lastRefreshTimer: number;

        // Properties
        public Elem: JQuery;
        public Children: Array<IView>;

        // Properties with set/get
        private _x: number;
        public get X(): number {
            return this._x;
        }
        public set X(value: number) {
            this._x = value;
            this.Refresh();
        }

        private _y: number;
        public get Y(): number {
            return this._y;
        }
        public set Y(value: number) {
            this._y = value;
            this.Refresh();
        }

        private _width: number;
        public get Width(): number {
            return this._width;
        }
        public set Width(value: number) {
            this._width = value;
            this.Refresh();
        }

        private _height: number;
        public get Height(): number {
            return this._height;
        }
        public set Heght(value: number) {
            this._height = value;
            this.Refresh();
        }

        private _color: string;
        public get Color(): string {
            return this._color;
        }
        public set Color(value: string) {
            this._color = value;
            this.Refresh();
        }


        constructor(jqueryElem: JQuery) {
            this.Children = new Array<IView>();
            this.Elem = jqueryElem;
            this.Elem.addClass('IView');
        }

        protected Init(): void {
        }

        public SetDisplayParams(
            x: number,
            y: number,
            width?: number,
            height?: number,
            color?: string
        ): void {
            if (x != undefined && x != null)
                this._x = x;
            if (y != undefined && y != null)
                this._y = y;
            if (width != undefined && width != null)
                this._width = width;
            if (height != undefined && height != null)
                this._height = height;
            if (color != undefined && color != null)
                this._color = color;

            this.Refresh();
        }

        public Add(view: IView): void {
            if (this.Children.indexOf(view) == -1) {
                this.Children.push(view);
                this.Elem.append(view.Elem);
                view.Refresh();
            }
        }

        public Remove(view: IView): void {
            const index = this.Children.indexOf(view);
            if (index != -1) {
                this.Children.splice(index, 1);
                view.Elem.detach();
            }
        }

        public Refresh(): void {
            if (this._lastRefreshTimer != null) {
                clearTimeout(this._lastRefreshTimer);
                this._lastRefreshTimer = null;
            }

            this._lastRefreshTimer = setTimeout(() => {
                this.InnerRefresh();
            }, 10);
        }

        protected InnerRefresh(): void {
            const parent = $(this.Elem.parent());

            if (!parent)
                return;

            const centerX = (parent.width() / 2);
            const centerY = (parent.height() / 2);
            const dom = this.Elem.get(0) as HTMLElement;
            dom.style.left = `${(centerX + this._x)}px`;
            dom.style.top = `${(centerY + this._y)}px`;
            dom.style.width = `${this._width}px`;
            dom.style.height = `${this._height}px`;
            dom.style.color = `#${this._color}`;
        }

        public Dispose(): void {
            _.each(this.Children, (view) => {
                view.Dispose();
            });
            this.Children = null;

            this.Elem.remove();
            this.Elem = null;
        }
    }
}