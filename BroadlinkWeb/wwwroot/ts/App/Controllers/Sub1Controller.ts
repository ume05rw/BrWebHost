/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../Models/Entities/BrDevice.ts" />
/// <reference path="../Models/Stores/BrDeviceStore.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import BrDevice = App.Models.Entities.BrDevice;
    import Stores = App.Models.Stores;
    import Property = Fw.Views.Property;

    export class Sub1Controller extends Fw.Controllers.ControllerBase {

        constructor(id: string, jqueryElem: JQuery) {
            super(id, jqueryElem);

            const header = new App.Views.Controls.HeaderBarView();
            header.Text = 'ヘッダ';
            header.RightButton.Hide(0);
            header.LeftButton.AddEventListener(Events.ButtonViewEvents.SingleClick, () => {
                this.SwitchTo("Main");
            });
            this.View.Add(header);

            const devices = new Fw.Views.ButtonView();
            devices.SetSize(80, 30);
            devices.SetLeftTop(10, 70);
            devices.Text = 'デバイス走査';
            devices.AddEventListener(Events.ControlViewEvents.SingleClick, async () => {
                //this.Discover();

                Dump.Log('Discover');
                const devs = await Stores.BrDevices.Discover();
                _.each(devs, (dev) => {
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
            this.View.Add(devices);

            const slider = new Fw.Views.SlidableBoxView(Fw.Views.Property.Direction.Horizontal);
            slider.SetSize(400, 200);
            slider.SetLeftTop(10, 120);
            slider.InnerLength = 1000;
            this.View.Add(slider);

            const textbox = new Fw.Views.TextBoxInputView();
            textbox.SetSize(60, 30);
            textbox.SetLeftTop(10, 10);
            textbox.Name = 'textbox';
            slider.Add(textbox);

            const textarea = new Fw.Views.TextAreaInputView();
            textarea.SetSize(100, 50);
            textarea.SetLeftTop(10, 50);
            textarea.Name = 'textarea';
            slider.Add(textarea);

            const selectbox = new Fw.Views.SelectBoxInputView();
            selectbox.SetSize(100, 30);
            selectbox.SetLeftTop(10, 110);
            selectbox.Name = 'selectbox';
            selectbox.AddItem('いちばん', '1');
            selectbox.AddItem('にばん', '2');
            selectbox.AddItem('さんばん', '3');
            slider.Add(selectbox);

            const checkbox1 = new Fw.Views.CheckBoxInputView();
            checkbox1.SetSize(100, 30);
            checkbox1.SetLeftTop(10, 150);
            checkbox1.Name = 'toggle_on';
            checkbox1.Value = 'true';
            checkbox1.Text = 'トグルOn';
            slider.Add(checkbox1);

            const checkbox2 = new Fw.Views.CheckBoxInputView();
            checkbox2.SetSize(100, 30);
            checkbox2.SetLeftTop(10, 190);
            checkbox2.Name = 'toggle_off';
            checkbox2.Value = 'true';
            checkbox2.Text = 'トグルOff';
            slider.Add(checkbox2);

            const label = new Fw.Views.LabelView();
            label.AutoSize = true;
            label.TextAlign = Property.TextAlign.Left;
            label.Text = 'はろー？';
            label.SetLeftTop(80, 10);
            slider.Add(label);
        }

        //private async Discover() {
        //    Dump.Log('Discover');
        //    const store = new BrDeviceStore();
        //    const devs = await store.Discover();
        //    _.each(devs, (dev) => {
        //        Dump.Log({
        //            Id: dev.Id,
        //            Mac: dev.MacAddressString,
        //            Ip: dev.IpAddressString,
        //            Port: dev.Port,
        //            DevType: dev.DeviceType,
        //            DevTypeDetail: dev.DeviceTypeDetal,
        //            IsActive: dev.IsActive
        //        });
        //    });
        //}
    }
}
