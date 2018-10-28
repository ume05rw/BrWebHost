using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/RemoteHosts")]
    public class RemoteHostsController : Controller
    {
        private readonly Dbc _dbc;

        public RemoteHostsController(Dbc dbc)
        {
            Xb.Util.Out("RemoteHostsController.Constructor");

            this._dbc = dbc;
        }

        // GET: /api/Scripts/
        [HttpGet()]
        public async Task<XhrResult> GetList()
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var remotes = await this._dbc.RemoteHosts.ToArrayAsync();




                return XhrResult.CreateSucceeded(null);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
