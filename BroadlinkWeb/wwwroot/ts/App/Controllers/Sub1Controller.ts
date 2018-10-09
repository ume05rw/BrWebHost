/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Xhr = Fw.Util.Xhr; // <- モデルを実装後は削除する予定

    export class Sub1Controller extends Fw.Controllers.ControllerBase {

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            super(elem, manager);
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
                this.Manager.Show("Main");
            });
            header.Add(back);

            const devices = new Fw.Views.ControlView();
            devices.SetPosition(0, -400);
            devices.SetSize(60, 60);
            devices.Color = '#8844FF';
            devices.Label = 'デバイス走査';
            devices.AddEventListener(Events.ControlViewEvents.SingleClick, () => {
                var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                params.Callback = (data) => {
                    console.log('Disover:');
                    console.log(data);
                }
                Xhr.Query.Invoke(params);
            });
            this.View.Add(devices);

            const slider = new Fw.Views.SlidablePanelControlView(Fw.Views.Direction.Horizontal);
            slider.SetSize(100, 50);
            slider.InnerPanelCount = 2.5;
            slider.SetAnchor(60, 20, null, null);
            this.View.Add(slider);
        }
    }
}