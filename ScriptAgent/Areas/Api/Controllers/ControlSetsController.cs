using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BrWebHost.Models;
using BrWebHost.Models.Entities;
using BrWebHost.Models.Stores;
using SharpBroadlink.Devices;

namespace BrWebHost.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/ControlSets")]
    public class ControlSetsController : Controller
    {
        private readonly Dbc _dbc;

        public ControlSetsController(Dbc dbc)
        {
            Xb.Util.Out("ControlSetsController.Constructor");
            this._dbc = dbc;
        }

        // GET: api/ControlSets
        [HttpGet]
        public XhrResult GetControlSets()
        {
            Xb.Util.Out("ControlSetsController.GetControlSets");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var list = _dbc.ControlSets
                    .Include(c => c.Controls)
                    .ToArray();
                return XhrResult.CreateSucceeded(list);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: api/ControlSets/5
        [HttpGet("{id}")]
        public async Task<XhrResult> GetControlSet([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var controlSet = await _dbc.ControlSets
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (controlSet == null)
                    return XhrResult.CreateError("Entity Not Found");

                return XhrResult.CreateSucceeded(controlSet);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/ControlSets
        [HttpPost]
        public async Task<XhrResult> PostControlSet([FromBody] ControlSet controlSet)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (controlSet.Id == default(int))
                {
                    // IDが無いEntity = 新規
                    this._dbc.ControlSets.Add(controlSet);

                    // 保存
                    await _dbc.SaveChangesAsync();
                }
                else
                {
                    // IDを持つEntity = 既存の更新
                    this._dbc.Entry(controlSet).State = EntityState.Modified;

                    foreach (var control in controlSet.Controls)
                    {
                        if (control.Id == default(int))
                            this._dbc.Controls.Add(control);
                        else
                            this._dbc.Entry(control).State = EntityState.Modified;
                    }

                    // 既存の明細のうち、渡し値に存在しないものを取得
                    var removes = this._dbc.Controls
                        .Where(c => c.ControlSetId == controlSet.Id)
                        .Where(c1 => controlSet.Controls.All(c2 => c2.Id != c1.Id))
                        .ToArray();

                    // 渡し値に存在しない既存レコードを削除。
                    if (removes.Length > 0)
                        this._dbc.Controls.RemoveRange(removes);

                    // ヘッダと明細を一括保存
                    await _dbc.SaveChangesAsync();
                }

                return XhrResult.CreateSucceeded(controlSet);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/ControlSets/UpdateHeader/5
        [HttpPost("UpdateHeader/{id}")]
        public async Task<XhrResult> UpdateHeader(
            [FromRoute] int id,
            [FromBody] Header header
        )
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var controlSet = await this._dbc.ControlSets
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (controlSet == null)
                    return XhrResult.CreateError("Entity Not Found");

                controlSet.Order = header.Order;
                controlSet.ToggleState = header.ToggleState;

                this._dbc.Entry(controlSet).State = EntityState.Modified;

                await _dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/ControlSets/UpdateHeader/5
        [HttpPost("UpdateHeader")]
        public async Task<XhrResult> UpdateHeader([FromBody] Header[] headers)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                // 更新対象を走査、見つからなければエラー応答。
                var targets = new List<ControlSet>();
                foreach (var cHeader in headers)
                {
                    var controlSet = await this._dbc.ControlSets
                        .SingleOrDefaultAsync(m => m.Id == cHeader.Id);

                    if (controlSet == null)
                        return XhrResult.CreateError("Entity Not Found");

                    controlSet.Order = cHeader.Order;
                    controlSet.ToggleState = cHeader.ToggleState;
                    targets.Add(controlSet);
                }

                // 更新対象が全て存在するとき、DB更新
                foreach (var cSet in targets)
                    this._dbc.Entry(cSet).State = EntityState.Modified;

                await _dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // DELETE: api/ControlSets/5
        [HttpDelete("{id}")]
        public async Task<XhrResult> DeleteControlSet([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var controlSet = await this._dbc.ControlSets
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (controlSet == null)
                    return XhrResult.CreateError("Entity Not Found");

                // 既存の明細レコードを取得
                var children = this._dbc.Controls
                    .Where(c => c.ControlSetId == controlSet.Id)
                    .ToArray();

                // 既存明細レコードを削除指定
                foreach (var control in children)
                    this._dbc.Controls.Remove(control);

                // ヘッダレコードを削除指定
                this._dbc.ControlSets.Remove(controlSet);

                // ヘッダ・明細を一括削除
                await this._dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        private bool ControlSetExists(int id)
        {
            return _dbc.ControlSets.Any(e => e.Id == id);
        }
    }
}
