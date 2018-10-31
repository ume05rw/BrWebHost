/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ControlView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="../../Models/Stores/SceneDetailStore.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import ControlButtonViewEvents = App.Events.Controls.ControlButtonViewEvents;
    import EntityEvents = Fw.Events.EntityEvents;
    import Stores = App.Models.Stores;

    export class SceneDetailView extends Fw.Views.BoxView {

        public readonly ControlSetButton: ItemSelectButtonView;
        public readonly ControlSetLabel: Views.LabelView;
        public readonly ControlButton: ItemSelectButtonView;
        public readonly ControlLabel: Views.LabelView;
        public readonly WaitTextBox: Views.TextBoxInputView;

        private _detail: App.Models.Entities.SceneDetail;
        public get Detail(): App.Models.Entities.SceneDetail {
            return this._detail;
        }
        public set Detail(value: App.Models.Entities.SceneDetail) {
            if (this._detail) {
                this._detail.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._detail = value;

            if (this._detail) {
                this._detail.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this.ApplyFromEntity();
        }


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
            this.ControlSetButton.ImageFitPolicy = Property.FitPolicy.Contain;
            this.Add(this.ControlSetButton);

            this.ControlSetLabel.SetLeftTop(5, 90);
            this.ControlSetLabel.SetSize(105, 21);
            this.ControlSetLabel.AutoSize = false;
            this.ControlSetLabel.TextAlign = Property.TextAlign.Center;
            this.ControlSetLabel.FontSize = Property.FontSize.Small;
            this.ControlSetLabel.Text = '';
            this.Add(this.ControlSetLabel);


            this.ControlButton.SetLeftTop(137, 10);
            this.ControlButton.ImageFitPolicy = Property.FitPolicy.Contain;
            this.Add(this.ControlButton);

            this.ControlLabel.SetLeftTop(120, 90);
            this.ControlLabel.SetSize(105, 21);
            this.ControlLabel.AutoSize = false;
            this.ControlLabel.TextAlign = Property.TextAlign.Center;
            this.ControlLabel.FontSize = Property.FontSize.Small;
            this.ControlLabel.Text = '';
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

        public ApplyFromEntity(): void {

            if (this._detail) {
                const cset = Stores.ControlSets.List[this._detail.ControlSetId];
                const control = Stores.Controls.List[this._detail.ControlId];

                if (cset) {
                    this.ControlSetButton.ImageSrc = cset.IconUrl;
                    this.ControlSetButton.Text = (!cset.IconUrl || cset.IconUrl === '')
                        ? cset.Name
                        : '';
                    this.ControlSetLabel.Text = cset.Name;

                    const cidx1 = Color.ButtonColors.indexOf(cset.Color);
                    if (cidx1 === -1) {
                        this.ControlSetButton.Color = Color.ButtonColors[0];
                        this.ControlSetButton.BackgroundColor = Color.MainBackground;
                        this.ControlSetButton.HoverColor = Color.ButtonHoverColors[0];
                    } else {
                        this.ControlSetButton.Color = cset.Color;
                        this.ControlSetButton.BackgroundColor = cset.Color;
                        this.ControlSetButton.HoverColor = Color.ButtonHoverColors[cidx1];
                    }
                } else {
                    this.ControlSetButton.ImageSrc = '';
                    this.ControlSetButton.Text = 'Select<br/>Remotes';
                    this.ControlSetLabel.Text = '';
                    this.ControlSetButton.Color = Color.ButtonColors[0];
                    this.ControlSetButton.BackgroundColor = Color.MainBackground;
                    this.ControlSetButton.HoverColor = Color.ButtonHoverColors[0];
                }

                
                if (control) {
                    this.ControlButton.ImageSrc = control.IconUrl;
                    this.ControlButton.Text = (!control.IconUrl || control.IconUrl === '')
                        ? control.Name
                        : '';
                    this.ControlLabel.Text = control.Name;

                    const cidx2 = Color.ButtonColors.indexOf(control.Color);
                    if (cidx2 === -1) {
                        this.ControlButton.Color = Color.ButtonColors[0];
                        this.ControlButton.BackgroundColor = Color.MainBackground;
                        this.ControlButton.HoverColor = Color.ButtonHoverColors[0];
                    } else {
                        this.ControlButton.Color = control.Color;
                        this.ControlButton.BackgroundColor = Color.MainBackground;
                        this.ControlButton.HoverColor = Color.ButtonHoverColors[cidx2];
                    }
                } else {
                    this.ControlButton.ImageSrc = '';
                    this.ControlButton.Text = (cset)
                        ? 'Select<br/>Button'
                        : '';
                    this.ControlLabel.Text = '';
                    this.ControlButton.Color = Color.ButtonColors[0];
                    this.ControlButton.BackgroundColor = Color.MainBackground;
                    this.ControlButton.HoverColor = Color.ButtonHoverColors[0];
                }
            } else {
                this.ControlSetButton.ImageSrc = '';
                this.ControlSetButton.Text = 'Select<br/>Remotes';
                this.ControlSetLabel.Text = '';
                this.ControlSetButton.Color = Color.ButtonColors[0];
                this.ControlSetButton.BackgroundColor = Color.ButtonColors[0];
                this.ControlSetButton.HoverColor = Color.ButtonHoverColors[0];

                this.ControlButton.ImageSrc = '';
                this.ControlButton.Text = '';
                this.ControlLabel.Text = '';
                this.ControlButton.Color = Color.ButtonColors[0];
                this.ControlButton.BackgroundColor = Color.ButtonColors[0];
                this.ControlButton.HoverColor = Color.ButtonHoverColors[0];
            }

            this.Refresh();
        }
    }
}
