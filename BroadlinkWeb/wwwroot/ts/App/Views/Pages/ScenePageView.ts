/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />

namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Controls = App.Views.Controls;
    import Color = App.Items.Color;
    import Lang = App.Items.Lang.Lang;

    export class ScenePageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public EditButton: Controls.ButtonView;
        public HeaderLeftLabel: Views.LabelView;
        public DetailPanel: Views.StuckerBoxView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();
            this.HeaderLeftLabel = new Views.LabelView();
            this.EditButton = new Controls.ButtonView();
            this.DetailPanel = new Views.StuckerBoxView();

            this.SetClassName('ScenePageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/ControlSet/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = Lang.Scene;
            this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            this.EditButton.SetSize(40, 40);
            this.EditButton.BackgroundColor = Color.HeaderButtonBackground;
            this.EditButton.HoverColor = Color.HeaderButtonHover;
            this.EditButton.Color = Color.Main;
            this.EditButton.Text = '@';
            this.EditButton.SetAnchor(null, 255, null, null);
            this.HeaderBar.Add(this.EditButton);

            this.HeaderLeftLabel.FontSize = Property.FontSize.Large;
            this.HeaderLeftLabel.Color = Color.Main;
            this.HeaderLeftLabel.SetAnchor(null, 5, null, null);
            this.HeaderBar.Add(this.HeaderLeftLabel);

            this.DetailPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.DetailPanel.Position.Policy = Property.PositionPolicy.LeftTop;
            this.DetailPanel.Size.Width = 280;
            this.DetailPanel.SetAnchor(70, null, null, 10);
            this.DetailPanel.Color = Color.MainBackground;
            this.Add(this.DetailPanel);

            this.HeaderBar.Elem.hover(() => {
                if (this.EditButton.IsVisible) {
                    this.HeaderBar.SetStyles({
                        backgroundColor: Color.MainBackground,
                        cursor: 'normal'
                    });
                    this.HeaderBar.ApplyStyles();
                    return;
                }

                this.HeaderBar.SetStyles({
                    backgroundColor: Color.MainHover,
                    cursor: 'pointer'
                });
                this.HeaderBar.ApplyStyles();
            }, () => {
                this.HeaderBar.SetStyles({
                    backgroundColor: Color.MainBackground,
                    cursor: 'normal'
                });
                this.HeaderBar.ApplyStyles();
            });
        }
    }
}
