/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/DeviceType.ts" />
/// <reference path="LabelAndButtonView.ts" />
/// <reference path="../../Models/Entities/ControlSet.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import ControlSet = App.Models.Entities.ControlSet;
    import Stores = App.Models.Stores;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;

    export class ControlSetButtonView extends LabelAndButtonView {

        private _toggle: Views.ToggleButtonInputView;
        public get Toggle(): Views.ToggleButtonInputView {
            return this._toggle;
        }

        public readonly ControlSet: ControlSet;

        constructor(entity: ControlSet) {
            super()

            this.ControlSet = entity;
            this._toggle = new Views.ToggleButtonInputView();

            this.SetSize(150, 170);

            this.Button.HasBorder = false;
            this.Button.BorderRadius = 5;
            this.Button.ImageFitPolicy = Property.FitPolicy.Auto;
            this.Label.Color = Color.Main;
            this._toggle.SetAnchor(null, 40, 40, 30);
            this._toggle.BackgroundColor = 'transparent';
            this._toggle.SetBoolValue(entity.ToggleState);
            this.Add(this._toggle);

            this.ApplyByEntity();
        }

        public ApplyByEntity(): void {
            if (this.ControlSet) {
                this.Button.BackgroundColor = this.ControlSet.Color;
                this.Button.Color = this.ControlSet.Color;
                this.Button.HoverColor = this.ControlSet.HoverColor;
                this.Button.ImageSrc = this.ControlSet.IconUrl;
                this.Label.Text = this.ControlSet.Name;

                if (this.ControlSet.IsTogglable)
                    this.Toggle.Show(0);
                else
                    this.Toggle.Hide(0);

                this.Toggle.SetBoolValue(this.ControlSet.ToggleState, false);
            } else {
                this.Button.BackgroundColor = Color.MainBackground;
                this.Button.Color = Color.Main;
                this.Button.HoverColor = Color.MainHover;
                this.Button.ImageSrc = '';
                this.Label.Text = '';

                this.Toggle.Show(0);
                this.Toggle.SetBoolValue(false, false);
            }
        }
    }
}
