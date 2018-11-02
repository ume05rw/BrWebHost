/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />


namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Controls = App.Views.Controls;

    export class ItemSelectPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public SelectorPanel: Views.StuckerBoxView;
        public Label: Views.LabelView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.SelectorPanel = new Views.StuckerBoxView();

            this.SetClassName('ItemSelectionPageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlProperty/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = '';
            this.HeaderBar.LeftButton.Hide(0);
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            this.Label = new Views.LabelView();
            this.Label.FontSize = Property.FontSize.Large;
            this.Label.Color = App.Items.Color.Main;
            this.Label.SetAnchor(null, 5, null, null);
            this.Label.Text = '';
            this.HeaderBar.Add(this.Label);

            this.SelectorPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.SelectorPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.SelectorPanel.Size.Width = 280;
            this.SelectorPanel.Margin = 5;
            this.SelectorPanel.RightMargin = 20;
            this.SelectorPanel.SetAnchor(70, 10, null, 10);
            this.SelectorPanel.Color = App.Items.Color.MainBackground;
            this.Add(this.SelectorPanel);
        }
    }
}
