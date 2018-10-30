/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/PageView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Events/PageViewEvents.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../Controls/HeaderBarView.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Views.Pages {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Controls = App.Views.Controls;
    import Color = App.Items.Color;

    export class MainPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public ScenePanel: Views.StuckerBoxView;
        public ControlSetPanel: Views.StuckerBoxView;

        constructor() {
            super();

            this.HeaderBar = new Controls.HeaderBarView();

            this.SetClassName('MainPageView');

            const background = new Views.ImageView();
            background.SetAnchor(0, 0, 0, 0);
            background.FitPolicy = Property.FitPolicy.Cover;
            background.Src = 'images/Pages/Main/background.jpg';
            this.Add(background);

            this.HeaderBar.Text = 'Broadlink Web Host(仮題)';
            this.HeaderBar.LeftButton.Hide(0);
            //this.HeaderBar.RightButton.Hide(0);
            this.Add(this.HeaderBar);

            this.ScenePanel = new Views.StuckerBoxView();
            this.ScenePanel.HasBorder = true;
            this.ScenePanel.BorderRadius = 0;
            this.ScenePanel.BackgroundColor = '#f2f2f2';
            this.ScenePanel.Color = Color.MainBackground;
            this.ScenePanel.SetAnchor(70, 10, 10, null);
            this.ScenePanel.Size.Height = 200;
            this.ScenePanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.Add(this.ScenePanel);

            this.ControlSetPanel = new Views.StuckerBoxView();
            this.ControlSetPanel.HasBorder = true;
            this.ControlSetPanel.BorderRadius = 0;
            this.ControlSetPanel.BackgroundColor = Color.Transparent;
            this.ControlSetPanel.Color = Color.MainBackground;
            this.ControlSetPanel.SetAnchor(280, 10, 10, 16);
            this.ControlSetPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.Add(this.ControlSetPanel);

            const iconRights = new Views.HtmlView('a');
            iconRights.SetSize(200, 16);
            iconRights.SetAnchor(null, null, 5, 2);
            iconRights.Color = '#9d9e9e';
            iconRights.InnerHtml = 'designed by Lucy G from Flaticon';
            iconRights.Dom.style.fontSize = '12px';
            iconRights.Elem.attr('href', 'https://www.flaticon.com/packs/free-basic-ui-elements');
            iconRights.Elem.attr('target', '_blank');
            this.Add(iconRights);
        }
    }
}
