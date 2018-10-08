/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ViewEvents.ts" />
/// <reference path="../../Fw/Util/Number.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ViewEvents;
    import Number = Fw.Util.Number;

    export class Anchor {
        private _view: IView = null;

        private _isAnchoredTop: boolean = false;
        public get IsAnchoredTop(): boolean {
            return this._isAnchoredTop;
        }
        public set IsAnchoredTop(value: boolean) {
            // null, undefinedは例外
            if (value === undefined || value === null)
                throw new Error("value type not allowed");

            const changed = (this._isAnchoredTop !== value);
            this._isAnchoredTop = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _marginTop: number = 0;
        public get MarginTop(): number {
            return this._marginTop;
        }
        public set MarginTop(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._marginTop !== value);
            this._marginTop = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _isAnchoredLeft: boolean = false;
        public get IsAnchoredLeft(): boolean {
            return this._isAnchoredLeft;
        }
        public set IsAnchoredLeft(value: boolean) {
            // null, undefinedは例外
            if (value === undefined || value === null)
                throw new Error("value type not allowed");

            const changed = (this._isAnchoredLeft !== value);
            this._isAnchoredLeft = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _marginLeft: number = 0;
        public get MarginLeft(): number {
            return this._marginLeft;
        }
        public set MarginLeft(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._marginLeft !== value);
            this._marginLeft = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _isAnchoredRight: boolean = false;
        public get IsAnchoredRight(): boolean {
            return this._isAnchoredRight;
        }
        public set IsAnchoredRight(value: boolean) {
            // null, undefinedは例外
            if (value === undefined || value === null)
                throw new Error("value type not allowed");

            const changed = (this._isAnchoredRight !== value);
            this._isAnchoredRight = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _marginRight: number = 0;
        public get MarginRight(): number {
            return this._marginRight;
        }
        public set MarginRight(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._marginRight !== value);
            this._marginRight = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _isAnchoredBottom: boolean = false;
        public get IsAnchoredBottom(): boolean {
            return this._isAnchoredBottom;
        }
        public set IsAnchoredBottom(value: boolean) {
            // null, undefinedは例外
            if (value === undefined || value === null)
                throw new Error("value type not allowed");

            const changed = (this._isAnchoredBottom !== value);
            this._isAnchoredBottom = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        private _marginBottom: number = 0;
        public get MarginBottom(): number {
            return this._marginBottom;
        }
        public set MarginBottom(value: number) {
            // nullは許可、その他は例外
            if (Number.IsNaN(value) || value === undefined)
                throw new Error("value type not allowed");

            const changed = (this._marginBottom !== value);
            this._marginBottom = value;

            if (changed && this._view)
                this._view.DispatchEvent(Events.AnchorChanged);
        }

        constructor(view: IView = null) {
            this._view = view;
        }

        public Dispose(): void {
            this._view = null;
            this._isAnchoredTop = null;
            this._isAnchoredLeft = null;
            this._isAnchoredRight = null;
            this._isAnchoredBottom = null;

            this._marginTop = null;
            this._marginLeft = null;
            this._marginRight = null;
            this._marginBottom = null;
        }
    }
}