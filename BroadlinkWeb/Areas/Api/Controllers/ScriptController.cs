using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Script")]
    public class ScriptController : Controller
    {
        private readonly Dbc _dbc;

        public ScriptController(Dbc dbc)
        {
            Xb.Util.Out("A1Controller.Constructor");

            this._dbc = dbc;
        }

        // GET: /<controller>/
        [HttpPost("{controlId?}")]
        public async Task<XhrResult> Exec([FromRoute] int? controlId)
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

                var rows = control.Code
                    .Replace("\r\n", "\n")
                    .Replace("\r", "\n")
                    .Split('\n');

                // 一行ずつ実行、結果取得はしない。
                // UI付きプログラムの場合、プログラム終了まで応答を返さないため。
                foreach (var row in rows)
                    Xb.App.Process.GetConsoleResultAsync(row)
                        .ConfigureAwait(false);

                //var results = new List<string>();
                //results.Add(row);
                //results.Add(await Xb.App.Process.GetConsoleResultAsync(row));
                //var result = string.Join("\n", results.ToArray());

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
