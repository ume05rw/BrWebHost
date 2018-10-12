/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ControlViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Number.ts" />
/// <reference path="ControlView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ControlViewEvents;

    export class ToggleButtonView extends ControlView {

        public HoverColor: string = '';

        private _value: boolean = false;
        public get Value(): boolean {
            return this._value;
        }
        public set Value(value: boolean) {
            const changed = (this._value !== value);

            if (changed) {
                this._value = !this._value;

                (this._value)
                    ? this.SwitchToOn()
                    : this.SwitchToOff();
            }
        }

        private _overMargin: number;
        private _sliderBox: BoxView;
        private _notch: BoxView;
        private _maskOn: BoxView;

        protected Init(): void {
            super.Init();

            this._value = false;
            this._overMargin = 5;

            this.SetClassName('ToggleButtonView');
            this.Elem.addClass(this.ClassName);

            // 標準サイズ：50 x 20
            const width = 50;
            const height = 20;
            this.HasBorder = false;
            this.SetSize(width, height);

            this._sliderBox = new BoxView();
            this._sliderBox.Size.Width = this.Size.Width - this._overMargin;
            this._sliderBox.Size.Height = this.Size.Height - this._overMargin;
            this._sliderBox.HasBorder = true;
            this._sliderBox.BorderRadius = 15;
            this._sliderBox.Color = '#e5e5e5';
            this._sliderBox.BackgroundColor = '#FFFFFF';
            this._sliderBox.Dom.style.overflow = 'hidden';
            this.Add(this._sliderBox);

            this._maskOn = new BoxView();
            this._maskOn.Size.Width = this.Size.Width - this._overMargin;
            this._maskOn.Size.Height = this.Size.Height - this._overMargin;
            this._maskOn.HasBorder = false;
            this._maskOn.BorderRadius = 15;
            this._maskOn.BackgroundColor = '#4e748b';
            this._maskOn.Position.X = - (this.Size.Width - this._overMargin);
            this._sliderBox.Add(this._maskOn);

            this._notch = new BoxView();
            this._notch.SetSize(this.Size.Height, this.Size.Height);
            this._notch.HasBorder = true;
            this._notch.BorderRadius = 50;
            this._notch.Color = '#e5e5e5';
            this._notch.BackgroundColor = '#cfcfcf';
            this._notch.Position.X = - (this.Size.Width / 2) + (this.Size.Height / 2);
            this.Add(this._notch);

            this.Elem.hover(() => {
                this.Dom.style.backgroundColor = this.HoverColor;
            }, () => {
                this.Dom.style.backgroundColor = this.BackgroundColor;
            });

            this.AddEventListener(Events.SingleClick, () => {
                this._value = !this._value;
                this.Refresh();
            });

        }

        private SwitchToOn(): void {
        }

        private SwitchToOff(): void {
        }

        protected InnerRefresh(): void {
            try {
                this.SuppressLayout();

                this._sliderBox.Size.Width = this.Size.Width - this._overMargin;
                this._sliderBox.Size.Height = this.Size.Height - this._overMargin;
                this._maskOn.Size.Width = this.Size.Width - this._overMargin;
                this._maskOn.Size.Height = this.Size.Height - this._overMargin;
                this._notch.SetSize(this.Size.Height, this.Size.Height);

                this._notch.Position.X = (this.Value)
                    ? (this.Size.Width / 2) - (this.Size.Height / 2)
                    : - (this.Size.Width / 2) + (this.Size.Height / 2);

                this._maskOn.Position.X = (this.Value)
                    ? 0
                    : - (this.Size.Width - this._overMargin);

                super.InnerRefresh();

            } catch (e) {
                Dump.ErrorLog(e);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
            this.HoverColor = null;
        }
    }
}