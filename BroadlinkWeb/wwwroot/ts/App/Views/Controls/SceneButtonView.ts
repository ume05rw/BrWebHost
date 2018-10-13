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

    export class SceneButtonView extends LabeledButtonView {
        constructor() {
            super();

            this.SetSize(200, 150);

            this.Button.HasBorder = true;
            this.Button.BorderRadius = 50;
            this.Button.BackgroundColor = Color.MainBackground;
            this.Button.HoverColor = Color.MainHover;
            this.Button.Color = Color.Main;

            this.Label.Color = Color.Main;
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();
            this.Button.Dom.style.borderColor = Color.MainHover;
        }
    }
}