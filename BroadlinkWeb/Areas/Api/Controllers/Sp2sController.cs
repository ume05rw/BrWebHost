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
    [Route("api/Sp2s")]
    public class Sp2sController : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _brdStore;
        private Sp2Store _sp2Store;

        public Sp2sController(
            Dbc dbc,
            BrDeviceStore brDeviceStore,
            Sp2Store sp2Store
        )
        {
            Xb.Util.Out("Sp2sController.Constructor");

            this._dbc = dbc;
            this._brdStore = brDeviceStore;
            this._sp2Store = sp2Store;
        }

        // GET: api/Sp2s/5
        [HttpGet("{id?}")]
        public async Task<XhrResult> GetSp2Status([FromRoute] int? id)
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            if (id == null)
                return XhrResult.CreateError("Entity Not Found");

            try
            {
                var status = await this._sp2Store.GetStatus((int)id);

                return XhrResult.CreateSucceeded(status);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex.Message);
            }
        }

        // GET: api/Sp2s/5
        [HttpPost("{id?}")]
        public async Task<XhrResult> SetSp2Status([FromRoute] int? id, [FromBody] Sp2Status sp2Status)
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            if (id == null)
                return XhrResult.CreateError("Entity Not Found");

            try
            {
                await this._sp2Store.SetStatus((int)id, sp2Status);
                return XhrResult.CreateSucceeded(sp2Status);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex.Message);
            }
        }
    }
}
