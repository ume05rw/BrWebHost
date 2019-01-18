using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BrWebHost.Models;
using BrWebHost.Models.Entities;
using BrWebHost.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BrWebHost.Areas.Api.Controllers
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
    }
}
