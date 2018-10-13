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

        private _toggle: Views.ToggleButtonView;
        public get Toggle(): Views.ToggleButtonView {
            return this._toggle;
        }

        constructor() {
            super();

            this.HasBorder = false;
            this.BorderRadius = 5;
            this.SetSize(150, 170);
            this.BackgroundColor = Color.MainBackground;
            this.HoverColor = Color.MainHover;
            this.Color = Color.Main;

            this._toggle = new Views.ToggleButtonView();
            this._toggle.SetAnchor(null, 40, 40, 30);
            this._toggle.BackgroundColor = 'transparent';
            this.Add(this._toggle);
        }
    }
}