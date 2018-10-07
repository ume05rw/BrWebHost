/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />
/// <reference path="./ViewBase.ts" />

namespace Fw.Views {
    import Events = Fw.Events.ControlEvents;
    export class ControlView extends ViewBase {
        // events
        protected EventSingleClick: Event = new Event(Events.SingleClick);
        protected EventLongClick: Event = new Event(Events.LongClick);

        // properties
        private _label: JQuery;
        private _tapEventTimer: number = null;

        public get Label(): string {
            return this._label.html();
        }
        public set Label(value: string) {
            this._label.html(value);
            this.Refresh();
        }

        private _hasBorder: boolean;
        public get HasBorder(): boolean {
            return this._hasBorder;
        }
        public set HasBorder(value: boolean) {
            this.Dom.style.borderWidth = (value)
                ? '1px'
                : '0';
        }

        private _borderRadius: number;
        public get BorderRadius(): number {
            return this._borderRadius;
        }
        public set BorderRadius(value: number) {
            if (isNaN(value) || value === null || value === undefined)
                value = 0;

            if (value < 0)
                value = 0;
            if (value > 50)
                value = 50;

            this._borderRadius = value;

            this.Dom.style.borderRadius = `${this._borderRadius}%`;
        }

        constructor() {
            super($('<div></div>'));
            this.Init();
        }

        /**
         * @description Initialize
         */
        protected Init(): void {
            super.Init();

            // プロパティsetterを一度通しておく。
            this.HasBorder = true;
            this.BorderRadius = 5;

            this.Elem.addClass('ControlView');
            this._label = $('<span></span>');
            this.Elem.append(this._label);

            this.Elem.bind('touchstart mousedown', (e) => {
                if (this._tapEventTimer != null)
                    clearTimeout(this._tapEventTimer);

                this._tapEventTimer = setTimeout(() => {
                    // ロングタップイベント
                    this._tapEventTimer = null;
                    //console.log('longtapped');
                    this.Dom.dispatchEvent(this.EventLongClick);
                }, 1000);

                e.preventDefault();
            });
            this.Elem.bind('touchend mouseup', (e) => {
                if (this._tapEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._tapEventTimer);
                    this._tapEventTimer = null;

                    // 以降、シングルタップイベント処理
                    //console.log('singletapped');
                    this.Dom.dispatchEvent(this.EventSingleClick);
                } else {
                }
                e.preventDefault();
            });
            this.Elem.bind('mouseout', (e) => {
                if (this._tapEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._tapEventTimer);
                    this._tapEventTimer = null;

                    //console.log('tap canceled');
                }
                e.preventDefault();
            });
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();
            this.Dom.style.borderColor = `#${this.Color}`;
        }

        public Dispose(): void {
            this.EventSingleClick = null;
            this.EventLongClick = null;
            this._label = null;
            this._tapEventTimer = null;

            super.Dispose();
        }
    }
}