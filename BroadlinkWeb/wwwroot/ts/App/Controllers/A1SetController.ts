/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Views/Controls/ButtonView.ts" />
/// <reference path="ControlSetController.ts" />
/// <reference path="../../Fw/Events/EntityEvents.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Controls = App.Views.Controls;
    import Entities = App.Models.Entities;
    import Util = Fw.Util;
    import OperationType = App.Items.OperationType;
    import EntityEvents = Fw.Events.EntityEvents;

    export class A1SetController extends ControlSetController {

        private _canvas: Fw.Views.HtmlView;

        constructor() {
            super('A1Set');

            this.SetClassName('A1SetController');

            this._canvas = new Fw.Views.HtmlView('canvas');
            this._canvas.SetAnchor(280, 5, 25, null);
            this._canvas.Size.Height = 260;
            this._canvas.HasBorder = true;
            this._canvas.Color = App.Items.Color.ButtonColors[0];
            this._canvas.BorderRadius = 5;
            this._page.ButtonPanel.Add(this._canvas);
        }

        public SetEntity(entity: Entities.ControlSet): void {
            // View側削除処理、ButtonPanel.Childrenを削除操作するため、要素退避しておく。
            const buttons = Util.Obj.Mirror(this._page.ButtonPanel.Children);
            _.each(buttons, (btn: Fw.Views.IView) => {
                // Canvasを削除させないようにする。
                if (btn instanceof Controls.ControlButtonView) {
                    this._page.ButtonPanel.Remove(btn);
                    btn.Dispose();
                }
            });
            this._page.ButtonPanel.InnerLength = this._page.ButtonPanel.Size.Height;


            if (this._controlSet) {
                this._controlSet.RemoveEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);
            }

            this._controlSet = entity;

            if (!this._controlSet)
                return


            this._controlSet.AddEventListener(EntityEvents.Changed, this.ApplyFromEntity, this);

            _.each(this._controlSet.Controls, (control) => {
                const btn = new Controls.ControlButtonView();
                btn.Control = control;
                btn.SetLeftTop(control.PositionLeft, control.PositionTop);
                btn.SetColor(control.Color);
                btn.SetImage(control.IconUrl);

                this._page.ButtonPanel.Add(btn);
            });

            this.ApplyFromEntity();
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
