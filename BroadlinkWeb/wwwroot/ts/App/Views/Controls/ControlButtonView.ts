/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/RelocatableButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="LabeledButtonView.ts" />


namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import Events = App.Events.Controls.ControlButtonViewEvents;
    import EntityEvents = Fw.Events.EntityEvents;

    export class ControlButtonView extends Views.RelocatableButtonView {

        private _name: string;
        public get Name(): string {
            return this._name;
        }
        public set Name(value: string) {
            this._name = value;

            if (this.ImageSrc === '')
                this.Text = value;
        }
        public Code: string;

        private _control: App.Models.Entities.Control;
        public get Control(): App.Models.Entities.Control {
            return this._control;
        }
        public set Control(value: App.Models.Entities.Control) {
            if (this._control) {
                this._control.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._control = value;

            if (this._control) {
                this._control.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this.ApplyFromEntity();
        }

        constructor() {
            super();

            this.SetSize(70, 75);
            this.GridSize = 90;
            this.Margin = 5;
            this.Position.Policy = Property.PositionPolicy.LeftTop;
            this.HasBorder = true;
            this.BorderRadius = 10;
            this.BackgroundColor = Color.MainBackground;
            this.HoverColor = Color.ButtonHoverColors[0];
            this.Color = Color.ButtonColors[0];
            this.ImageFitPolicy = Property.FitPolicy.Auto;
            this.Code = '';
            this._name = '';

            this.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, (e) => {
                this.OnSingleClicked(e);
            });

            this.AddEventListener(Events.PositionChanged, () => {
                if (this._control) {
                    this._control.PositionLeft = this.Position.Left;
                    this._control.PositionTop = this.Position.Top;
                }
            });
        }

        private OnSingleClicked(e: JQueryEventObject): void {
            if (this.IsRelocatable) {
                // 編集モードのとき
                this.Log('Edit');
                this.DispatchEvent(Events.EditOrdered);
            } else {
                // 実行モードのとき
                this.Log('Exec');
                this.DispatchEvent(Events.ExecOrdered, this.Code);
            }
        }

        private ApplyFromEntity(): void {
            if (!this._control)
                return;

            this.Name = this._control.Name;
            this.Code = this._control.Code;
            this.SetImage(this._control.IconUrl);
            this.SetColor(this._control.Color);
            this.Refresh();
        }

        public SetImage(value: string): void {
            if (value === undefined || value === null || value === '') {
                this.ImageSrc = '';
                this.Text = this.Name;
            } else {
                this.Text = '';
                this.ImageSrc = value;
            }
        }

        public SetColor(value: string): void {
            const idx = Color.ButtonColors.indexOf(value);

            if (idx === -1) {
                // 色が見つからないとき、デフォルト
                this.Color = Color.MainHover;
                this.HoverColor = Color.MainHover;

                if (this._control) {
                    this._control.Color = Color.MainHover;
                    this._control.HoverColor = Color.MainHover;
                }

            } else {
                // 色が定義済みのとき、ホバー色とともにセット
                this.Color = value;
                this.HoverColor = Color.ButtonHoverColors[idx];

                if (this._control) {
                    this._control.Color = value;
                    this._control.HoverColor = Color.ButtonHoverColors[idx];
                }
            }
            this.Refresh();
        }

        public Dispose(): void {
            if (this._control) {
                this._control.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }
            this._control = null;
            this._name = null;
            this.Code = null;


            super.Dispose();
        }
    }
}
