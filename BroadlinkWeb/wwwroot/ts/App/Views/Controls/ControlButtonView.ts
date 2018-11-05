/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../../lib/popperjs/index.d.ts" />
/// <reference path="../../../../lib/tippyjs/index.d.ts" />
/// <reference path="../../../Fw/Views/RelocatableButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />

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

        private _tooltip: string;
        private _tippy: Tippy.Instance;
        public get Tooltip(): string {
            return this._tooltip;
        }
        public set Tooltip(value: string) {
            this._tooltip = value;
            this.Refresh();
        }

        private _hoverEnable: boolean = true;
        public get HoverEnable(): boolean {
            return this._hoverEnable;
        }
        public set HoverEnable(value: boolean) {
            this._hoverEnable = value;

            // 一旦、Hover関連イベントを削除する。
            this.Elem.off('mouseenter mouseleave');

            if (this._hoverEnable) {
                // Hoverを有効にするとき
                this.Elem.on('mouseenter', () => {
                    this.Dom.style.backgroundColor = this.HoverColor;
                });
                this.Elem.on('mouseleave', () => {
                    this.Dom.style.backgroundColor = this.BackgroundColor;
                });
            } else {
                // Hoverを無効にするとき
                // なにもしない。
            }
        }

        private _isActive: boolean = false;
        public get IsActive(): boolean {
            return this._isActive;
        }
        public set IsActive(value: boolean) {
            if (this._hoverEnable)
                throw new Error('Hover is Enable, Cannot Active-Control.');

            this._isActive = value;
            if (this._isActive) {
                // 有効化
                this.BackgroundColor = Color.GetButtonHoverColor(this.Color);
                this.Dom.style.backgroundColor = this.BackgroundColor;
                
                
            } else {
                // 無効化
                this.BackgroundColor = Color.MainBackground;
                this.Dom.style.backgroundColor = this.BackgroundColor;
            }
        }


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
            this._name = '';
            this._hoverEnable = true;

            this.AddEventListener(Events.PositionChanged, () => {
                if (this._control) {
                    this._control.PositionLeft = this.Position.Left;
                    this._control.PositionTop = this.Position.Top;
                }
            });
        }

        private ApplyFromEntity(): void {
            if (!this._control)
                return;

            this.Name = this._control.Name;
            
            this.SetImage(this._control.IconUrl);
            this.SetColor(this._control.Color);

            if (
                this._control.Name
                && this._control.Name !== ''
                && this._control.IconUrl
                && this._control.IconUrl !== ''
            ) {
                this.Tooltip = this._control.Name;
            } else {
                this.Tooltip = null;
            }

            this.Refresh();
        }

        public SetImage(value: string): void {
            if (value === undefined || value === null || value === '') {
                this.ImageSrc = '';
                this.Text = this.Name;
            } else {
                this.ImageSrc = value;
                this.Text = '';
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
                }

            } else {
                // 色が定義済みのとき、ホバー色とともにセット
                this.Color = value;
                this.HoverColor = Color.ButtonHoverColors[idx];

                if (this._control) {
                    this._control.Color = value;
                }
            }
            this.Refresh();
        }

        protected InnerRefresh(): void {
            try {
                super.InnerRefresh();

                if (this._tippy) {
                    this._tippy.destroy();
                    this._tippy = null;
                }

                if (this._tooltip && this._tooltip !== '') {
                    this._tippy = tippy.one(this.Dom as Element, {
                        content: this._tooltip,
                        delay: 100,
                        arrow: true,
                        arrowType: 'round',
                        size: 'large',
                        duration: 500,
                        animation: 'scale'
                    });
                }
            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            if (this._control) {
                this._control.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }
            this._control = null;
            this._name = null;

            super.Dispose();
        }
    }
}
