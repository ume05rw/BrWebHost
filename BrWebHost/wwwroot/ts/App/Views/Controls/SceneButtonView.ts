/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Models/IEntity.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Models/Entities/Scene.ts" />
/// <reference path="LabelAndButtonView.ts" />
/// <reference path="IMainButtonView.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import Scene = App.Models.Entities.Scene;
    import IEntity = Fw.Models.IEntity;
    import IMainButtonView = App.Views.Controls.IMainButtonView;

    export class SceneButtonView extends LabelAndButtonView implements IMainButtonView {

        public readonly Entity: IEntity;

        constructor(entity: IEntity) {
            super()

            if (!(entity instanceof Scene))
                throw new Error('Invalid Entity');

            this.Entity = entity;

            this.SetSize(150, 170);

            this.Button.HasBorder = false;
            this.Button.BorderRadius = 5;
            this.Button.ImageFitPolicy = Property.FitPolicy.Auto;
            this.Label.Color = Color.Main;

            this.ApplyByEntity();
        }

        public ApplyByEntity(): void {
            if (this.Entity) {
                const scene = this.Entity as Scene;
                this.Button.BackgroundColor = scene.Color;
                this.Button.Color = scene.Color;
                this.Button.HoverColor = Color.GetButtonHoverColor(scene.Color);
                this.Button.ImageSrc = scene.IconUrl;
                this.Label.Text = scene.Name;
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
