/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
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

    export class ItemSelectButtonView extends Views.ButtonView {

        public Value: any;

        constructor() {
            super();

            this.Value = null;

            this.SetSize(75, 75);
            this.Position.Policy = Property.PositionPolicy.LeftTop;
            this.HasBorder = true;
            this.BorderRadius = 10;
            this.BackgroundColor = Color.MainBackground;
            this.HoverColor = Color.ButtonHoverColors[0];
            this.Color = Color.ButtonColors[0];
            this.ImageFitPolicy = Property.FitPolicy.Auto;
        }
    }
}
