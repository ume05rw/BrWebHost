/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Util/Xhr/Params.ts" />
/// <reference path="../../Fw/Util/Xhr/MethodType.ts" />
/// <reference path="../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../../Fw/Events/ControlEvents.ts" />

namespace App.Controllers {
    import Xhr = Fw.Util.Xhr;
    import Events = Fw.Events;

    export class Sub1Controller extends Fw.Controllers.ControllerBase {

        constructor(elem: JQuery, manager: Fw.Controllers.Manager) {
            super(elem, manager);
            this.Init();
        }

        private Init(): void {
            const header = new Fw.Views.ControlView();
            header.Label = 'ヘッダ';
            header.Height = 50;
            header.SetAnchor(0, 0, 0, null);
            header.BackgroundColor = '555555';
            header.Color = 'FFFFFF';
            header.HasBorder = false;
            header.BorderRadius = 0;
            this.View.Add(header);

            const back = new Fw.Views.ControlView();
            back.Width = 40;
            back.Height = 40;
            back.Label = '戻る';
            back.SetAnchor(null, null, 5, null);
            back.AddEventListener(Events.ControlEvents.SingleClick, () => {
                this.Manager.Show("Main");
            });
            header.Add(back);

            const devices = new Fw.Views.ControlView();
            devices.SetDisplayParams(0, -200, 60, 60, '8844FF');
            devices.Label = 'デバイス走査';
            devices.AddEventListener(Events.ControlEvents.SingleClick, () => {
                var params = new Xhr.Params('BrDevices/Discover', Xhr.MethodType.Get);
                params.Callback = (data) => {
                    console.log('Disover:');
                    console.log(data);
                }
                Xhr.Query.Invoke(params);
            });
            this.View.Add(devices);
        }
    }
}