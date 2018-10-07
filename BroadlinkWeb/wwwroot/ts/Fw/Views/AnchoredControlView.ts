/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ControlView.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ControlEvents;
    export class AnchoredControlView extends ControlView {

        // Disabled Properties
        public get X(): number {
            const parent = $(this.Elem.parent());

            if (!parent)
                return null;

            const centerLeft = (parent.width() / 2);
            const centerTop = (parent.height() / 2);
            const offset = this.Elem.offset();
            const elemCenterLeft = offset.left + (this.Width / 2);
            const elemCenterTop = offset.top + (this.Height / 2);
            const elemX = elemCenterLeft - centerLeft;
            const elemY = elemCenterTop - centerTop;

            return elemX;
        }
        public set X(value: number) {
            throw new Error('Not Supported');
        }
        public get Y(): number {
            const parent = $(this.Elem.parent());

            if (!parent)
                return null;

            const centerLeft = (parent.width() / 2);
            const centerTop = (parent.height() / 2);
            const offset = this.Elem.offset();
            const elemCenterLeft = offset.left + (this.Width / 2);
            const elemCenterTop = offset.top + (this.Height / 2);
            const elemX = elemCenterLeft - centerLeft;
            const elemY = elemCenterTop - centerTop;

            return elemY;
        }
        public set Y(value: number) {
            throw new Error('Not Supported');
        }

        private _ancWidth: number = null;
        public get Width(): number {
            return this.Elem.width();
        }
        public set Width(value: number) {
            this._ancWidth = value;
            this.Refresh();
        }

        private _ancHeight: number = null;
        public get Height(): number {
            return this.Elem.height();
        }
        public set Height(value: number) {
            this._ancHeight = value;
            this.Refresh();
        }

        private _isAnchorTop: boolean = false;
        public get IsAnchorTop(): boolean {
            return this._isAnchorTop;
        }
        public set IsAnchorTop(value: boolean) {
            this._isAnchorTop = value;
            this.Refresh();
        }

        private _isAnchorLeft: boolean = false;
        public get IsAnchorLeft(): boolean {
            return this._isAnchorLeft;
        }
        public set IsAnchorLeft(value: boolean) {
            this._isAnchorLeft = value;
            this.Refresh();
        }

        private _isAnchorRight: boolean = false;
        public get IsAnchorRight(): boolean {
            return this._isAnchorRight;
        }
        public set IsAnchorRight(value: boolean) {
            this._isAnchorRight = value;
            this.Refresh();
        }

        private _isAnchorBottom: boolean = false;
        public get IsAnchorBottom(): boolean {
            return this._isAnchorBottom;
        }
        public set IsAnchorBottom(value: boolean) {
            this._isAnchorBottom = value;
            this.Refresh();
        }

        private _anchorMarginTop: number = 0;
        public get AnchorMarginTop(): number {
            return this._anchorMarginTop;
        }
        public set AnchorMarginTop(value: number) {
            this._anchorMarginTop = value;
            this.Refresh();
        }

        private _anchorMarginLeft: number = 0;
        public get AnchorMarginLeft(): number {
            return this._anchorMarginLeft;
        }
        public set AnchorMarginLeft(value: number) {
            this._anchorMarginLeft = value;
            this.Refresh();
        }

        private _anchorMarginRight: number = 0;
        public get AnchorMarginRight(): number {
            return this._anchorMarginRight;
        }
        public set AnchorMarginRight(value: number) {
            this._anchorMarginRight = value;
            this.Refresh();
        }

        private _anchorMarginBottom: number = 0;
        public get AnchorMarginBottom(): number {
            return this._anchorMarginBottom;
        }
        public set AnchorMarginBottom(value: number) {
            this._anchorMarginBottom = value;
            this.Refresh();
        }

        protected Init(): void {
            super.Init();

            this.Elem.addClass('AnchoredControlView');
        }


        protected InnerRefresh(): void {
            const parent = $(this.Elem.parent());

            if (!parent)
                return;

            const parentWidth = parent.width();
            const parentHeight = parent.height();
            const centerLeft = (parentWidth / 2);
            const centerTop = (parentHeight / 2);

            let width: number, height: number;
            let left: number, top: number;

            if (this.IsAnchorLeft && this.IsAnchorRight) {
                width = parentWidth - this.AnchorMarginLeft - this.AnchorMarginRight;
                left = this.AnchorMarginLeft;
            } else {
                width = _.isNumber(this._ancWidth)
                    ? this._ancWidth
                    : 10;

                if (this.IsAnchorLeft) {
                    left = this.AnchorMarginLeft;
                } else if (this.IsAnchorRight) {
                    left = parentWidth - this.AnchorMarginRight - width;
                } else {
                    left = centerLeft - (width / 2);
                }
            }

            if (this.IsAnchorTop && this._isAnchorBottom) {
                height = parentHeight - this.AnchorMarginTop - this.AnchorMarginBottom;
                top = this.AnchorMarginTop;
            } else {
                height = _.isNumber(this._ancHeight)
                    ? this._ancHeight
                    : 10;

                if (this.IsAnchorTop) {
                    top = this.AnchorMarginTop;
                } else if (this.IsAnchorBottom) {
                    top = parentHeight - this.AnchorMarginBottom - height;
                } else {
                    top = centerTop - (height / 2);
                }
            }

            this.Dom.style.left = `${left}px`;
            this.Dom.style.top = `${top}px`;
            this.Dom.style.width = `${width}px`;
            this.Dom.style.height = `${height}px`;
            this.Dom.style.borderColor = `#${this.Color}`;
            this.Dom.style.color = `#${this.Color}`;
            this.Dom.style.backgroundColor = `#${this.BackgroundColor}`;
        }
    }
}