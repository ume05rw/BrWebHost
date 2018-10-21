/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Num.ts" />
/// <reference path="./BoxView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class ControlView extends BoxView {
        // properties
        private _label: JQuery;
        private _clickEventTimer: number = null;
        private _cvMouseSuppressor = false;

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

            // touch系イベントはmouse系と重複して発生するため、リッスンしない。
            this.Elem.on('mousedown', (e) => {
                this.Log(`mousedown`);
                if (this._clickEventTimer != null)
                    clearTimeout(this._clickEventTimer);

                this._clickEventTimer = setTimeout(() => {
                    // ロングタップイベント
                    this._clickEventTimer = null;

                    // Pageのドラッグ処理中のとき、クリックイベントを抑制する。
                    if (this._cvMouseSuppressor)
                        return;

                    this.Log('longtapped');
                    this.DispatchEvent(Events.LongClick);
                }, 1000);
            });

            this.Elem.on('mouseup', (e) => {
                this.Log(`mouseup`);
                if (this._clickEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._clickEventTimer);
                    this._clickEventTimer = null;

                    // Pageのドラッグ処理中のとき、クリックイベントを抑制する。
                    if (this._cvMouseSuppressor)
                        return;

                    // 以降、シングルタップイベント処理
                    this.Log('singletapped');
                    this.DispatchEvent(Events.SingleClick);
                } else {
                }
            });

            this.Elem.on('mouseout', (e) => {
                if (this._clickEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._clickEventTimer);
                    this._clickEventTimer = null;
                    this.Log('tap canceled');
                }
            });
        }

        public Dispose(): void {
            super.Dispose();

            this._label = null;
            this._clickEventTimer = null;
            this._cvMouseSuppressor = null;
        }
    }
}
