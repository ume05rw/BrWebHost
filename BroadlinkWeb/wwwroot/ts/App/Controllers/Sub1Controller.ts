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

            const header = new App.Views.Controls.HeaderBarView();
            header.Text = 'ヘッダ';
            header.RightButton.Hide(0);
            header.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                Manager.Instance.Show("Main");
            });
            this.View.Add(header);

            const devices = new Fw.Views.ButtonView();
            devices.SetSize(80, 30);
            devices.SetLeftTop(10, 70);
            devices.Text = 'デバイス走査';
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

            const slider = new Fw.Views.SlidableBoxView(Fw.Views.Property.Direction.Horizontal);
            slider.SetSize(400, 200);
            devices.SetLeftTop(10, 120);
            slider.InnerLength = 1000;
            this.View.Add(slider);
        }
    }
}