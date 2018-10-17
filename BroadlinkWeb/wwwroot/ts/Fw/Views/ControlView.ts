/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="./BoxView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Number = Fw.Util.Number;

    export class ControlView extends BoxView {
        // properties
        private _label: JQuery;
        private _clickEventTimer: number = null;
        private _cvMouseSuppressor = false;
        private _cvDelayedResumeEventsTimer: number = null;

        public get Text(): string {
            return this._label.html();
        }
        public set Text(value: string) {
            this._label.html(value);
            this.Refresh();
        }

        constructor() {
            super();

            this._label = $('<span class="ControlViewProperty"></span>');

            this.SetClassName('ControlView');
            this.Elem.addClass(this.ClassName);

            // プロパティsetterを一度通しておく。
            this.HasBorder = true;
            this.BorderRadius = 5;
            this.Elem.append(this._label);

            this.Elem.on('touchstart mousedown', (e) => {
                if (this._clickEventTimer != null)
                    clearTimeout(this._clickEventTimer);

                this._clickEventTimer = setTimeout(() => {
                    // ロングタップイベント
                    this._clickEventTimer = null;

                    // Pageのドラッグ処理中のとき、クリックイベントを抑制する。
                    if (this._cvMouseSuppressor)
                        return;

                    //Dump.Log('longtapped');
                    this.DispatchEvent(Events.LongClick);
                }, 1000);
            });
            this.Elem.on('touchend mouseup', (e) => {
                if (this._clickEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._clickEventTimer);
                    this._clickEventTimer = null;

                    // Pageのドラッグ処理中のとき、クリックイベントを抑制する。
                    if (this._cvMouseSuppressor)
                        return;

                    // 以降、シングルタップイベント処理
                    //Dump.Log('singletapped');
                    this.DispatchEvent(Events.SingleClick);
                } else {
                }
            });
            this.Elem.on('mouseout', (e) => {
                if (this._clickEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._clickEventTimer);
                    this._clickEventTimer = null;
                    //Dump.Log('tap canceled');
                }
            });
        }

        protected InitPage(): void {
            if (this.Page) {
                this.RemoveEventListener(Fw.Events.PageViewEvents.Dragging, this.OnPageDragging);
            }

            super.InitPage();

            if (this.Page) {
                this.AddEventListener(Fw.Events.PageViewEvents.Dragging, this.OnPageDragging);
            }
        }

        private OnPageDragging(): void {
            this._cvMouseSuppressor = true;

            if (this._cvDelayedResumeEventsTimer !== null) {
                clearTimeout(this._cvDelayedResumeEventsTimer);
                this._cvDelayedResumeEventsTimer = null;
            }

            this._cvDelayedResumeEventsTimer = setTimeout(() => {
                //Dump.Log('ResumeMouseEvents');
                this._cvMouseSuppressor = false;
            }, 100);
        }

        public Dispose(): void {
            super.Dispose();

            this._label = null;
            this._clickEventTimer = null;
            this._cvMouseSuppressor = null;
            this._cvDelayedResumeEventsTimer = null;
        }
    }
}