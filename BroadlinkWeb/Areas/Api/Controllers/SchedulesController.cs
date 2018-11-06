using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Schedules")]
    public class SchedulesController : Controller
    {
        private readonly Dbc _dbc;

        public SchedulesController(Dbc dbc)
        {
            Xb.Util.Out("SchedulesController.Constructor");
            this._dbc = dbc;
        }

        // GET: api/Schedules
        [HttpGet]
        public XhrResult GetSchedules()
        {
            Xb.Util.Out("SchedulesController.GetControlSets");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var schedules = _dbc.Schedules
                    .ToArray();

                foreach (var schedule in schedules)
                    schedule.DateTimeToString();

                return XhrResult.CreateSucceeded(schedules);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: api/Schedules/5
        [HttpGet("{id}")]
        public async Task<XhrResult> GetSchedule([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var schedule = await _dbc.Schedules
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (schedule == null)
                    return XhrResult.CreateError("Entity Not Found");

                schedule.DateTimeToString();

                return XhrResult.CreateSucceeded(schedule);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/Schedules
        [HttpPost]
        public async Task<XhrResult> PostSchedule([FromBody] Schedule schedule)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                schedule.StringToDateTime();

                if (schedule.Id == default(int))
                {
                    // IDが無いEntity = 新規
                    this._dbc.Schedules.Add(schedule);

                    // 保存
                    await _dbc.SaveChangesAsync();
                }
                else
                {
                    // IDを持つEntity = 既存の更新
                    this._dbc.Entry(schedule).State = EntityState.Modified;

                    // ヘッダと明細を一括保存
                    await _dbc.SaveChangesAsync();
                }

                return XhrResult.CreateSucceeded(schedule);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/Schedules/UpdateHeader/5
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

                var schedule = await this._dbc.Schedules
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (schedule == null)
                    return XhrResult.CreateError("Entity Not Found");

                schedule.Order = header.Order;

                this._dbc.Entry(schedule).State = EntityState.Modified;

                await _dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/Schedules/UpdateHeader/5
        [HttpPost("UpdateHeader")]
        public async Task<XhrResult> UpdateHeader([FromBody] Header[] headers)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                // 更新対象を走査、見つからなければエラー応答。
                var targets = new List<Schedule>();
                foreach (var cHeader in headers)
                {
                    var schedule = await this._dbc.Schedules
                        .SingleOrDefaultAsync(m => m.Id == cHeader.Id);

                    if (schedule == null)
                        return XhrResult.CreateError("Entity Not Found");

                    schedule.Order = cHeader.Order;
                    targets.Add(schedule);
                }

                // 更新対象が全て存在するとき、DB更新
                foreach (var schedule in targets)
                    this._dbc.Entry(schedule).State = EntityState.Modified;

                await _dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // DELETE: api/Schedules/5
        [HttpDelete("{id}")]
        public async Task<XhrResult> DeleteSchedule([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var schedule = await this._dbc.Schedules
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (schedule == null)
                    return XhrResult.CreateError("Entity Not Found");

                // レコードを削除指定
                this._dbc.Schedules.Remove(schedule);

                // 削除
                await this._dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }
    }
}
