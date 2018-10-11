/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../Models/Entities/BrDevice.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import BrDevice = App.Models.Entities.BrDevice;
    import BrDeviceStore = App.Models.Stores.BrDeviceStore;

    export class Sub1Controller extends Fw.Controllers.ControllerBase {

        constructor(id: string, jqueryElem: JQuery) {
            super(id, jqueryElem);
            this.Init();
        }

        private Init(): void {
            const header = new Fw.Views.ControlView();
            header.Label = 'ヘッダ';
            header.Size.Height = 50;
            header.SetAnchor(0, 0, 0, null);
            header.BackgroundColor = '#555555';
            header.Color = '#FFFFFF';
            header.HasBorder = false;
            header.BorderRadius = 0;
            this.View.Add(header);

            const back = new Fw.Views.ControlView();
            back.Size.Width = 40;
            back.Size.Height = 40;
            back.Label = '戻る';
            back.SetAnchor(null, null, 5, null);
            back.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                Manager.Instance.Show("Main");
            });
            header.Add(back);

            const devices = new Fw.Views.ControlView();
            devices.SetXY(0, -400);
            devices.SetSize(60, 60);
            devices.Color = '#8844FF';
            devices.Label = 'デバイス走査';
            devices.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                const store = new BrDeviceStore();
                store.Discover((devices: BrDevice[]) => {
                    _.each(devices, (dev) => {
                        Dump.Log({
                            Id: dev.Id,
                            Mac: dev.MacAddressString,
                            Ip: dev.IpAddressString,
                            Port: dev.Port,
                            DevType: dev.DeviceType,
                            DevTypeDetail: dev.DeviceTypeDetal,
                            IsActive: dev.IsActive
                        });
                    });
                });
            });
            this.View.Add(devices);

            const slider = new Fw.Views.SlidableBoxView(Fw.Views.Direction.Horizontal);
            slider.SetSize(100, 50);
            slider.InnerPanelCount = 2.5;
            slider.SetAnchor(60, 20, null, null);
            this.View.Add(slider);
        }
    }
}