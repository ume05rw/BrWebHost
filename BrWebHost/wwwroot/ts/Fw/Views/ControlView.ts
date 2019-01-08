/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Num.ts" />
/// <reference path="./BoxView.ts" />
/// <reference path="Property/MouseLocation.ts" />
/// <reference path="Property/Position.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;
    import MouseLocation = Fw.Views.Property.MouseLocation;
    import Position = Fw.Views.Property.Position;

    export class ControlView extends BoxView {
        // properties
        private _label: JQuery;
        private _clickEventTimer: number = null;
        private _cvMouseStartPosition: Property.Position = new Property.Position();
        private _cvMouseLatestPosition: Property.Position = new Property.Position();

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
                //this.Log(`mousedown`);

                if (this._clickEventTimer != null)
                    clearTimeout(this._clickEventTimer);

                this._cvMouseStartPosition = MouseLocation.GetPosition(e);
                this._cvMouseLatestPosition = MouseLocation.GetPosition(e);

                this._clickEventTimer = setTimeout(() => {
                    this._clickEventTimer = null;

                    // マウス位置が動いてないなら、ロングタップとする。
                    if (Position.Distance(this._cvMouseStartPosition, this._cvMouseLatestPosition) < 15) {
                        // ロングタップイベント
                        Dump.Log('longtapped');
                        this.DispatchEvent(Events.LongClick);
                    }
                }, 1000);
            });

            this.Elem.on('mousemove', (e) => {
                //this.Log(`mousemove`);
                this._cvMouseLatestPosition = MouseLocation.GetPosition(e);
            });

            this.Elem.on('mouseup', (e) => {
                //this.Log(`mouseup`);

                this._cvMouseLatestPosition = MouseLocation.GetPosition(e);

                if (this._clickEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._clickEventTimer);
                    this._clickEventTimer = null;

                    // マウス位置が動いてないなら、シングルタップとする。
                    if (Position.Distance(this._cvMouseStartPosition, this._cvMouseLatestPosition) < 15) {
                        // シングルタップイベント処理
                        this.Log('singletapped');
                        this.DispatchEvent(Events.SingleClick);
                    }
                }
            });

            this.Elem.on('mouseout', (e) => {
                if (this._clickEventTimer != null) {
                    // ロングタップ検出中のとき
                    clearTimeout(this._clickEventTimer);
                    this._clickEventTimer = null;
                    //this.Log('tap canceled');
                }
            });
        }

        public SetAnimatedJello(): void {
            this.SetAnimatedClass('jello');
        }
        public SetAnimatedPulse(): void {
            this.SetAnimatedClass('pulse faster');
        }

        public Dispose(): void {
            super.Dispose();

            this._label = null;
            this._clickEventTimer = null;
        }
    }
}
