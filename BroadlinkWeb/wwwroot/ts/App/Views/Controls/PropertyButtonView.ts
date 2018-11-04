/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;

    export class PropertyButtonView extends Fw.Views.ButtonView {

        constructor() {
            super()

            this.HasBorder = true;
            this.BorderRadius = 0;
            this.BackgroundColor = Color.Transparent;
            this.HoverColor = Color.MainHover;
            this.Color = Color.Main;
        }
    }
}
