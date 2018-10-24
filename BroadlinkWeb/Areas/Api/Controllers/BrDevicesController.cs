using BroadlinkWeb.Models;
using BroadlinkWeb.Models.Entities;
using BroadlinkWeb.Models.Stores;
using Microsoft.AspNetCore.Mvc;
using SharpBroadlink.Devices;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/BrDevices")]
    public class BrDevicesController : Controller
    {
        private readonly Dbc _dbc;
        private BrDeviceStore _store;

        public BrDevicesController(Dbc dbc)
        {
            Xb.Util.Out("BrDevicesController.Constructor");
            this._dbc = dbc;
            this._store = BrDeviceStore.GetInstance(dbc);
        }

        // GET: api/BrDevices
        [HttpGet]
        public async Task<XhrResult> GetBrDevices()
        {
            Xb.Util.Out("BrDevicesController.GetBrDevices");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var list = await this._store.GetList();
                return XhrResult.CreateSucceeded(list);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: api/BrDevices/5
        [HttpGet("{id}")]
        public async Task<XhrResult> GetBrDevice([FromRoute] int id)
        {
            Xb.Util.Out("BrDevicesController.GetBrDevice");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var brDevice = await this._store.Get(id);

                if (brDevice == null)
                    return XhrResult.CreateError("Entity Not Found");

                return XhrResult.CreateSucceeded(brDevice);
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        // GET: api/BrDevices/Discover
        [HttpGet("Discover")]
        public async Task<XhrResult> Discover()
        {
            Xb.Util.Out("BrDevicesController.Discover");
            try
            {
                if (!ModelState.IsValid)
                    return XhrResult.CreateError(ModelState);

                var result = await this._store.Refresh();
                return XhrResult.CreateSucceeded(result.ToArray());
            }
            catch (Exception ex)
            {
                return XhrResult.CreateError(ex);
            }
        }

        private bool BrDeviceExists(int id)
        {
            return _dbc.BrDevices.Any(e => e.Id == id);
        }
    }
}
