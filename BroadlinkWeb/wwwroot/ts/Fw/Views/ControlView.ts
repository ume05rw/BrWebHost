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

        constructor() {
            super($('<div></div>'));
            this.Init();
        }

        protected Init(): void {
            super.Init();

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