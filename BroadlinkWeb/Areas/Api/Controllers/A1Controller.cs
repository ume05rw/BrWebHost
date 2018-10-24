using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using SharpBroadlink.Devices;
using System.Linq;
// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/A1")]
    public class A1Controller : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _store;

        public A1Controller(Dbc dbc)
        {
            Xb.Util.Out("A1Controller.Constructor");

            this._dbc = dbc;
            this._store = BrDeviceStore.GetInstance(dbc);
        }

        // GET: api/BrDevices/5
        [HttpGet("GetA1SensorValues/{id?}")] // <- nullableのとき、ここにも?が必要。
        public XhrResult GetA1SensorValues([FromRoute] int? id)
        {
            Xb.Util.Out("A1Controller.GetA1SensorValues");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (id == null)
                    return XhrResult.CreateError("Entity Not Found");

                var entity = this._store.Get((int)id);

                if (entity == null)
                    return XhrResult.CreateError("Entity Not Found");
                else if (!entity.IsActive)
                    return XhrResult.CreateError("Device is not Active");
                else if (entity.SbDevice.DeviceType != DeviceType.A1)
                    return XhrResult.CreateError("Device is not A1 Sensor");

                var a1Dev = (A1)entity.SbDevice;

                var result = a1Dev.CheckSensorsRaw()
                    .GetAwaiter()
                    .GetResult();

                return XhrResult.CreateSucceeded(result);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
