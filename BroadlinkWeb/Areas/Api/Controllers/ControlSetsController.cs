using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/ControlSets")]
    public class ControlSetsController : Controller
    {
        private readonly Dbc _context;

        public ControlSetsController(Dbc context)
        {
            _context = context;
        }

        // GET: api/ControlSets
        [HttpGet]
        public XhrResult GetControlSets()
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            var list = _context.ControlSets
                .Include(c => c.Controls)
                .ToArray();
            return XhrResult.CreateSucceeded(list);
        }

        // GET: api/ControlSets/5
        [HttpGet("{id}")]
        public async Task<XhrResult> GetControlSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            var controlSet = await _context.ControlSets.SingleOrDefaultAsync(m => m.Id == id);

            if (controlSet == null)
                return XhrResult.CreateError("Entity Not Found");

            return XhrResult.CreateSucceeded(controlSet);
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
                    this._context.ControlSets.Add(controlSet);

                    // 保存
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // IDを持つEntity = 既存の更新
                    this._context.Entry(controlSet).State = EntityState.Modified;

                    foreach (var control in controlSet.Controls)
                    {
                        if (control.Id == default(int))
                            this._context.Controls.Add(control);
                        else
                            this._context.Entry(control).State = EntityState.Modified;
                    }

                    // 既存の明細レコードを取得
                    var children = this._context.Controls.Where(c => c.ControlSetId == controlSet.Id).ToArray();

                    // 既存の明細のうち、渡し値に存在しないものを削除。
                    if (children.Length > 0)
                    {
                        var removes = children.Where(c => !controlSet.Controls.Any(c2 => c2.Id == c.Id));
                        foreach (var control in removes)
                        {
                            this._context.Controls.Remove(control);
                        }
                    }

                    // ヘッダと明細を一括保存
                    await _context.SaveChangesAsync();
                }

                return XhrResult.CreateSucceeded(controlSet);
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
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            var controlSet = await this._context.ControlSets.SingleOrDefaultAsync(m => m.Id == id);

            if (controlSet == null)
                return XhrResult.CreateError("Entity Not Found");

            // 既存の明細レコードを取得
            var children = this._context.Controls.Where(c => c.ControlSetId == controlSet.Id).ToArray();

            // 既存明細レコードを削除指定
            foreach (var control in children)
                this._context.Controls.Remove(control);

            // ヘッダレコードを削除指定
            this._context.ControlSets.Remove(controlSet);

            // ヘッダ・明細を一括削除
            await this._context.SaveChangesAsync();

            return XhrResult.CreateSucceeded();
        }

        //// PUT: api/ControlSets/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutControlSet(
        //    [FromRoute] int id, 
        //    [FromBody] ControlSet controlSet
        //)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != controlSet.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(controlSet).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ControlSetExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/ControlSets
        //[HttpPost]
        //public async Task<IActionResult> PostControlSet([FromBody] ControlSet controlSet)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    _context.ControlSets.Add(controlSet);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetControlSet", new { id = controlSet.Id }, controlSet);
        //}

        private bool ControlSetExists(int id)
        {
            return _context.ControlSets.Any(e => e.Id == id);
        }
    }
}
