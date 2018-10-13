﻿/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;

    export class SceneButtonView extends Fw.Views.ButtonView {
        constructor() {
            super();

            this.HasBorder = true;
            this.SetSize(200, 150);
            this.BackgroundColor = Color.MainBackground;
            this.HoverColor = Color.MainHover;
            this.Color = Color.Main;
        }

        protected InnerRefresh(): void {
            super.InnerRefresh();
            this.Dom.style.borderColor = Color.MainHover;
        }
    }
}