using System;
using System.Collections.Generic;
using System.Linq;
//using System.ValueTu
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using SharpBroadlink.Devices;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Rm")]
    public class RmController : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _store;

        public RmController(Dbc dbc)
        {
            Xb.Util.Out("RmController.Constructor");

            this._dbc = dbc;
            this._store = BrDeviceStore.GetInstance(dbc);
        }

        // GET: api/Rm/GetLearnedCode/5
        [HttpGet("GetLearnedCode/{id?}")]
        public async Task<XhrResult> GetLearnedCode([FromRoute] int? id)
        {
            Xb.Util.Out("RmController.GetLearnedCode");
            try
            {
                var pair = this.GetRmDevice(id);
                if (pair.result != null)
                    return pair.result;

                var rm = (Rm)pair.entity.SbDevice;

                await rm.EnterLearning();

                var startTime = DateTime.Now;
                byte[] bytes = null;
                while ((DateTime.Now - startTime).TotalSeconds <= 30)
                {
                    var tmpBytes = await rm.CheckData();
                    if (tmpBytes != null && tmpBytes.Length > 0)
                    {
                        bytes = tmpBytes;
                        break;
                    }
                    await Task.Delay(1000);
                }

                if (bytes == null)
                    return XhrResult.CreateError("Learning Fail");

                var pBytes = SharpBroadlink.Signals.Broadlink2Pronto(bytes, 38);
                var pString = SharpBroadlink.Signals.ProntoBytes2String(pBytes);
                var result = new RmCommand();
                result.Code = pString;

                return XhrResult.CreateSucceeded(result);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // Post: api/Rm/CancelLearning/5
        [HttpPost("CancelLearning/{id?}")]
        public async Task<XhrResult> CancelLearning([FromRoute] int? id)
        {
            Xb.Util.Out("RmController.GetLearnedCode");
            try
            {
                var pair = this.GetRmDevice(id);
                if (pair.result != null)
                    return pair.result;

                var rm = (Rm)pair.entity.SbDevice;
                var result = await rm.CancelLearning();

                return (result)
                    ? XhrResult.CreateSucceeded(true)
                    : XhrResult.CreateError("Failed to Cancel");
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // Post: api/Rm/Exec/5
        [HttpPost("Exec/{id?}")]
        public async Task<XhrResult> Exec([FromRoute] int? id, [FromBody] RmCommand rmCommand)
        {
            Xb.Util.Out("RmController.GetLearnedCode");
            try
            {
                var pair = this.GetRmDevice(id);
                if (pair.result != null)
                    return pair.result;

                var rm = (Rm)pair.entity.SbDevice;

                var pBytes = SharpBroadlink.Signals.String2ProntoBytes(rmCommand.Code);
                var result = await rm.SendPronto(pBytes);

                return (result)
                    ? XhrResult.CreateSucceeded(true)
                    : XhrResult.CreateError("Failed to Send");
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        private (BrDevice entity, XhrResult result) GetRmDevice(int? id)
        {
            Xb.Util.Out("RmController.GetLearnedCode");

            if (!ModelState.IsValid)
                return (null, XhrResult.CreateError(ModelState));

            if (id == null)
                return (null, XhrResult.CreateError("Entity Not Found"));

            var entity = this._store.Get((int)id);

            if (entity == null)
                return (null, XhrResult.CreateError("Entity Not Found"));
            else if (!entity.IsActive)
                return (entity, XhrResult.CreateError("Device is not Active"));
            else if (entity.SbDevice.DeviceType != SharpBroadlink.Devices.DeviceType.Rm)
                return (entity, XhrResult.CreateError("Device is not Rm"));

            return (entity, null);
        }
    }
}
