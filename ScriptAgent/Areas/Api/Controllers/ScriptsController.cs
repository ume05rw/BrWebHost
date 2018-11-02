using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Scripts")]
    public class ScriptsController : Controller
    {
        private readonly Dbc _dbc;

        public ScriptsController(Dbc dbc)
        {
            Xb.Util.Out("ScriptsController.Constructor");

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

                var csets = await this._dbc.ControlSets
                    .Include(c => c.Controls)
                    .Where(e => e.OperationType == OperationType.Script)
                    .ToArrayAsync();

                var result = new List<Script>();

                foreach (var cset in csets)
                {
                    foreach (var control in cset.Controls)
                    {
                        var detailName = string.IsNullOrEmpty(control.Name)
                            ? " - " + control.Name
                            : "";
                        result.Add(new Script()
                        {
                            ControlId = control.Id,
                            Name = $"{cset.Name}{detailName}",
                            RemoteHostId = null
                        });
                    }
                }

                return XhrResult.CreateSucceeded(result.ToArray());
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: /api/Scripts/5
        [HttpPost("{controlId?}")]
        public async Task<XhrResult> Exec(
            [FromRoute] int? controlId,
            [FromServices] ScriptStore scriptStore
        )
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (controlId == null)
                    return XhrResult.CreateError("Entity Not Found");

                var control = await this._dbc.Controls
                    .SingleOrDefaultAsync(e => e.Id == controlId);

                if (control == null)
                    return XhrResult.CreateError("Entity Not Found");
                else if (control.Code == null || string.IsNullOrEmpty(control.Code))
                    return XhrResult.CreateError("Code Not Found");

                var controlSet = await this._dbc.ControlSets
                    .SingleOrDefaultAsync(e => e.Id == control.ControlSetId);

                if (controlSet == null)
                    return XhrResult.CreateError("Invalid Entity");
                else if (controlSet.OperationType != OperationType.Script)
                    return XhrResult.CreateError("Invalid Request");

                var res = await scriptStore.Exec(control.Code);

                return (res.IsSucceeded)
                    ? XhrResult.CreateSucceeded(res.Result)
                    : XhrResult.CreateError(res.Result, "ConsoleFailure");
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
