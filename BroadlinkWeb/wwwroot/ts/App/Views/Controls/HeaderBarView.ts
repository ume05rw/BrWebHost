/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/BoxView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;

    export class HeaderBarView extends Fw.Views.BoxView {

        public get Text(): string {
            return this._label.Text;
        }
        public set Text(value: string) {
            this._label.Text = value;
            this.Refresh();
        }

        private _label: Views.LabelView;

        private _btnLeft: App.Views.Controls.ButtonView;
        public get LeftButton(): App.Views.Controls.ButtonView {
            return this._btnLeft;
        }

        private _btnRight: App.Views.Controls.ButtonView;
        public get RightButton(): App.Views.Controls.ButtonView {
            return this._btnRight;
        }

        constructor() {
            super();

            this.Initialize();
        }

        private Initialize(): void {
            this.Size.Height = 50;
            this.SetAnchor(0, 0, 0, null);
            this.BackgroundColor = Color.MainBackground;
            this.HasBorder = false;

            this._label = new Views.LabelView();
            this._label.FontSize = Property.FontSize.Large;
            this._label.Color = Color.Main;
            this.Add(this._label);

            this._btnLeft = new App.Views.Controls.ButtonView();
            this._btnLeft.SetSize(40, 40);
            this._btnLeft.BackgroundColor = Color.HeaderButtonBackground;
            this._btnLeft.HoverColor = Color.HeaderButtonHover;
            this._btnLeft.Color = Color.Main;
            this._btnLeft.Text = '<<';
            this._btnLeft.SetAnchor(null, 5, null, null);
            this.Add(this._btnLeft);

            this._btnRight = new App.Views.Controls.ButtonView();
            this._btnRight.SetSize(40, 40);
            this._btnRight.BackgroundColor = Color.HeaderButtonBackground;
            this._btnRight.HoverColor = Color.HeaderButtonHover;
            this._btnRight.Color = Color.Main;
            this._btnRight.Text = '+';
            this._btnRight.SetAnchor(null, null, 5, null);
            this.Add(this._btnRight);

            this.AddEventListener(Fw.Events.BoxViewEvents.Attached, () => {
                this.Refresh();
            });
        }

        public Dispose(): void {
            this.RemoveEventListener(Fw.Events.BoxViewEvents.Attached);
            super.Dispose();
        }
    }
}