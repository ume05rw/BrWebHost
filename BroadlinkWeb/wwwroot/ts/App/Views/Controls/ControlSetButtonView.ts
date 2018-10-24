/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="LabeledButtonView.ts" />
/// <reference path="../../Models/Entities/ControlSet.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import ControlSet = App.Models.Entities.ControlSet;

    export class ControlSetButtonView extends LabeledButtonView {

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
            this.Button.BackgroundColor = Color.MainBackground;
            this.Button.HoverColor = Color.MainHover;
            this.Button.Color = Color.Main;

            this.Button.BackgroundColor = this.ControlSet.Color;
            this.Button.Color = this.ControlSet.Color;
            this.Button.HoverColor = this.ControlSet.HoverColor;
            this.Button.ImageSrc = this.ControlSet.IconUrl;
            this.Button.ImageFitPolicy = Property.FitPolicy.Auto;

            this.Label.Color = Color.Main;
            this.Label.Text = this.ControlSet.Name;

            this._toggle.SetAnchor(null, 40, 40, 30);
            this._toggle.BackgroundColor = 'transparent';
            this.Add(this._toggle);
        }
    }
}
