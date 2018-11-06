using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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

        // GET: /api/RemoteHosts/GetHostname
        [HttpGet("GetHostname")]
        public XhrResult GetHostname()
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                return XhrResult.CreateSucceeded(System.Environment.MachineName);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: /api/RemoteHosts/
        [HttpGet()]
        public async Task<XhrResult> GetList()
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var localAddrs = new List<byte[]>();
                var locals = Xb.Net.Util.GetLocalAddresses();
                foreach (var addr in locals)
                    localAddrs.Add(addr.GetAddressBytes());

                var remotes = await this._dbc.RemoteHosts.ToArrayAsync();
                var result = this._dbc.RemoteScripts.Select(e => new Script()
                {
                    ControlId = e.ControlId,
                    RemoteHostId = e.RemoteHostId,
                    Name = e.Name
                }).ToArray();

                return XhrResult.CreateSucceeded(result);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: /api/RemoteHosts/
        [HttpPost()]
        public async Task<XhrResult> Exec(
            [FromBody] Script script,
            [FromServices] RemoteHostStore remoteHostStore
        )
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var result = await remoteHostStore.Exec(script);

                if (result.IsSucceeded)
                    return XhrResult.CreateSucceeded(true);
                else
                    return XhrResult.CreateError(result.Result);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
