/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../../Fw/Controllers/ControllerBase.ts" />
/// <reference path="../../Fw/Controllers/Manager.ts" />
/// <reference path="../../Fw/Util/Dump.ts" />
/// <reference path="../../Fw/Events/ControlViewEvents.ts" />
/// <reference path="../../Fw/Events/ButtonViewEvents.ts" />
/// <reference path="../../Fw/Views/Property/FitPolicy.ts" />
/// <reference path="../Models/Entities/ControlSet.ts" />
/// <reference path="../Models/Entities/Control.ts" />
/// <reference path="../Models/Entities/Script.ts" />
/// <reference path="../Items/Color.ts" />
/// <reference path="../Items/OperationType.ts" />
/// <reference path="../Views/Pages/MainPageView.ts" />
/// <reference path="../Views/Popup/AlertPopup.ts" />

namespace App.Controllers {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events;
    import Manager = Fw.Controllers.Manager;
    import Property = Fw.Views.Property;
    import Pages = App.Views.Pages;
    import Controls = App.Views.Controls;
    import Popup = App.Views.Popup;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Script = App.Models.Entities.Script;
    import Color = App.Items.Color;
    import ButtonEvents = Fw.Events.ButtonViewEvents;
    import OperationType = App.Items.OperationType;
    import Stores = App.Models.Stores;

    export class ControlPropertyController extends Fw.Controllers.ControllerBase {

        private _page: Pages.ControlPropertyPageView;
        private _control: App.Models.Entities.Control;
        private _controlSet: App.Models.Entities.ControlSet;

        constructor() {
            super('ControlProperty');

            this.SetClassName('ControlPropertyController');

            this.SetPageView(new Pages.ControlPropertyPageView());
            this._page = this.View as Pages.ControlPropertyPageView;
            this._control = null;
            this._controlSet = null;

            this._page.TxtName.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                this.ApplyToEntity();
            });

            this._page.BtnIcon.AddEventListener(ButtonEvents.SingleClick, async (e) => {
                if (!this._control)
                    return;

                //this.Log('ControlPropertyController.BtnIcon.SingleClick');

                const ctr = this.Manager.Get('IconSelect') as IconSelectController;
                const icon: string = await ctr.Select(this);

                const url = (icon)
                    ? 'images/icons/' + icon
                    : '';

                this._page.BtnIcon.ImageSrc = url;

                this.ApplyToEntity();
            });

            this._page.BtnColor.AddEventListener(ButtonEvents.SingleClick, async (e) => {
                if (!this._control)
                    return;

                //this.Log('ControlPropertyController.BtnColor.SingleClick');

                const ctr = this.Manager.Get('ColorSelect') as ColorSelectController;
                const color: string = await ctr.Select(this);

                this._page.BtnColor.Color = color;
                this._page.BtnColor.BackgroundColor = color;
                this._page.BtnColor.HoverColor = Color.GetButtonHoverColor(color);

                this.ApplyToEntity();
            });

