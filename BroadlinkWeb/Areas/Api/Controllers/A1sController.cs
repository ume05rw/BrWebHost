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
        private BrDeviceStore _brdStore;
        private A1Store _a1Store;

        public A1sController(
            Dbc dbc,
            BrDeviceStore brdStore,
            A1Store a1Store
        )
        {
            Xb.Util.Out("A1Controller.Constructor");

            this._dbc = dbc;
            this._brdStore = brdStore;
            this._a1Store = a1Store;
        }

        // GET: api/A1s/5
        [HttpGet("{id?}")] // <- nullableのとき、ここにも?が必要。
        public async Task<XhrResult> GetA1SensorValues([FromRoute] int? id)
        {
            Xb.Util.Out("A1Controller.GetA1SensorValues");
            
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            if (id == null)
                return XhrResult.CreateError("Entity Not Found");

            try
            {
                var result = await this._a1Store.GetValues((int)id);

                return XhrResult.CreateSucceeded(result);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex.Message);
            }
        }

        // Post: api/A1s/GetHourly/5
        [HttpPost("GetHourly/{id?}")] // <- nullableのとき、ここにも?が必要。
        public async Task<XhrResult> GetHourly(
            [FromRoute] int? id,
            [FromBody] DateTimeRange range
        ) {
            Xb.Util.Out("A1Controller.GetHourly");

            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            if (id == null)
                return XhrResult.CreateError("Entity Not Found");

            try
            {
                var result = await this._a1Store.GetHourly((int)id, range);

                return XhrResult.CreateSucceeded(result);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex.Message);
            }
        }

        // Post: api/A1s/GetDaily/5
        [HttpPost("GetDaily/{id?}")] // <- nullableのとき、ここにも?が必要。
        public async Task<XhrResult> GetDaily(
            [FromRoute] int? id,
            [FromBody] DateTimeRange range
        )
        {
            Xb.Util.Out("A1Controller.GetDaily");

            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            if (id == null)
                return XhrResult.CreateError("Entity Not Found");

            try
            {
                var result = await this._a1Store.GetDaily((int)id, range);

                return XhrResult.CreateSucceeded(result);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex.Message);
            }
        }
    }
}
