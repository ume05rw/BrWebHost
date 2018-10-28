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
    [Route("api/A1s")]
    public class A1sController : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _store;

        public A1sController(
            Dbc dbc,
            BrDeviceStore brDeviceStore
        )
        {
            Xb.Util.Out("A1Controller.Constructor");

            this._dbc = dbc;
            this._store = brDeviceStore;
        }

        // GET: api/A1s/5
        [HttpGet("{id?}")] // <- nullableのとき、ここにも?が必要。
        public async Task<XhrResult> GetA1SensorValues([FromRoute] int? id)
        {
            Xb.Util.Out("A1Controller.GetA1SensorValues");
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
                else if (entity.SbDevice.DeviceType != DeviceType.A1)
                    return XhrResult.CreateError("Device is not A1 Sensor");

                var a1Dev = (A1)entity.SbDevice;
                var a1Res = await a1Dev.CheckSensorsRaw();

                var result = new A1Values()
                {
                    Temperature = a1Res.Temperature,
                    Humidity = a1Res.Humidity,
                    Voc = a1Res.AirQuality,
                    Light = a1Res.Light,
                    Noise = a1Res.Noise
                };

                return XhrResult.CreateSucceeded(result);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