            this._page.TarCode.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                this.ApplyToEntity();
            });

            this._page.TxtMac.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                this.ApplyToEntity();
            });

            this._page.SboRemote.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                this.ApplyToEntity();
            });

            this._page.BtnSend.AddEventListener(ButtonEvents.SingleClick, async (e) => {
                if (!this._control)
                    return;

                const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                ctr.ExecCode(this._control);
            });

            this._page.ChkToggleOn.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                this.ApplyToEntity();
            });

            this._page.ChkToggleOff.AddEventListener(Events.InputViewEvents.Changed, (e) => {
                this.ApplyToEntity();
            });

            this._page.DeleteButton.AddEventListener(ButtonEvents.SingleClick, async (e) => {
                if (!this._control)
                    return;

                const res = await Popup.Confirm.OpenAsync({
                    Message: 'Button will be removed.<br/>Are you ok?'
                });

                if (res !== true)
                    return;

                const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                ctr.RemoveControl(this._control);

                this._control = null;
                this._controlSet = null;
                this.HideModal();
            });
        }

        public SetEntity(control: Control, controlSet: ControlSet): void {
            // ApplyToEntityを回避するため、一旦nullセット。
            this._control = null;
            this._controlSet = null;

            this._page.TxtName.Value = control.Name;
            this._page.BtnIcon.ImageSrc = control.IconUrl;

            this._page.BtnColor.Color = control.Color;
            this._page.BtnColor.BackgroundColor = control.Color;
            this._page.BtnColor.HoverColor = Color.GetButtonHoverColor(control.Color);

            this._page.ChkToggleOn.BoolValue = control.IsAssignToggleOn;
            this._page.ChkToggleOff.BoolValue = control.IsAssignToggleOff;

            switch (controlSet.OperationType) {
                case OperationType.RemoteControl:
                    this._page.LblCode.Text = 'Code';

                    this._page.TarCode.Show(0);
                    this._page.TxtMac.Hide(0);
                    this._page.SboRemote.Hide(0);
                    this._page.BtnLearn.Show(0);

                    this._page.TarCode.Value = control.Code;

                    break;
                case OperationType.BroadlinkDevice:
                    this._page.LblCode.Text = 'Code';

                    this._page.TarCode.Show(0);
                    this._page.TxtMac.Hide(0);
                    this._page.SboRemote.Hide(0);
                    this._page.BtnLearn.Show(0);

                    break;
                case OperationType.WakeOnLan:
                    this._page.LblCode.Text = 'MAC Address';

                    this._page.TarCode.Hide(0);
                    this._page.TxtMac.Show(0);
                    this._page.SboRemote.Hide(0);
                    this._page.BtnLearn.Hide(0);

                    this._page.TxtMac.Value = control.Code;

                    break;
                case OperationType.Script:
                    this._page.LblCode.Text = 'Commands';

                    this._page.TarCode.Show(0);
                    this._page.TxtMac.Hide(0);
                    this._page.SboRemote.Hide(0);
                    this._page.BtnLearn.Hide(0);

                    this._page.TarCode.Value = control.Code;

                    break;
                case OperationType.RemoteHostScript:
                    this._page.LblCode.Text = 'Remote Script';

                    this._page.TarCode.Hide(0);
                    this._page.TxtMac.Hide(0);
                    this._page.SboRemote.Show(0);
                    this._page.BtnLearn.Hide(0);

                    this._page.SboRemote.ClearItems();
                    _.each(Stores.Remotes.List, (e: Script) => {
                        this._page.SboRemote.AddItem(e.Name, String(e.Id));
                    });

                    if (!control.Code || control.Code === '') {
                        this._page.SboRemote.Value = '';
                    } else {
                        const currentId = Stores.Remotes.GetIdByJson(control.Code);
                        this._page.SboRemote.Value = (currentId)
                            ? String(currentId)
                            : '';
                    }

                    break;
                case OperationType.Scene:
                default:
                    alert('ここにはこないはず');
                    throw new Error('なんでやねん！');
            }

            this._control = control;
            this._controlSet = controlSet;
        }

        public ApplyToEntity(): void {
            if (!this._control || !this._controlSet)
                return;

            let changed = false;

            if (this._control.Name !== this._page.TxtName.Value) {
                this._control.Name = this._page.TxtName.Value;
                changed = true;
            }

            if (this._control.IconUrl !== this._page.BtnIcon.ImageSrc) {
                this._control.IconUrl = this._page.BtnIcon.ImageSrc;
                changed = true;
            }

            if (this._control.Color !== this._page.BtnColor.Color) {
                this._control.Color = this._page.BtnColor.Color;
                changed = true;
            }

            if (this._control.IsAssignToggleOn !== this._page.ChkToggleOn.BoolValue) {
                this._control.IsAssignToggleOn = this._page.ChkToggleOn.BoolValue;
                const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                ctr.ResetToggleAssign(this._control, true);
                changed = true;
            }

            if (this._control.IsAssignToggleOff !== this._page.ChkToggleOff.BoolValue) {
                this._control.IsAssignToggleOff = this._page.ChkToggleOff.BoolValue;
                const ctr = this.Manager.Get('ControlSet') as ControlSetController;
                ctr.ResetToggleAssign(this._control, false);
                changed = true;
            }

            switch (this._controlSet.OperationType) {
                case OperationType.RemoteControl:

                    if (this._control.Code !== this._page.TarCode.Value) {
                        this._control.Code = this._page.TarCode.Value;
                        changed = true;
                    }

                    break;
                case OperationType.BroadlinkDevice:
                    break;
                case OperationType.WakeOnLan:

                    if (this._control.Code !== this._page.TxtMac.Value) {
                        this._control.Code = this._page.TxtMac.Value;
                        changed = true;
                    }

                    break;
                case OperationType.Script:

                    if (this._control.Code !== this._page.TarCode.Value) {
                        this._control.Code = this._page.TarCode.Value;
                        changed = true;
                    }

                    break;
                case OperationType.RemoteHostScript:

                    const newId = (!this._page.SboRemote.Value || this._page.SboRemote.Value === '')
                        ? null
                        : Stores.Remotes.List[parseInt(this._page.SboRemote.Value, 10)].Id;
                    const currentId = Stores.Remotes.GetIdByJson(this._control.Code);

                    if (newId !== currentId) {
                        if (!newId) {
                            this._control.Code = '';
                        } else {
                            const entity = Stores.Remotes.List[newId];
                            const objCode = {
                                ControlId: entity.ControlId,
                                Name: entity.Name,
                                RemoteHostId: entity.RemoteHostId
                            };
                            this._control.Code = JSON.stringify(objCode);
                        }
                        changed = true;
                    }

                    break;
                case OperationType.Scene:
                default:
                    alert('ここにはこないはず');
                    throw new Error('なんでやねん！');
            }

            if (changed)
                this._control.DispatchChanged();
        }
    }
}
