using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SharpBroadlink;
using SharpBroadlink.Devices;

namespace BroadlinkWeb.Models.Stores
{
    public class ControlSetStore
    {
        private static IServiceProvider Provider;
        public static void SetServiceProvider(IServiceProvider provider)
        {
            ControlSetStore.Provider = provider;
        }
        public static void ReleaseServiceProvider()
        {
            ControlSetStore.Provider = null;
        }

        private Dbc _dbc;

        public ControlSetStore(
            [FromServices] Dbc dbc
        )
        {
            Xb.Util.Out("ControlSetStore.Constructor");
            this._dbc = dbc;
        }

        public async Task<bool> EnsureBrControlSets(IEnumerable<BrDevice> brDevices)
        {
            Xb.Util.Out("ControlSetStore.EnsureBrControlSets");

            // Broadlinkデバイス自体を示すControlSetを取得
            var brCss = await this._dbc.ControlSets
                .Where(cs => !cs.IsTemplate && cs.OperationType == OperationType.BroadlinkDevice)
                .ToArrayAsync();

            var changed = false;
            var count = 0;
            foreach (var brd in brDevices)
            {
                try
                {
                    // 自身を示すControlSetを取得
                    var brcs = brCss.FirstOrDefault(b => b.BrDeviceId == brd.Id);
                    // 既にControlSet登録済みなら、なにもしない。
                    if (brcs != null)
                        continue;

                    // 自身を示すControlSetを生成する。
                    ControlSet cset = null;

                    if (brd.SbDevice is Rm2Pro)
                        cset = await this.EnsureControlSetRm2Pro();
                    else if (brd.SbDevice is Rm)
                        cset = await this.EnsureControlSetRm();
                    else if (brd.SbDevice is A1)
                        cset = await this.EnsureControlSetA1();
                    else if (brd.SbDevice is Sp1)
                        cset = await this.EnsureControlSetSp1();
                    else if (brd.SbDevice is Sp2)
                        cset = await this.EnsureControlSetSp2();
                    else if (brd.SbDevice is S1c)
                        cset = await this.EnsureControlSetS1c();
                    //else if (brd.SbDevice is Sc1)
                    //    cset = await this.EnsureControlSetSc1();
                    else if (brd.SbDevice is Dooya)
                        cset = await this.EnsureControlSetDooya();
                    else if (brd.SbDevice is Hysen)
                        cset = await this.EnsureControlSetHysen();
                    else if (brd.SbDevice is Mp1)
                        cset = await this.EnsureControlSetMp1();
                    else
                        cset = await this.EnsureControlSetAny();

                    cset.OperationType = OperationType.BroadlinkDevice;
                    cset.BrDeviceId = brd.Id;

                    // EntityをDbcに追加
                    Xb.Util.Out($"ControlSetStore.EnsureBrControlSets - Add new ControlSet {cset.Name} - {brd.DeviceType}[{brd.IpAddressString}]");
                    this._dbc.ControlSets.Add(cset);

                    changed = true;
                    count++;
                }
                catch (Exception ex)
                {
                    Xb.Util.Out(ex);
                }
            }

            if (changed)
            {
                Xb.Util.Out($"ControlSetStore.EnsureBrControlSets - Found {count} Device");
                await this._dbc.SaveChangesAsync();
            }
            else
            {
                Xb.Util.Out($"ControlSetStore.EnsureBrControlSets - Already Ensured");
            }

            return true;
        }

        private async Task<ControlSet> EnsureControlSetRm2Pro()
        {
            var cset = await this.GetNewByTemplate(Template.SingleControl);
            cset.Controls[0].Name = "Temp.";

            cset.Name = "Rm2Pro";
            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = false;
            cset.IsTogglable = false;

            return cset;
        }


        private async Task<ControlSet> EnsureControlSetRm()
        {
            var cset = await this.GetNewByTemplate(Template.NoControl);

            cset.Name = "Rm";
            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = false;
            cset.IsTogglable = false;

            return cset;
        }

