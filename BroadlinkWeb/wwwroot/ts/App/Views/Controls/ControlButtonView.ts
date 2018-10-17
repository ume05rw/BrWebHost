/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/RelocatableButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="LabeledButtonView.ts" />


namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;
    import Events = App.Events.Controls.ControlButtonViewEvents;

    export class ControlButtonView extends Views.RelocatableButtonView {

        public Code: string;

        constructor() {
            super();

            this.SetSize(75, 75);
            this.GridSize = 90;
            this.Margin = 5;
            this.Position.Policy = Property.PositionPolicy.LeftTop;
            this.HasBorder = true;
            this.BorderRadius = 50;
            this.BackgroundColor = Color.MainBackground;
            this.HoverColor = Color.MainHover;
            this.Color = Color.MainHover;
            this.Code = '';

            this.AddEventListener(Fw.Events.ButtonViewEvents.SingleClick, (e) => {
                this.OnSingleClicked(e);
            });
        }

        private OnSingleClicked(e: JQueryEventObject): void {
            if (this.IsRelocatable) {
                // 編集モードのとき
                Dump.Log('Edit');
                this.DispatchEvent(Events.EditOrdered);
            } else {
                // 実行モードのとき
                Dump.Log('Exec');
                this.DispatchEvent(Events.ExecOrdered, this.Code);
            }
        }
    }
}