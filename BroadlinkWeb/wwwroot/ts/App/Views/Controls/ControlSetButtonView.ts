/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/DeviceType.ts" />
/// <reference path="LabeledButtonView.ts" />
/// <reference path="../../Models/Entities/ControlSet.ts" />
/// <reference path="../../Models/Stores/BrDeviceStore.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Items.Color;
    import ControlSet = App.Models.Entities.ControlSet;
    import Stores = App.Models.Stores;
    import OperationType = App.Items.OperationType;
    import DeviceType = App.Items.DeviceType;

    export class ControlSetButtonView extends LabeledButtonView {

        private _toggle: Views.ToggleButtonInputView;
        public get Toggle(): Views.ToggleButtonInputView {
            return this._toggle;
        }

        public readonly ControlSet: ControlSet;

        constructor(entity: ControlSet) {
            super()

            this.ControlSet = entity;
            this._toggle = new Views.ToggleButtonInputView();

            this.SetSize(150, 170);

            this.Button.HasBorder = false;
            this.Button.BorderRadius = 5;
            this.Button.ImageFitPolicy = Property.FitPolicy.Auto;
            this.Label.Color = Color.Main;
            this._toggle.SetAnchor(null, 40, 40, 30);
            this._toggle.BackgroundColor = 'transparent';
            this._toggle.SetBoolValue(entity.ToggleState);
            this.Add(this._toggle);

            this.ApplyEntity();
            this.ApplyBrDeviceStatus();
        }

        public ApplyEntity(): void {
            if (this.ControlSet) {
                this.Button.BackgroundColor = this.ControlSet.Color;
                this.Button.Color = this.ControlSet.Color;
                this.Button.HoverColor = this.ControlSet.HoverColor;
                this.Button.ImageSrc = this.ControlSet.IconUrl;
                this.Label.Text = this.ControlSet.Name;

                if (this.ControlSet.IsTogglable)
                    this.Toggle.Show(0);
                else
                    this.Toggle.Hide(0);

                this.Toggle.SetBoolValue(this.ControlSet.ToggleState, false);
            } else {
                this.Button.BackgroundColor = Color.MainBackground;
                this.Button.Color = Color.Main;
                this.Button.HoverColor = Color.MainHover;
                this.Button.ImageSrc = '';
                this.Label.Text = '';

                this.Toggle.Show(0);
                this.Toggle.SetBoolValue(false, false);
            }
        }

        public ApplyBrDeviceStatus(): void {
            if (
                !this.ControlSet
                || this.ControlSet.OperationType !== OperationType.BroadlinkDevice
            ) {
                return;
            }

            // Broadlinkデバイスの、現在の値を取得する。
            // 対応するデバイスを取得
            const pairedDev = Stores.BrDevices.Get(this.ControlSet.BrDeviceId);
            const delay = 10;

            switch (pairedDev.DeviceType) {
                case DeviceType.A1:
                    // コマンドは一つだけ - 現在の値を取得
                    _.delay(() => {
                        Stores.A1s.Get(this.ControlSet);
                    }, delay);
                    break;

                case DeviceType.Sp2:
                    // コマンドはControlごとに。
                    _.delay(() => {
                        Stores.Sp2s.Get(this.ControlSet);
                    }, delay);
                    break;

                case DeviceType.Rm2Pro:
                    // コマンドは一つだけ - 現在の値を取得
                    _.delay(() => {
                        Stores.Rm2Pros.GetTemperature(this.ControlSet);
                    }, delay);
                    break;


                // 以降、未対応。
                case DeviceType.Rm:
                case DeviceType.Dooya:
                case DeviceType.Hysen:
                case DeviceType.Mp1:
                case DeviceType.S1c:
                case DeviceType.Sp1:
                case DeviceType.Unknown:
                default:
                    break;
            }
        }
    }
}
