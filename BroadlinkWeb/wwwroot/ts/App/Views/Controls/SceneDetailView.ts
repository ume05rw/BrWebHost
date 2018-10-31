/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ControlView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Events/EntityEvents.ts" />
/// <reference path="../../../Fw/Events/BoxViewEvents.ts" />
/// <reference path="../../../Fw/Events/TextBoxInputViewEvents.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Events/Controls/ControlButtonViewEvents.ts" />
/// <reference path="../../Models/Stores/SceneDetailStore.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import BoxEvents = Fw.Events.BoxViewEvents;
    import TextBoxEvents = Fw.Events.TextBoxInputViewEvents;
    import EntityEvents = Fw.Events.EntityEvents;
    import Stores = App.Models.Stores;

    export class SceneDetailView extends Fw.Views.BoxView {

        public readonly ControlSetButton: ItemSelectButtonView;
        public readonly ControlSetLabel: Views.LabelView;
        public readonly ControlButton: ItemSelectButtonView;
        public readonly ControlLabel: Views.LabelView;
        public readonly WaitTextBox: Views.TextBoxInputView;
        public readonly WaitPreLabel: Views.LabelView;
        public readonly WaitPostLabel: Views.LabelView;
        public readonly DeleteButton: Views.ButtonView;

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
            this.WaitPreLabel = new Views.LabelView();
            this.WaitPostLabel = new Views.LabelView();
            this.DeleteButton = new Views.ButtonView();

            this.SetClassName('SceneDetailView');
            this.Elem.addClass(this.ClassName);

            this.SetSize(230, 145);
            this.HasBorder = true;
            this.Color = Color.MainHover;

            this.ControlSetButton.SetLeftTop(16, 10);
            this.ControlSetButton.ImageFitPolicy = Property.FitPolicy.Contain;
            this.Add(this.ControlSetButton);

            this.ControlSetLabel.SetLeftTop(5, 90);
            this.ControlSetLabel.SetSize(85, 21);
            this.ControlSetLabel.AutoSize = false;
            this.ControlSetLabel.TextAlign = Property.TextAlign.Center;
            this.ControlSetLabel.FontSize = Property.FontSize.XSmall;
            this.ControlSetLabel.Text = '';
            this.Add(this.ControlSetLabel);


            this.ControlButton.SetLeftTop(119, 10);
            this.ControlButton.ImageFitPolicy = Property.FitPolicy.Contain;
            this.Add(this.ControlButton);

            this.ControlLabel.SetLeftTop(100, 90);
            this.ControlLabel.SetSize(85, 21);
            this.ControlLabel.AutoSize = false;
            this.ControlLabel.TextAlign = Property.TextAlign.Center;
            this.ControlLabel.FontSize = Property.FontSize.XSmall;
            this.ControlLabel.Text = '';
            this.Add(this.ControlLabel);

            this.WaitPreLabel.SetLeftTop(50, 121);
            this.WaitPreLabel.SetSize(40, 21);
            this.WaitPreLabel.AutoSize = false;
            this.WaitPreLabel.TextAlign = Property.TextAlign.Right;
            this.WaitPreLabel.FontSize = Property.FontSize.XSmall;
            this.WaitPreLabel.Text = 'Wait:';
            this.WaitPreLabel.SetTransAnimation(true);
            this.Add(this.WaitPreLabel);

            this.WaitPostLabel.SetLeftTop(140, 121);
            this.WaitPostLabel.SetSize(40, 21);
            this.WaitPostLabel.AutoSize = false;
            this.WaitPostLabel.TextAlign = Property.TextAlign.Left;
            this.WaitPostLabel.FontSize = Property.FontSize.XSmall;
            this.WaitPostLabel.Text = 'Sec';
            this.WaitPostLabel.SetTransAnimation(true);
            this.Add(this.WaitPostLabel);

            this.WaitTextBox.SetLeftTop(95, 115);
            this.WaitTextBox.SetSize(40, 21);
            this.WaitTextBox.Value = '1.0';
            this.WaitTextBox.TextAlign = Property.TextAlign.Center;

            this.WaitTextBox.Elem.on('keypress', (e) => {
                // 数字以外の不要な文字を削除
                var st = String.fromCharCode(e.which);
                return ("0123456789-.".indexOf(st, 0) < 0)
                    ? false
                    : true;
            });
            this.WaitTextBox.AddEventListener(TextBoxEvents.Changed, () => {
                let value = this.WaitTextBox.Value;
                if ($.isNumeric(value) && this.Detail) {
                    this.Detail.WaitSecond = parseFloat(value);
                }
            });
            this.Add(this.WaitTextBox);

            this.DeleteButton.SetSize(30, 30);
            this.DeleteButton.Position.Policy = Property.PositionPolicy.LeftTop;
            this.DeleteButton.BorderRadius = 50;
            this.DeleteButton.HasBorder = true;
            this.DeleteButton.Color = '#9d9e9e';
            this.DeleteButton.BackgroundColor = '#FFFFFF';
            this.DeleteButton.HoverColor = '#F4F4F4';
            this.DeleteButton.ImageFitPolicy = Property.FitPolicy.Auto;
            this.DeleteButton.ImageSrc = 'images/icons/scene/cross.png';
            this.DeleteButton.SetParent(this);
            this.DeleteButton.Hide(0);
            //this.Add(this.DeleteButton);

            this.AddEventListener(BoxEvents.Attached, () => {
                this.Parent.Elem.append(this.DeleteButton.Elem);
            });
            this.AddEventListener(BoxEvents.Detached, () => {
                this.DeleteButton.Elem.remove();
            });
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

                this.WaitTextBox.Value = String(this._detail.WaitSecond);

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

                this.WaitTextBox.Value = '0.0';
            }

            this.Refresh();
        }

        public CalcLayout(): void {

            super.CalcLayout();

            if (this.DeleteButton.IsVisible) {
                this.ControlSetButton.SetLeftTop(16, 10);
                this.ControlSetLabel.SetLeftTop(5, 90);
                this.ControlSetLabel.SetSize(92, 21);

                this.ControlButton.SetLeftTop(119, 10);
                this.ControlLabel.SetLeftTop(107, 90);
                this.ControlLabel.SetSize(92, 21);

                this.WaitTextBox.SetLeftTop(82, 115);
                this.WaitPreLabel.SetLeftTop(37, 121);
                this.WaitPostLabel.SetLeftTop(127, 121);

                this.DeleteButton.Position.Left
                    = this.Position.Left + this.Size.Width - (this.DeleteButton.Size.Width / 2) - 8;
                this.DeleteButton.Position.Top
                    = this.Position.Top - (this.DeleteButton.Size.Height / 2) + 8;
            } else {
                this.ControlSetButton.SetLeftTop(22, 10);
                this.ControlSetLabel.SetLeftTop(5, 90);
                this.ControlSetLabel.SetSize(105, 21);

                this.ControlButton.SetLeftTop(138, 10);
                this.ControlLabel.SetLeftTop(120, 90);
                this.ControlLabel.SetSize(105, 21);

                this.WaitTextBox.SetLeftTop(95, 115);
                this.WaitPreLabel.SetLeftTop(50, 121);
                this.WaitPostLabel.SetLeftTop(140, 121);
            }
        }
    }
}
