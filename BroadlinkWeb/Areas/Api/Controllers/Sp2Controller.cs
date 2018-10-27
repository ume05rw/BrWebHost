using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using SharpBroadlink.Devices;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Sp2")]
    public class Sp2Controller : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _store;

        public Sp2Controller(
            Dbc dbc,
            BrDeviceStore brDeviceStore
        )
        {
            Xb.Util.Out("A1Controller.Constructor");

            this._dbc = dbc;
            this._store = brDeviceStore;
        }

        // GET: api/Sp2/5
        [HttpGet("{id?}")]
        public async Task<XhrResult> GetSp2Status([FromRoute] int? id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (id == null)
                    return XhrResult.CreateError("Entity Not Found");

                var entity = await this._store.Get((int)id);

                if (entity == null)
                    return XhrResult.CreateError("Entity Not Found");
                else if (!entity.IsActive)
                    return XhrResult.CreateError("Device is not Active");
                else if (entity.SbDevice.DeviceType != DeviceType.Sp2)
                    return XhrResult.CreateError("Device is not SP2 Sensor");

                var sp2Dev = (Sp2)entity.SbDevice;
                var sp2Status = await sp2Dev.CheckStatus();

                var result = new Sp2Status()
                {
                    Power = sp2Status.Power,
                    NightLight = sp2Status.NightLight
                };

                return XhrResult.CreateSucceeded(result);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: api/Sp2/5
        [HttpPost("{id?}")]
        public async Task<XhrResult> SetSp2Status([FromRoute] int? id, [FromBody] Sp2Status sp2Status)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (id == null)
                    return XhrResult.CreateError("Entity Not Found");

                var entity = await this._store.Get((int)id);

                if (entity == null)
                    return XhrResult.CreateError("Entity Not Found");
                else if (!entity.IsActive)
                    return XhrResult.CreateError("Device is not Active");
                else if (entity.SbDevice.DeviceType != DeviceType.Sp2)
                    return XhrResult.CreateError("Device is not SP2 Sensor");


                var sp2Dev = (Sp2)entity.SbDevice;
                var current = await sp2Dev.CheckStatus();

                if (current.Power != sp2Status.Power)
                {
                    var result = await sp2Dev.SetPower(sp2Status.Power);
                    if (!result)
                        return XhrResult.CreateError("Set Power Failure.");
                }

                if (current.NightLight != sp2Status.NightLight)
                {
                    var result = await sp2Dev.SetNightLight(sp2Status.NightLight);
                    if (!result)
                        return XhrResult.CreateError("Set Night-Light Failure.");
                }

                return XhrResult.CreateSucceeded(sp2Status);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
