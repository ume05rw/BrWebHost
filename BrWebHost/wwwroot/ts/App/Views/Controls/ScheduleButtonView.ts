/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Models/IEntity.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Models/Entities/Schedule.ts" />
/// <reference path="LabelAndButtonView.ts" />
/// <reference path="IMainButtonView.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import Schedule = App.Models.Entities.Schedule;
    import IEntity = Fw.Models.IEntity;
    import IMainButtonView = App.Views.Controls.IMainButtonView;

    export class ScheduleButtonView extends LabelAndButtonView implements IMainButtonView {

        public readonly Entity: IEntity;

        constructor(entity: IEntity) {
            super()

            if (!(entity instanceof Schedule))
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
                const schedule = this.Entity as Schedule;
                this.Button.BackgroundColor = schedule.Color;
                this.Button.Color = schedule.Color;
                this.Button.HoverColor = Color.GetButtonHoverColor(schedule.Color);
                this.Button.ImageSrc = schedule.IconUrl;
                this.Label.Text = schedule.Name;
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
