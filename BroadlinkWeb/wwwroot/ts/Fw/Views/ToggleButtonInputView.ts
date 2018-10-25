/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ToggleButtonInputViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="ControlView.ts" />
/// <reference path="IInputView.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ToggleButtonInputViewEvents;

    export class ToggleButtonInputView extends ControlView implements IInputView {

        public HoverColor: string = '';

        private _name: string;
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;
        }

        private _boolValue: boolean;
        public get BoolValue(): boolean {
            return (this._boolValue === true);
        }
        public set BoolValue(value: boolean) {
            this.SetValue(value === true ? 'true' : 'false');
        }

        public get Value(): string {
            return (this.BoolValue)
                ? 'true'
                : 'false';
        }
        public set Value(value: string) {
            this.SetValue(value);
        }

        public SetValue(value: string, eventDispatch: boolean = true): void {
            const changed = (this._boolValue !== (value === 'true'));
            this._boolValue = (value === 'true');
            this.Refresh();

            if (changed && eventDispatch) {
                this.DispatchEvent(Events.Changed, this.Value);
            }
        }

        private _overMargin: number;
        private _sliderBox: BoxView;
        private _notch: BoxView;
        private _maskOn: BoxView;

        constructor() {
            super();

            this._sliderBox = new BoxView();
            this._notch = new BoxView();
            this._maskOn = new BoxView();

            this._boolValue = false;
            this._overMargin = 5;

            this.SetClassName('ToggleButtonView');
            this.Elem.addClass(this.ClassName);

            // 標準サイズ：50 x 20
            const width = 50;
            const height = 20;
            this.HasBorder = false;
            this.SetSize(width, height);

            this._sliderBox.Size.Width = this.Size.Width - this._overMargin;
            this._sliderBox.Size.Height = this.Size.Height - this._overMargin;
            this._sliderBox.HasBorder = true;
            this._sliderBox.BorderRadius = 15;
            this._sliderBox.Color = '#e5e5e5';
            this._sliderBox.BackgroundColor = '#FFFFFF';
            this._sliderBox.Dom.style.overflow = 'hidden';
            this.Add(this._sliderBox);

            this._maskOn.Size.Width = this.Size.Width - this._overMargin;
            this._maskOn.Size.Height = this.Size.Height - this._overMargin;
            this._maskOn.HasBorder = false;
            this._maskOn.BorderRadius = 15;
            this._maskOn.BackgroundColor = '#4e748b';
            this._maskOn.Position.X = - (this.Size.Width - this._overMargin);
            this._sliderBox.Add(this._maskOn);

            this._notch.SetSize(this.Size.Height, this.Size.Height);
            this._notch.HasBorder = true;
            this._notch.BorderRadius = 50;
            this._notch.Color = '#e5e5e5';
            this._notch.BackgroundColor = '#cfcfcf';
            this._notch.Position.X = - (this.Size.Width / 2) + (this.Size.Height / 2);
            this.Add(this._notch);

            this.Elem.hover(() => {
                this.SetStyle('backgroundColor', this.HoverColor);
                this.Refresh();
            }, () => {
                this.SetStyle('backgroundColor', this.BackgroundColor);
                this.Refresh();
            });

            this.AddEventListener(Events.SingleClick, (e) => {
                //this.Log(`${this.ClassName}.SingleClick`);
                this.BoolValue = !this.BoolValue;
                this.Refresh();
            });
        }

        public CalcLayout(): void {
            try {
                this.SuppressLayout();
                this._sliderBox.SuppressLayout();
                this._maskOn.SuppressLayout();
                this._notch.SuppressLayout();

                this._sliderBox.Size.Width = this.Size.Width - this._overMargin;
                this._sliderBox.Size.Height = this.Size.Height - this._overMargin;
                this._maskOn.Size.Width = this.Size.Width - this._overMargin;
                this._maskOn.Size.Height = this.Size.Height - this._overMargin;
                this._notch.SetSize(this.Size.Height, this.Size.Height);

                this._notch.Position.X = (this.BoolValue)
                    ? (this.Size.Width / 2) - (this.Size.Height / 2)
                    : - (this.Size.Width / 2) + (this.Size.Height / 2);

                this._maskOn.Position.X = (this.BoolValue)
                    ? 0
                    : - (this.Size.Width - this._overMargin);

                super.CalcLayout();

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
                this._sliderBox.ResumeLayout();
                this._maskOn.ResumeLayout();
                this._notch.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
            this.HoverColor = null;
        }
    }
}
