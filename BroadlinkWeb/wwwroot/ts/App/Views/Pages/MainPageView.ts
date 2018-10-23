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
        public BottomPanel: Views.StuckerBoxView;
        public BtnGoSub1: Controls.ButtonView;
        public BtnGoSub2: Controls.ButtonView;
        public BtnGoSub3: Controls.ButtonView;
        public BtnGoDynamic: Controls.ButtonView;


        constructor() {
            super();

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

            this.ScenePanel = new Views.StuckerBoxView();
            this.ScenePanel.HasBorder = true;
            this.ScenePanel.BorderRadius = 0;
            this.ScenePanel.BackgroundColor = '#f2f2f2';
            this.ScenePanel.Color = Color.MainBackground;
            this.ScenePanel.SetAnchor(70, 10, 10, null);
            this.ScenePanel.Size.Height = 200;
            this.ScenePanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.Add(this.ScenePanel);

            for (let i = 0; i < 5; i++) {
                const btn = new Controls.SceneButtonView();
                btn.Label.Text = `Scene ${i + 1}`;
                this.ScenePanel.Add(btn);
            }

            this.ControlSetPanel = new Views.StuckerBoxView();
            this.ControlSetPanel.HasBorder = true;
            this.ControlSetPanel.BorderRadius = 0;
            this.ControlSetPanel.BackgroundColor = Color.Transparent;
            this.ControlSetPanel.Color = Color.MainBackground;
            this.ControlSetPanel.SetAnchor(280, 10, 10, 70);
            //remConPanel.SetAnchor(280, 10, 10, 10);
            this.ControlSetPanel.ReferencePoint = Property.ReferencePoint.LeftTop;
            this.Add(this.ControlSetPanel);

            for (let i = 0; i < 20; i++) {
                const btn = new Controls.ControlSetButtonView();

                // 何かひとつ、詳細なログ出力を行う。デバッグ用。
                //if (i === 0)
                //    btn.EnableLog = true;

                const idx = i % Color.ButtonColors.length;
                btn.Button.BackgroundColor = Color.ButtonColors[idx];
                btn.Button.Color = Color.ReverseMain;
                btn.Button.HoverColor = Color.ButtonHoverColors[idx];
                btn.Label.Text = `Control ${i + 1}`;
                //btn.Label.Color = Color.ReverseMain;
                this.ControlSetPanel.Add(btn);
            }

            this.BottomPanel = new Views.StuckerBoxView();
            this.BottomPanel.HasBorder = true;
            this.BottomPanel.BorderRadius = 0;
            this.BottomPanel.BackgroundColor = 'transparent';
            this.BottomPanel.Color = '#f5f5f5';
            this.BottomPanel.SetAnchor(null, 10, 10, 10);
            this.BottomPanel.ReferencePoint = Property.ReferencePoint.RightBottom;
            this.BottomPanel.Size.Height = 50;
            this.Add(this.BottomPanel);

            this.BtnGoSub1.Text = 'Show Sub1';
            this.BtnGoSub1.SetSize(80, 30);
            this.BottomPanel.Add(this.BtnGoSub1);

            this.BtnGoSub2.Text = 'Show Sub2';
            this.BtnGoSub2.SetSize(80, 30);
            this.BottomPanel.Add(this.BtnGoSub2);

            this.BtnGoSub3.Text = 'Show Sub3';
            this.BtnGoSub3.SetSize(80, 30);
            this.BottomPanel.Add(this.BtnGoSub3);

            this.BtnGoDynamic.Text = 'Layout';
            this.BtnGoDynamic.SetSize(80, 30);
            this.BottomPanel.Add(this.BtnGoDynamic);
        }
    }
}
