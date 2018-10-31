/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Models/Entities/Scene.ts" />
/// <reference path="LabelAndButtonView.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import Scene = App.Models.Entities.Scene;

    export class SceneButtonView extends LabelAndButtonView {

        public readonly Scene: Scene;

        constructor(entity: Scene) {
            super()

            this.Scene = entity;

            this.SetSize(150, 170);

            this.Button.HasBorder = false;
            this.Button.BorderRadius = 5;
            this.Button.ImageFitPolicy = Property.FitPolicy.Auto;
            this.Label.Color = Color.Main;

            this.ApplyByEntity();
        }

        public ApplyByEntity(): void {
            if (this.Scene) {
                this.Button.BackgroundColor = this.Scene.Color;
                this.Button.Color = this.Scene.Color;
                this.Button.HoverColor = Color.GetButtonHoverColor(this.Scene.Color);
                this.Button.ImageSrc = this.Scene.IconUrl;
                this.Label.Text = this.Scene.Name;
            } else {
                this.Button.BackgroundColor = Color.ButtonColors[8];
                this.Button.Color = Color.ButtonColors[8];
                this.Button.HoverColor = Color.ButtonHoverColors[8];
                this.Button.ImageSrc = '';
                this.Label.Text = '';
            }
        }
    }
}
