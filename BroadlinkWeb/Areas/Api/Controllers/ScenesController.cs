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
    [Route("api/Scenes")]
    public class ScenesController : Controller
    {
        private readonly Dbc _dbc;

        public ScenesController(Dbc dbc)
        {
            Xb.Util.Out("ScenesController.Constructor");
            this._dbc = dbc;
        }

        // GET: api/Scenes
        [HttpGet]
        public XhrResult GetScenes()
        {
            Xb.Util.Out("ScenesController.GetControlSets");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var list = _dbc.Scenes
                    .Include(c => c.Details)
                    .ToArray();
                return XhrResult.CreateSucceeded(list);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: api/Scenes/5
        [HttpGet("{id}")]
        public async Task<XhrResult> GetScene([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var scene = await _dbc.Scenes
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (scene == null)
                    return XhrResult.CreateError("Entity Not Found");

                return XhrResult.CreateSucceeded(scene);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/Scenes
        [HttpPost]
        public async Task<XhrResult> PostScene([FromBody] Scene scene)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                if (scene.Id == default(int))
                {
                    // IDが無いEntity = 新規
                    this._dbc.Scenes.Add(scene);

                    // 保存
                    await _dbc.SaveChangesAsync();
                }
                else
                {
                    // IDを持つEntity = 既存の更新
                    this._dbc.Entry(scene).State = EntityState.Modified;

                    foreach (var detail in scene.Details)
                    {
                        if (detail.Id == default(int))
                            this._dbc.SceneDetails.Add(detail);
                        else
                            this._dbc.Entry(detail).State = EntityState.Modified;
                    }

                    // 既存の明細レコードを取得
                    var children = this._dbc.SceneDetails
                        .Where(c => c.SceneId == scene.Id)
                        .ToArray();

                    // 既存の明細のうち、渡し値に存在しないものを削除。
                    if (children.Length > 0)
                    {
                        var removes = children
                            .Where(c => !scene.Details.Any(c2 => c2.Id == c.Id));
                        foreach (var detail in removes)
                        {
                            this._dbc.SceneDetails.Remove(detail);
                        }
                    }

                    // ヘッダと明細を一括保存
                    await _dbc.SaveChangesAsync();
                }

                return XhrResult.CreateSucceeded(scene);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/Scenes/UpdateHeader/5
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

                var scene = await this._dbc.Scenes
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (scene == null)
                    return XhrResult.CreateError("Entity Not Found");

                scene.Order = header.Order;

                this._dbc.Entry(scene).State = EntityState.Modified;

                await _dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // POST: api/Scenes/UpdateHeader/5
        [HttpPost("UpdateHeader")]
        public async Task<XhrResult> UpdateHeader([FromBody] Header[] headers)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                // 更新対象を走査、見つからなければエラー応答。
                var targets = new List<Scene>();
                foreach (var cHeader in headers)
                {
                    var scene = await this._dbc.Scenes
                        .SingleOrDefaultAsync(m => m.Id == cHeader.Id);

                    if (scene == null)
                        return XhrResult.CreateError("Entity Not Found");

                    scene.Order = cHeader.Order;
                    targets.Add(scene);
                }

                // 更新対象が全て存在するとき、DB更新
                foreach (var scene in targets)
                    this._dbc.Entry(scene).State = EntityState.Modified;

                await _dbc.SaveChangesAsync();

                return XhrResult.CreateSucceeded(true);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // DELETE: api/Scenes/5
        [HttpDelete("{id}")]
        public async Task<XhrResult> DeleteControlSet([FromRoute] int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var scene = await this._dbc.Scenes
                    .SingleOrDefaultAsync(m => m.Id == id);

                if (scene == null)
                    return XhrResult.CreateError("Entity Not Found");

                // 既存の明細レコードを取得
                var children = this._dbc.SceneDetails
                    .Where(c => c.SceneId == scene.Id)
                    .ToArray();

                // 既存明細レコードを削除指定
                foreach (var detail in children)
                    this._dbc.SceneDetails.Remove(detail);

                // ヘッダレコードを削除指定
                this._dbc.Scenes.Remove(scene);

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
            return _dbc.Scenes.Any(e => e.Id == id);
        }
    }
}
