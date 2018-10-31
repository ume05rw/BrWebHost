/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="ItemSelectControllerBase.ts" />

/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Controls/LabelAndButtonView.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../Items/OperationTemplate.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/DeviceType.ts" />
/// <reference path="../Models/Stores/ControlSetStore.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import LabelAndButtonView = App.Views.Controls.LabelAndButtonView;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import OperationTemplate = App.Items.OperationTemplate;
    import Color = App.Items.Color;
    import OperationType = App.Items.OperationType;
    import Stores = App.Models.Stores;
    import ControlSet = App.Models.Entities.ControlSet;
    import DeviceType = App.Items.DeviceType;

    export class ControlSetSelectController extends ItemSelectControllerBase {

        private _page: Pages.ItemSelectPageView;
        private _controlSets: Array<ControlSet> = [];

        constructor() {
            super('ControlSetSelect');

            this.SetClassName('ControlSetSelectController');

            this._page = this.View as Pages.ItemSelectPageView;

            this._page.Label.Text = 'Select Remote Control';

            this._controlSets = null;
        }

        public async Select(parentController: Fw.Controllers.IController): Promise<any> {
            this.InitView();
            return super.Select(parentController);
        }

        public async RefreshControlSets(): Promise<boolean> {
            this._controlSets = await Stores.ControlSets.GetListForMainPanel();
            return true;
        }

        private async InitView(): Promise<boolean> {

            if (!this._controlSets)
                await this.RefreshControlSets();

            const children = Fw.Util.Obj.Mirror(this._page.SelectorPanel.Children);
            _.each(children, (v: Fw.Views.IView) => {
                this._page.SelectorPanel.Remove(v);
                v.Dispose();
            });

            _.each(this._controlSets, (cset: ControlSet) => {

                // 操作未対応のBroadlinkデバイスのとき、選択させない。
                if (cset.OperationType === OperationType.BroadlinkDevice) {
                    const pairedDev = Stores.BrDevices.Get(cset.BrDeviceId);
                    if (pairedDev.DeviceType === DeviceType.A1
                        || pairedDev.DeviceType === DeviceType.Rm
                        || pairedDev.DeviceType === DeviceType.Rm2Pro
                        || pairedDev.DeviceType === DeviceType.Dooya
                        || pairedDev.DeviceType === DeviceType.Hysen
                        || pairedDev.DeviceType === DeviceType.Mp1
                        || pairedDev.DeviceType === DeviceType.S1c
                        || pairedDev.DeviceType === DeviceType.Sp1
                    ) {
                        return;
                    }
                }

                // シーン
                const btn = this.GetNewButton();
                btn.Label.Text = cset.Name;
                btn.Button.ImageSrc = cset.IconUrl;
                btn.Button.Color = cset.Color;
                btn.Button.BackgroundColor = cset.Color;
                btn.Button.HoverColor = Color.GetButtonHoverColor(cset.Color);
                btn.Value = cset;

                btn.Button.AddEventListener(ButtonEvents.SingleClick, (e) => {
                    const button = e.Sender as Fw.Views.ButtonView;
                    const lbView = button.Parent as LabelAndButtonView;
                    const controlSet = lbView.Value as ControlSet;
                    this.Commit(controlSet);
                });
                this._page.SelectorPanel.Add(btn);
            });

            this._page.SelectorPanel.Refresh();

            return true;
        }

        private GetNewButton(): LabelAndButtonView {
            const button = new LabelAndButtonView();
            button.SetSize(75, 95);
            button.Button.Position.Policy = Property.PositionPolicy.LeftTop;
            button.Button.HasBorder = true;
            button.Button.BorderRadius = 10;
            button.Button.BackgroundColor = App.Items.Color.MainBackground;
            button.Button.HoverColor = App.Items.Color.ButtonHoverColors[0];
            button.Button.Color = App.Items.Color.ButtonColors[0];
            button.Button.ImageFitPolicy = Property.FitPolicy.Cover;
            return button;
        }
    }
}
