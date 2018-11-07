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
    [Route("api/Rms")]
    public class RmsController : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _store;

        public RmsController(
            Dbc dbc,
            BrDeviceStore brDeviceStore
        )
        {
            Xb.Util.Out("RmController.Constructor");

            this._dbc = dbc;
            this._store = brDeviceStore;
        }

        // GET: api/Rms/GetLearnedCode/5
        [HttpGet("GetLearnedCode/{id?}")]
        public async Task<XhrResult> GetLearnedCode([FromRoute] int? id)
        {
            Xb.Util.Out("RmController.GetLearnedCode");
            try
            {
                var pair = await this.GetRmDevice(id);
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

        // Post: api/Rms/CancelLearning/5
        [HttpPost("CancelLearning/{id?}")]
        public async Task<XhrResult> CancelLearning([FromRoute] int? id)
        {
            Xb.Util.Out("RmController.GetLearnedCode");
            try
            {
                var pair = await this.GetRmDevice(id);
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="rmCommand"></param>
        /// <returns></returns>
        /// <remarks>
        /// 注)
        /// テスト実行時以外は使用しないこと。
        /// 通常はControlSetController.Exec() にControlSetIDを渡して実行する。
        /// </remarks>
        // Post: api/Rms/Exec/5
        [HttpPost("Exec/{id?}")]
        public async Task<XhrResult> Exec([FromRoute] int? id, [FromBody] RmCommand rmCommand)
        {
            Xb.Util.Out("RmController.Exec");
            try
            {
                var pair = await this.GetRmDevice(id);
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

        private async Task<(BrDevice entity, XhrResult result)> GetRmDevice(int? id)
        {
            Xb.Util.Out("RmController.GetRmDevice");

            if (!ModelState.IsValid)
                return (null, XhrResult.CreateError(ModelState));

            if (id == null)
                return (null, XhrResult.CreateError("Entity Not Found"));

            var entity = await this._store.Get((int)id);

            if (entity == null)
                return (null, XhrResult.CreateError("Entity Not Found"));
            else if (!entity.IsActive)
                return (entity, XhrResult.CreateError("Device is not Active"));
            else if (entity.SbDevice.DeviceType != DeviceType.Rm
                     && entity.SbDevice.DeviceType != DeviceType.Rm2Pro)
                return (entity, XhrResult.CreateError("Device is not Rm"));

            return (entity, null);
        }
    }
}
