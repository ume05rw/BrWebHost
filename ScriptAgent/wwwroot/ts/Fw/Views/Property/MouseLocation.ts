/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="Position.ts" />

namespace Fw.Views.Property {
    import Position = Fw.Views.Property.Position;

    export class MouseLocation {

        public static Create(e: JQueryEventObject): MouseLocation {
            return new MouseLocation(e);
        }

        public static GetPosition(e: JQueryEventObject): Position {
            const loc = new MouseLocation(e);
            const result = new Position();
            result.X = loc.ClientX;
            result.Y = loc.ClientY;

            return result;
        }


        public readonly PageX: number;
        public readonly PageY: number;
        public readonly ClientX: number;
        public readonly ClientY: number;
        public readonly OffsetX: number;
        public readonly OffsetY: number;
        public readonly ScreenX: number;
        public readonly ScreenY: number;

        private constructor(e: JQueryEventObject) {

            if (e.pageX === undefined) {
                // イベントパラメータから取得できないとき
                // タッチイベントの座標取得を試みる。
                try {
                    let ct = (event as any).changedTouches[0];
                    this.PageX = ct.pageX;
                    this.PageY = ct.pageY;
                    this.ClientX = ct.clientX;
                    this.ClientY = ct.clientY;
                    this.OffsetX = ct.offsetX;
                    this.OffsetY = ct.offsetY;
                    this.ScreenX = ct.screenX;
                    this.ScreenY = ct.screenY;
                } catch (e) {
                    // イベント引数もタッチイベントもダメなとき、例外 //全てnull
                    throw new Error('Cannot find location');
                    //this.PageX = null;
                    //this.PageY = null;
                    //this.ClientX = null;
                    //this.ClientY = null;
                    //this.OffsetX = null;
                    //this.OffsetY = null;
                    //this.ScreenX = null;
                    //this.ScreenY = null;
                }
            } else {
                // イベントパラメータから取得できたとき
                this.PageX = e.pageX;
                this.PageY = e.pageY;
                this.ClientX = e.clientX;
                this.ClientY = e.clientY;
                this.OffsetX = e.offsetX;
                this.OffsetY = e.offsetY;
                this.ScreenX = e.screenX;
                this.ScreenY = e.screenY;
            }
        }
    }
}
