using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BrWebHost.Models;
using BrWebHost.Models.Entities;
using BrWebHost.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BrWebHost.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Wols")]
    public class WolsController : Controller
    {
        private readonly Dbc _dbc;

        public WolsController(Dbc dbc)
        {
            Xb.Util.Out("WolController.Constructor");

            this._dbc = dbc;
        }

        // POST: /api/Wols/5
        [HttpPost("{controlId?}")]
        public async Task<XhrResult> Exec(
            [FromRoute] int? controlId,
            [FromServices] WolStore wolStore
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
                else if (controlSet.OperationType != OperationType.WakeOnLan)
                    return XhrResult.CreateError("Invalid Request");

                try
                {
                    await wolStore.Exec(control.Code);
                }
                catch (Exception ex)
                {
                    return XhrResult.CreateError(ex.Message);
                }

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
