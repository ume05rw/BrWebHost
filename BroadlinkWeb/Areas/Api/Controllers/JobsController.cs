using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink.Devices;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Jobs")]
    public class JobsController : Controller
    {
        private readonly Dbc _dbc;
        private JobStore _store;


        public JobsController(
            Dbc dbc,
            JobStore store
        )
        {
            Xb.Util.Out("JobsController.Constructor");

            this._dbc = dbc;
            this._store = store;
        }

        // GET: api/Jobs/5
        [HttpGet("{id?}")] // <- nullableのとき、ここにも?が必要。
        public async Task<XhrResult> GetJob([FromRoute] int? id)
        {
            Xb.Util.Out("JobsController.GetJob");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (id == null)
                    return XhrResult.CreateError("Entity Not Found");

                var entity = await this._dbc.Jobs.SingleOrDefaultAsync(e => e.Id == id);

                if (entity == null)
                    return XhrResult.CreateError("Entity Not Found");

                return XhrResult.CreateSucceeded(entity);
            }
            catch (System.Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
