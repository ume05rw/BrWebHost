using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
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

        // GET: /api/Scripts/
        [HttpGet()]
        public async Task<XhrResult> GetList()
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var remotes = await this._dbc.RemoteHosts.ToArrayAsync();
                var result = new List<Script>();

                foreach (var remote in remotes)
                {
                    var url = $"http://{remote.IpAddressString}:{BroadlinkWeb.Program.Port}/api/Scripts/";
                    var client = new HttpClient();
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json")
                    );
                    client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

                    // POSTのとき
                    //var response = client.PostAsync(url, content);

                    // GETのとき
                    var response = await client.GetAsync(url);
                    var json = await response.Content.ReadAsStringAsync();
                    var remoteResult = JsonConvert.DeserializeObject<XhrResult.Items>(json);
                    if (remoteResult.Succeeded)
                    {
                        var jarray = (JArray)remoteResult.Values;
                        var scripts = jarray
                            .Select(o => new Script
                            {
                                Id = (int)o["Id"],
                                RemoteHostId = remote.Id,
                                Name = $"{remote.Name}[{remote.IpAddressString}] - {(string)o["Name"]}"
                            })
                            .ToArray();
                        result.AddRange(scripts);
                    }
                }

                return XhrResult.CreateSucceeded(result.ToArray());
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: /api/Scripts/
        [HttpPost()]
        public async Task<XhrResult> Exec([FromBody] Script script)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (script == null)
                    return XhrResult.CreateError("Entity Not Found");
                else if (script.RemoteHostId == null)
                    return XhrResult.CreateError("Remote Host Not Specified");

                var remote = await this._dbc.RemoteHosts
                    .SingleOrDefaultAsync(r => r.Id == (int)script.RemoteHostId);

                if (remote == null)
                    return XhrResult.CreateError("Remote Host Not Found");

                var url = $"http://{remote.IpAddressString}:{BroadlinkWeb.Program.Port}/api/Scripts/{script.Id}";
                var client = new HttpClient();
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json")
                );
                client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

                // POSTのとき
                var content = new StringContent("");
                var response = await client.PostAsync(url, content);

                // GETのとき
                //var response = await client.GetAsync(url);

                var json = await response.Content.ReadAsStringAsync();
                var remoteResult = JsonConvert.DeserializeObject<XhrResult.Items>(json);

                if (remoteResult.Succeeded)
                    return XhrResult.CreateSucceeded(true);
                else
                    return XhrResult.CreateError(remoteResult.Errors);

            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
