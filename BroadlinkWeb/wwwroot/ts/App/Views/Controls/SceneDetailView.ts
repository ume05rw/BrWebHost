/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ControlView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import ControlButtonViewEvents = App.Events.Controls.ControlButtonViewEvents;

    export class SceneDetailView extends Fw.Views.BoxView {

        public readonly ControlSetButton: ItemSelectButtonView;
        public readonly ControlSetLabel: Views.LabelView;
        public readonly ControlButton: ItemSelectButtonView;
        public readonly ControlLabel: Views.LabelView;
        public readonly WaitTextBox: Views.TextBoxInputView;

        constructor() {
            super()

            this.ControlSetButton = new ItemSelectButtonView();
            this.ControlSetLabel = new Views.LabelView();
            this.ControlButton = new ItemSelectButtonView();
            this.ControlLabel = new Views.LabelView();
            this.WaitTextBox = new Views.TextBoxInputView();

            this.SetClassName('SceneDetailView');
            this.Elem.addClass(this.ClassName);

            this.SetSize(230, 145);
            this.HasBorder = true;
            this.Color = Color.MainHover;

            this.ControlSetButton.SetLeftTop(22, 10);
            this.Add(this.ControlSetButton);

            this.ControlSetLabel.SetLeftTop(10, 90);
            this.ControlSetLabel.SetSize(105, 21);
            this.ControlSetLabel.Text = 'ABCDEFGABCDEF';
            this.Add(this.ControlSetLabel);


            this.ControlButton.SetLeftTop(137, 10);
            this.Add(this.ControlButton);

            this.ControlLabel.SetLeftTop(135, 90);
            this.ControlLabel.SetSize(105, 21);
            this.ControlLabel.Text = 'ABCDEFGABCDEF';
            this.Add(this.ControlLabel);

            this.WaitTextBox.SetSize(40, 21);
            this.WaitTextBox.SetLeftTop(105, 115);
            this.WaitTextBox.Value = '1.0';
            this.WaitTextBox.TextAlign = Property.TextAlign.Center;
            
            this.Add(this.WaitTextBox);
        }

        public SetWaitable(enable: boolean): void {
            if (enable) {
                // 待機時間入力可能
                this.SetSize(230, 145);
                this.WaitTextBox.Show(0);
            } else {
                // 待機時間入力NG(=末尾要素)
                this.SetSize(230, 115);
                this.WaitTextBox.Hide(0);
            }
            
        }
    }
}
