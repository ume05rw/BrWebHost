/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
/// <reference path="LabeledButtonView.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;

    export class ControlSetButtonView extends LabeledButtonView {

        private _toggle: Views.ToggleButtonInputView;
        public get Toggle(): Views.ToggleButtonInputView {
            return this._toggle;
        }

        constructor() {
            super()

            this._toggle = new Views.ToggleButtonInputView();

            this.SetSize(150, 170);

            this.Button.HasBorder = false;
            this.Button.BorderRadius = 5;
            this.Button.BackgroundColor = Color.MainBackground;
            this.Button.HoverColor = Color.MainHover;
            this.Button.Color = Color.Main;

            this.Label.Color = Color.Main;

            this._toggle.SetAnchor(null, 40, 40, 30);
            this._toggle.BackgroundColor = 'transparent';
            this.Add(this._toggle);
        }
    }
}
