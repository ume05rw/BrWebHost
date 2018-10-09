﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="./ViewBase.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import Number = Fw.Util.Number;

    export class ControlView extends ViewBase {
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
            if (Number.IsNaN(value) || value === null || value === undefined)
                value = 0;

            if (value < 0)
                value = 0;
            if (value > 50)
                value = 50;

            this._borderRadius = value;

            this.Dom.style.borderRadius = `${this._borderRadius}%`;
        }

        constructor() {
            super($('<a></a>'));
            
        }

        /**
         * @description Initialize
         */
        protected Init(): void {
            super.Init();

            this.SetClassName('ControlView');
            this.Elem.addClass(this.ClassName);

            // プロパティsetterを一度通しておく。
            this.HasBorder = true;
            this.BorderRadius = 5;

            this._label = $('<span class="ControlViewProperty"></span>');
            this.Elem.append(this._label);

            this.Elem.on('touchstart mousedown', (e) => {
                if (this._tapEventTimer != null)
                    clearTimeout(this._tapEventTimer);

                this._tapEventTimer = setTimeout(() => {
                    // ロングタップイベント
                    this._tapEventTimer = null;
                    //Dump.Log('longtapped');
                    this.DispatchEvent(Events.LongClick);
                }, 1000);

                e.preventDefault();
            });
            this.Elem.on('touchend mouseup', (e) => {
                if (this._tapEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._tapEventTimer);
                    this._tapEventTimer = null;

                    // 以降、シングルタップイベント処理
                    //Dump.Log('singletapped');
                    this.DispatchEvent(Events.SingleClick);
                } else {
                }
                e.preventDefault();
            });
            this.Elem.on('mouseout', (e) => {
                if (this._tapEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._tapEventTimer);
                    this._tapEventTimer = null;

                    //Dump.Log('tap canceled');
                }
                e.preventDefault();
            });
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();
            this.Dom.style.borderColor = `${this.Color}`;
        }

        public Dispose(): void {
            super.Dispose();

            this._label = null;
            this._tapEventTimer = null;
            this._hasBorder = null;
            this._borderRadius = null;
        }
    }
}