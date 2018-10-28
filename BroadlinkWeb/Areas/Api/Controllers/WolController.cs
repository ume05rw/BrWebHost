using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Wol")]
    public class WolController : Controller
    {
        private readonly Dbc _dbc;

        public WolController(Dbc dbc)
        {
            Xb.Util.Out("WolController.Constructor");

            this._dbc = dbc;
        }

        // POST: /api/Wol/5
        [HttpPost("{controlId?}")]
        public async Task<XhrResult> Exec([FromRoute] int? controlId)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (controlId == null)
                    return XhrResult.CreateError("Entity Not Found");

                var control = await this._dbc.Controls
                    .SingleOrDefaultAsync(e => e.Id == controlId);

                if (control == null)
                    return XhrResult.CreateError("Entity Not Found");
                else if (control.Code == null || string.IsNullOrEmpty(control.Code))
                    return XhrResult.CreateError("Code Not Found");

                var controlSet = await this._dbc.ControlSets
                    .SingleOrDefaultAsync(e => e.Id == control.ControlSetId);

                if (controlSet == null)
                    return XhrResult.CreateError("Invalid Entity");
                else if (controlSet.OperationType != OperationType.WakeOnLan)
                    return XhrResult.CreateError("Invalid Request");

                var mac = control.Code
                    .Replace("\r\n", "\n")
                    .Replace("\r", "\n")
                    .Replace("::", "-")
                    .Replace(":", "-")
                    .Split('\n')[0].Trim();

                var bStrs = mac.Split("-");
                var macBytes = new List<byte>();
                try
                {
                    foreach (var str in bStrs)
                        macBytes.Add(Convert.ToByte(str, 16));
                }
                catch (Exception)
                {
                    return XhrResult.CreateError("Invalid Hex String");
                }

                if (macBytes.Count != 6)
                    return XhrResult.CreateError("Invalid Mac-Address Format");

                var bytes = new List<byte>();

                // 先頭6バイトをFFに
                for (var i = 0; i < 6; i++)
                    bytes.Add((byte)255);

                // 以降、MACアドレスを16回繰り返す。
                for (var i = 0; i < 16; i++)
                {
                    foreach (var b in macBytes)
                        bytes.Add(b);
                }

                // UDP7番ポート
                await Xb.Net.Udp.SendOnceAsync(bytes.ToArray(), IPAddress.Broadcast, 7);

                // UDP9番ポート
                await Xb.Net.Udp.SendOnceAsync(bytes.ToArray(), IPAddress.Broadcast, 9);

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
