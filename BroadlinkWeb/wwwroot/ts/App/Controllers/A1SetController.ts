/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Views/Controls/ButtonView.ts" />
/// <reference path="ControlSetController.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Controls = App.Views.Controls;
    import Entities = App.Models.Entities;

    import OperationType = App.Items.OperationType;


    export class A1SetController extends ControlSetController {

        constructor() {
            super('A1Set');

            this.SetClassName('A1SetController');
        }

        public SetEntity(entity: Entities.ControlSet): void {
            super.SetEntity(entity);


        }

        protected async OnButtonClicked(e: Fw.Events.EventObject) {
            return;
        }

        protected ApplyFromEntity(): void {
            if (!this._controlSet)
                return;

            this._page.HeaderBar.Text = this._controlSet.Name;
            this._page.HeaderLeftLabel.Text = this._controlSet.Name;
            this._page.Refresh();

            _.each(this._page.ButtonPanel.Children, (view) => {

                if (view instanceof Controls.ControlButtonView) {
                    const btn = view as Controls.ControlButtonView;
                    const control = btn.Control;

                    if (btn.Color !== control.Color)
                        btn.SetColor(control.Color);

                    if (btn.ImageSrc !== control.IconUrl)
                        btn.SetImage(control.IconUrl);

                    if (this._controlSet.OperationType === OperationType.BroadlinkDevice
                        && (control.Value)
                        && control.Value !== ''
                    ) {
                        // センサ値をボタンに表示する。
                        btn.HoverEnable = false;
                        btn.BackgroundColor = '#FFFFFF';

                        switch (control.Code) {
                            case 'Temp':
                                btn.Name = 'Temp.<br/>' + control.Value;
                                break;
                            case 'Humidity':
                                btn.Name = 'Humidity<br/>' + control.Value;
                                break;
                            case 'Voc':
                                btn.Name = 'VOC<br/>' + control.Value;
                                break;
                            case 'Light':
                                btn.Name = 'Light<br/>' + control.Value;
                                break;
                            case 'Noise':
                                btn.Name = 'Noise<br/>' + control.Value;
                                break;
                            default:
                                break;
                        }
                    }
                } else {

                }
            });
        }

    }
}
