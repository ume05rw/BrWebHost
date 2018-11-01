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
        public async Task<XhrResult> GetHostname()
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
                var result = new List<Script>();

                foreach (var remote in remotes)
                {
                    // ローカルIPのとき、スキップ。
                    var addrBytes = IPAddress.Parse(remote.IpAddressString).GetAddressBytes();
                    if (localAddrs.Any(la => la.SequenceEqual(addrBytes)))
                        continue;

                    var url = $"http://{remote.IpAddressString}:{BroadlinkWeb.Program.Port}/api/Scripts/";
                    var client = new HttpClient();
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json")
                    );
                    client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

                    // POSTのとき
                    //var content = new StringContent("");
                    //var response = await client.PostAsync(url, content);

                    // GETのとき
                    HttpResponseMessage response;
                    try
                    {
                        response = await client.GetAsync(url);
                    }
                    catch (Exception ex)
                    {
                        // リモートから応答が無いとき、スキップする。
                        //return XhrResult.CreateError("Remote Host No-Response");
                        continue;
                    }
                    
                    var json = await response.Content.ReadAsStringAsync();
                    var remoteResult = JsonConvert.DeserializeObject<XhrResult.Items>(json);
                    if (remoteResult.Succeeded)
                    {
                        var jarray = (JArray)remoteResult.Values;
                        var scripts = jarray
                            .Select(o => new Script
                            {
                                ControlId = (int)o["ControlId"],
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
