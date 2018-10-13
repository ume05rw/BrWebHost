﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="./BoxView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.BoxViewEvents;
    import Number = Fw.Util.Number;

    export class LineView extends ViewBase {

        private _direction: Property.Direction;
        public get Direction(): Property.Direction {
            return this._direction;
        }

        private _length: number;
        public get Length(): number {
            return this._length;
        }
        public set Length(value: number) {
            this._length = value;
            this.Refresh();
        }

        public get BackgroundColor(): string {
            throw new Error('Not supported');
        }
        public set BackgroundColor(value: string) {
            throw new Error('Not supported');
        }

        constructor(direction: Property.Direction) {
            super($('<div></div>'));

            // nullやundefinedを入れさせない。
            this._direction = (direction === Property.Direction.Horizontal)
                ? Property.Direction.Horizontal
                : Property.Direction.Vertical;

            this.SetClassName('LineView');
            this.Elem.addClass(this.ClassName);

            this._length = 0;
        }

        protected InnerRefresh(): void {
            try {
                //Dump.Log(`${this.ClassName}.InnerRefresh`);
                this.SuppressLayout();

                if (this.Direction === Property.Direction.Horizontal) {
                    //Dump.Log(`${this.ClassName}.Direction = ${this.Direction}`);
                    this.Size.Height = 2;
                    this.Size.Width = this.Length;
                } else {
                    //Dump.Log(`${this.ClassName}.Direction = ${this.Direction}`);
                    this.Size.Width = 2;
                    this.Size.Height = this.Length;
                }

                super.InnerRefresh();
                this.Dom.style.borderWidth = '0';
                this.Dom.style.backgroundColor = `${this.Color}`;

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
        }
    }


}