        private async Task<ControlSet> EnsureControlSetA1()
        {
            var cset = await this.GetNewByTemplate(Template.A1Sensor);
            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = true;
            cset.IsTogglable = false;

            return cset;
        }

        private async Task<ControlSet> EnsureControlSetSp1()
        {
            var cset = await this.GetNewByTemplate(Template.Sp1Switch);

            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = false;
            cset.IsTogglable = true;

            return cset;
        }

        private async Task<ControlSet> EnsureControlSetSp2()
        {
            var cset = await this.GetNewByTemplate(Template.Sp2Switch);
            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = true;
            cset.IsTogglable = true;

            return cset;
        }

        private async Task<ControlSet> EnsureControlSetS1c()
        {
            var cset = await this.GetNewByTemplate(Template.NoControl);

            cset.Name = "S1C";
            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = false;
            cset.IsTogglable = false;

            // TODO: 実装するぞ実装するぞ実装するぞ
            //var a = 1;
            // 実装するぞ実装するぞ実装するぞ...

            return cset;
        }

        //private async Task<ControlSet> EnsureControlSetSc1()
        //{
        //    return true;
        //}

        private async Task<ControlSet> EnsureControlSetDooya()
        {
            // Dooyaカーテンほしいれす(^q^
            var cset = await this.EnsureControlSetAny();
            cset.Name = "Dooya";
            return cset;
        }

        private async Task<ControlSet> EnsureControlSetHysen()
        {
            // Hysenコントローラほしいれす(^q^
            var cset = await this.EnsureControlSetAny();
            cset.Name = "Hysen";
            return cset;
        }

        private async Task<ControlSet> EnsureControlSetMp1()
        {
            // Mp1マルチタップほしいれす(^q^
            var cset = await this.EnsureControlSetAny();
            cset.Name = "MP1";
            return cset;
        }

        private async Task<ControlSet> EnsureControlSetAny()
        {
            // なんか知らんデバイス
            var cset = await this.GetNewByTemplate(Template.NoControl);

            cset.Name = "";
            cset.OperationType = OperationType.BroadlinkDevice;
            cset.IsMainPanelReady = false;
            cset.IsTogglable = false;
            return cset;
        }


        private async Task<ControlSet> GetNewByTemplate(Template template)
        {
            var tplCset = await this._dbc.ControlSets
                .Include(c => c.Controls)
                .Where(c => (c.Id == (int)template))
                .FirstOrDefaultAsync();

            var cset = new ControlSet();
            cset.Name = tplCset.Name;
            cset.BrDeviceId = tplCset.BrDeviceId;
            cset.IconUrl = tplCset.IconUrl;
            cset.Color = tplCset.Color;
            cset.Order = tplCset.Order;
            cset.ToggleState = tplCset.ToggleState;
            cset.IsMainPanelReady = tplCset.IsMainPanelReady;
            cset.IsTogglable = tplCset.IsTogglable;
            cset.OperationType = tplCset.OperationType;
            cset.IsTemplate = false;
            cset.Controls = new List<Control>();

            foreach (var tplControl in tplCset.Controls)
            {
                var control = new Control();
                control.ControlSetId = cset.Id;
                control.Name = tplControl.Name;
                control.PositionLeft = tplControl.PositionLeft;
                control.PositionTop = tplControl.PositionTop;
                control.Color = tplControl.Color;
                control.IconUrl = tplControl.IconUrl;
                control.Code = tplControl.Code;
                control.IsAssignToggleOn = tplControl.IsAssignToggleOn;
                control.IsAssignToggleOff = tplControl.IsAssignToggleOff;
                cset.Controls.Add(control);
            }

            return cset;
        }


