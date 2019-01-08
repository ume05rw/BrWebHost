/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Models/IEntity.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/DeviceType.ts" />
/// <reference path="LabelAndButtonView.ts" />
/// <reference path="IMainButtonView.ts" />
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
    import IEntity = Fw.Models.IEntity;
    import IMainButtonView = App.Views.Controls.IMainButtonView;

    export class ControlSetButtonView extends LabelAndButtonView implements IMainButtonView {

        private _toggle: Views.ToggleButtonInputView;
        public get Toggle(): Views.ToggleButtonInputView {
            return this._toggle;
        }

        public readonly Entity: IEntity;
        //public readonly ControlSet: ControlSet;

        constructor(entity: IEntity) {
            super()

            if (!(entity instanceof ControlSet))
                throw new Error('Invalid Entity');

            this.Entity = entity;
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

            this.ApplyByEntity();
            this.ApplyBrDeviceStatus();
        }

        public ApplyByEntity(): void {
            if (this.Entity) {
                const controlSet = this.Entity as ControlSet;
                this.Button.BackgroundColor = controlSet.Color;
                this.Button.Color = controlSet.Color;
                this.Button.HoverColor = controlSet.HoverColor;
                this.Button.ImageSrc = controlSet.IconUrl;
                this.Label.Text = controlSet.Name;

                if (controlSet.IsTogglable)
                    this.Toggle.Show(0);
                else
                    this.Toggle.Hide(0);

                this.Toggle.SetBoolValue(controlSet.ToggleState, false);
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

            if (!this.Entity)
                return;

            const controlSet = this.Entity as ControlSet;

            if (controlSet.OperationType !== OperationType.BroadlinkDevice)
                return;


            // Broadlinkデバイスの、現在の値を取得する。
            // 対応するデバイスを取得
            const pairedDev = Stores.BrDevices.Get(controlSet.BrDeviceId);
            const delay = 10;

            switch (pairedDev.DeviceType) {
                case DeviceType.A1:
                    // コマンドは一つだけ - 現在の値を取得
                    _.delay(() => {
                        Stores.A1s.Get(controlSet);
                    }, delay);
                    break;

                case DeviceType.Sp2:
                    // コマンドはControlごとに。
                    _.delay(() => {
                        Stores.Sp2s.Get(controlSet);
                    }, delay);
                    break;

                case DeviceType.Rm2Pro:
                    // コマンドは一つだけ - 現在の値を取得
                    _.delay(() => {
                        Stores.Rm2Pros.GetTemperature(controlSet);
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
