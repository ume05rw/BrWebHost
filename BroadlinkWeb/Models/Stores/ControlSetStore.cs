using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink;
using SharpBroadlink.Devices;

namespace BroadlinkWeb.Models.Stores
{
    public class ControlSetStore
    {
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
                    this._dbc.ControlSets.Add(cset);

                    changed = true;
                }
                catch (Exception ex)
                {
                    Xb.Util.Out(ex);
                }
            }

            if (changed)
                await this._dbc.SaveChangesAsync();

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

            // 実装するぞ実装するぞ実装するぞ
            var a = 1;
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
    }
}