        public async Task<Error[]> Exec(Control control)
        {
            var errors = new List<Error>();

            if (control == null)
            {
                errors.Add(new Error()
                {
                    Name = "ControlId",
                    Message = "ControlSetStore.Exec: Control Not Found."
                });
                return errors.ToArray();
            }

            var controlSet = await this._dbc.ControlSets
                .SingleOrDefaultAsync(e => e.Id == control.ControlSetId);

            if (controlSet == null)
            {
                errors.Add(new Error()
                {
                    Name = "ControlSetId",
                    Message = $"ControlSetStore.Exec: ControlSet Not Found[{control.ControlSetId}]"
                });
                return errors.ToArray();
            }

            using (var serviceScope = ControlSetStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                switch (controlSet.OperationType)
                {
                    case OperationType.RemoteControl:
                        try
                        {
                            var device = await this.GetBrDevice(controlSet.BrDeviceId);
                            if (device == null)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "BrDeviceId",
                                    Message = $"ControlSetStore.Exec[RemoteControl]: Broadlink Device Not Found[{controlSet.BrDeviceId}]"
                                });
                                break;
                            }

                            var rm = (Rm)device.SbDevice;
                            var pBytes = Signals.String2ProntoBytes(control.Code);
                            var result = await rm.SendPronto(pBytes);

                            if (result == false)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "Code",
                                    Message = "ControlSetStore.Exec[RemoteControl]: Code Exec Failure."
                                });
                                break;
                            }
                        }
                        catch (Exception ex)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Code",
                                Message = $"ControlSetStore.Exec[RemoteControl]: {ex.Message} / {ex.StackTrace}"
                            });
                            break;
                        }
                        break;
                    case OperationType.BroadlinkDevice:
                        try
                        {
                            var device = await this.GetBrDevice(controlSet.BrDeviceId);
                            if (device == null)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "BrDeviceId",
                                    Message = $"ControlSetStore.Exec[BroadlinkDevice]: Broadlink Device Not Found[{controlSet.BrDeviceId}]"
                                });
                                break;
                            }

                            var brErrors = await this.ExecBrDevice(control, device);
                            if (brErrors.Length > 0)
                            {
                                errors.AddRange(brErrors);
                                break;
                            }
                        }
                        catch (Exception ex)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Unexpected",
                                Message = $"ControlSetStore.Exec[BroadlinkDevice]: {ex.Message} / {ex.StackTrace}"
                            });
                            break;
                        }

                        break;
                    case OperationType.WakeOnLan:
                        try
                        {
                            var wolStore = serviceScope.ServiceProvider.GetService<WolStore>();
                            var res = await wolStore.Exec(control.Code);
                            if (res == false)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "Code",
                                    Message = "Broadlink Device Not Found."
                                });
                                break;
                            }
                        }
                        catch (Exception ex)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Unexpected",
                                Message = $"ControlSetStore.Exec[WakeOnLan]: {ex.Message} / {ex.StackTrace}"
                            });
                            break;
                        }

                        break;
                    case OperationType.Script:
                        try
                        {
                            var scriptStore = serviceScope.ServiceProvider.GetService<ScriptStore>();
                            var res = await scriptStore.Exec(control.Code);
                            if (!res.IsSucceeded)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "Code",
                                    Message = $"ControlSetStore.Exec[WakeOnLan]: {res.Result}"
                                });
                                break;
                            }
                        }
                        catch (Exception ex)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Unexpected",
                                Message = $"ControlSetStore.Exec[Script]: {ex.Message} / {ex.StackTrace}"
                            });
                            break;
                        }

                        break;
                    case OperationType.RemoteHost:
                        try
                        {
                            var rhStore = serviceScope.ServiceProvider.GetService<RemoteHostStore>();
                            Script script;
                            try
                            {
                                script = JsonConvert.DeserializeObject<Script>(control.Code);
                            }
                            catch (Exception)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "Code",
                                    Message = "ControlSetStore.Exec[RemoteHost]: Remote Script Not Recognize."
                                });
                                break;
                            }

                            var res = await rhStore.Exec(script);
                            if (!res.IsSucceeded)
                            {
                                errors.Add(new Error()
                                {
                                    Name = "Code",
                                    Message = $"ControlSetStore.Exec[RemoteHost]: {res.Result}"
                                });
                                break;
                            }
                        }
                        catch (Exception ex)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Unexpected",
                                Message = $"ControlSetStore.Exec[RemoteHost]: {ex.Message} / {ex.StackTrace}"
                            });
                            break;
                        }
                        break;
                    case OperationType.Scene:
                    default:
                        // ここにはこないはず。
                        throw new Exception("なんでやー");
                }


                if (
                    errors.Count <= 0
                    && (control.IsAssignToggleOn
                        || control.IsAssignToggleOff)
                )
                {
                    var isChanged = false;

                    if (control.IsAssignToggleOn
                        && control.IsAssignToggleOff
                    )
                    {
                        // トグルOn/Off両方アサインされているとき
                        // 何もしない。
                    }
                    else if (control.IsAssignToggleOn)
                    {
                        // トグルOnのみアサインされているとき
                        isChanged = true;
                        controlSet.ToggleState = true;
                    }
                    else if (control.IsAssignToggleOff)
                    {
                        // トグルOffのみアサインされているとき
                        isChanged = true;
                        controlSet.ToggleState = false;
                    }
                    else
                    {
                        // ここには来ないはず。
                        throw new Exception("なんでやー");
                    }

                    if (isChanged)
                    {
                        var dbc = serviceScope.ServiceProvider.GetService<Dbc>();
                        dbc.Entry(controlSet).State = EntityState.Modified;
                        await dbc.SaveChangesAsync();
                    }
                }
            }

            return errors.ToArray();
        }

        private async Task<Error[]> ExecBrDevice(Control control, BrDevice device)
        {
            var errors = new List<Error>();
            using (var serviceScope = ControlSetStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                switch (device.DeviceType)
                {
                    case DeviceType.Sp2:
                        var sp2Store = serviceScope.ServiceProvider.GetService<Sp2Store>();
                        var sp2Status = await sp2Store.GetStatus(device.Id);

                        switch (control.Code)
                        {
                            case "PowerOn":
                                sp2Status.Power = true;
                                break;
                            case "PowerOff":
                                sp2Status.Power = false;
                                break;
                            case "LightOn":
                                sp2Status.NightLight = true;
                                break;
                            case "LightOff":
                                sp2Status.NightLight = false;
                                break;
                            default:
                                throw new Exception("ここにはこないはず");
                        }

                        var res = await sp2Store.SetStatus(device.Id, sp2Status);
                        if (res == false)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Code",
                                Message = "ControlSetStore.ExecBrDevice[Sp2]: Sp2 Switch Set Failure."
                            });
                            break;
                        }

                        break;
                    case DeviceType.A1:
                        var a1Store = serviceScope.ServiceProvider.GetService<A1Store>();

                        try
                        {
                            // 値を取得して何をするでもない。
                            await a1Store.GetValues(device.Id);
                        }
                        catch (Exception ex)
                        {
                            errors.Add(new Error()
                            {
                                Name = "Code",
                                Message = "ControlSetStore.ExecBrDevice[A1]: A1 Sensor Get Value Failure: " + ex.Message
                            });
                            break;
                        }

                        break;
                    case DeviceType.S1c:
                    case DeviceType.Sp1:
                    case DeviceType.Rm:
                    case DeviceType.Rm2Pro:
                    case DeviceType.Dooya:
                    case DeviceType.Hysen:
                    case DeviceType.Mp1:
                    case DeviceType.Unknown:
                    default:
                        break;
                }
            }

            return errors.ToArray();
        }

        private async Task<BrDevice> GetBrDevice(int? id)
        {
            using (var serviceScope = ControlSetStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var brStore = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                return await brStore.Get((int)id);
            }
        }
    }
}
