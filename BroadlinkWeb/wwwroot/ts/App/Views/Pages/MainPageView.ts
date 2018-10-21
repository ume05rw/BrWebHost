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

    export class MainPageView extends Fw.Views.PageView {

        public HeaderBar: Controls.HeaderBarView;
        public BtnGoSub1: Controls.ButtonView;
        public BtnGoSub2: Controls.ButtonView;
        public BtnGoSub3: Controls.ButtonView;
        public BtnGoDynamic: Controls.ButtonView;


        constructor() {
            super($(""));

            this.HeaderBar = new Controls.HeaderBarView();
            this.BtnGoSub1 = new Controls.ButtonView();
            this.BtnGoSub2 = new Controls.ButtonView();
            this.BtnGoSub3 = new Controls.ButtonView();
            this.BtnGoDynamic = new Controls.ButtonView();

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

            const scenePanel = new Views.StuckerBoxView();
            scenePanel.HasBorder = true;
            scenePanel.BorderRadius = 0;
            scenePanel.BackgroundColor = '#f2f2f2';
            scenePanel.Color = Color.MainBackground;
            scenePanel.SetAnchor(70, 10, 10, null);
            scenePanel.Size.Height = 200;
            scenePanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.Add(scenePanel);

            for (let i = 0; i < 5; i++) {
                const btn = new Controls.SceneButtonView();
                btn.Label.Text = `Scene ${i + 1}`;
                scenePanel.Add(btn);
            }

            const remConPanel = new Views.StuckerBoxView();
            remConPanel.HasBorder = true;
            remConPanel.BorderRadius = 0;
            remConPanel.BackgroundColor = Color.Transparent;
            remConPanel.Color = Color.MainBackground;
            remConPanel.SetAnchor(280, 10, 10, 70);
            //remConPanel.SetAnchor(280, 10, 10, 10);
            remConPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.Add(remConPanel);

            for (let i = 0; i < 20; i++) {
                const btn = new Controls.ControlSetButtonView();

                if (i === 0)
                    btn.LogEnable = true;

                const idx = i % Color.ButtonColors.length;
                btn.Button.BackgroundColor = Color.ButtonColors[idx];
                btn.Button.Color = Color.ReverseMain;
                btn.Label.Text = `Control ${i + 1}`;
                //btn.Label.Color = Color.ReverseMain;
                remConPanel.Add(btn);
            }

            const bottom = new Views.StuckerBoxView();
            bottom.HasBorder = true;
            bottom.BorderRadius = 0;
            bottom.BackgroundColor = 'transparent';
            bottom.Color = '#f5f5f5';
            bottom.SetAnchor(null, 10, 10, 10);
            bottom.ReferencePoint = Property.ReferencePoint.RightBottom;
            bottom.Size.Height = 50;
            this.Add(bottom);

            this.BtnGoSub1.Text = 'Show Sub1';
            this.BtnGoSub1.SetSize(80, 30);
            bottom.Add(this.BtnGoSub1);

            this.BtnGoSub2.Text = 'Show Sub2';
            this.BtnGoSub2.SetSize(80, 30);
            bottom.Add(this.BtnGoSub2);

            this.BtnGoSub3.Text = 'Show Sub3';
            this.BtnGoSub3.SetSize(80, 30);
            bottom.Add(this.BtnGoSub3);

            this.BtnGoDynamic.Text = 'Layout';
            this.BtnGoDynamic.SetSize(80, 30);
            bottom.Add(this.BtnGoDynamic);
        }
    }
}
