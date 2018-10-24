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
using System.Net;
using SharpBroadlink.Devices;

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
            this._dbc = dbc;
            this._store = BrDeviceStore.GetInstance(dbc);
        }

        // GET: api/BrDevices/Discover
        [HttpGet("Discover")]
        public XhrResult Discover()
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            //IEnumerable<BrDevice>
            var result = this._store.Refresh();
            return XhrResult.CreateSucceeded(result.ToArray());
        }

        // GET: api/BrDevices/5
        [HttpGet("GetA1SensorValues/{id?}")] // <- nullableのとき、ここにも?が必要。
        public XhrResult GetA1SensorValues([FromRoute] int? id)
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            BrDevice entity;
            if (id == null)
                entity = this._store.List
                    .FirstOrDefault(bd => bd.SbDevice?.DeviceType == DeviceType.A1);
            else
                entity = this._store.List
                    .FirstOrDefault(bd => bd.Id == id);

            if (entity == null)
                return XhrResult.CreateError("Entity Not Found");
            else if (!entity.IsActive)
                return XhrResult.CreateError("Device is not Active");
            else if (entity.SbDevice.DeviceType != SharpBroadlink.Devices.DeviceType.A1)
                return XhrResult.CreateError("Device is not A1 Sensor");

            var a1Dev = (A1)entity.SbDevice;

            var result = a1Dev.CheckSensorsRaw()
                .GetAwaiter()
                .GetResult();

            return XhrResult.CreateSucceeded(result);
        }

        // GET: api/BrDevices
        [HttpGet]
        public XhrResult GetBrDevices()
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            var list = _dbc.BrDevices.ToArray();
            return XhrResult.CreateSucceeded(list);
        }

        // GET: api/BrDevices/5
        [HttpGet("{id}")]
        public async Task<XhrResult> GetBrDevice([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return XhrResult.CreateError(ModelState);

            var brDevice = await _dbc.BrDevices.SingleOrDefaultAsync(m => m.Id == id);

            if (brDevice == null)
                return XhrResult.CreateError("Entity Not Found");

            return XhrResult.CreateSucceeded(brDevice);
        }

        //// PUT: api/BrDevices/5
        //[HttpPut("{id}")]
        //public async Task<XhrResult<BrDevice>> PutBrDevice([FromRoute] int id, [FromBody] BrDevice brDevice)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return XhrResult<BrDevice>.CreateError("Bad Request");
        //    }

        //    if (id != brDevice.Id)
        //    {
        //        return XhrResult<BrDevice>.CreateError("Bad Request");
        //    }

        //    _context.Entry(brDevice).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!BrDeviceExists(id))
        //        {
        //            return XhrResult<BrDevice>.CreateError("Not Found");
        //        }
        //        else
        //        {
        //            return XhrResult<BrDevice>.CreateError("Unexpected");
        //        }
        //    }

        //    return XhrResult<BrDevice>.CreateSucceeded(brDevice);
        //}

        //// POST: api/BrDevices
        //[HttpPost]
        //public async Task<XhrResult<BrDevice>> PostBrDevice([FromBody] BrDevice brDevice)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return XhrResult<BrDevice>.CreateError("Bad Request");
        //    }

        //    _context.BrDevices.Add(brDevice);
        //    await _context.SaveChangesAsync();

        //    return XhrResult<BrDevice>.CreateSucceeded(brDevice);
        //}

        //// DELETE: api/BrDevices/5
        //[HttpDelete("{id}")]
        //public async Task<XhrResult<BrDevice>> DeleteBrDevice([FromRoute] int id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return XhrResult<BrDevice>.CreateError("Bad Request");
        //    }

        //    var brDevice = await _context.BrDevices.SingleOrDefaultAsync(m => m.Id == id);
        //    if (brDevice == null)
        //    {
        //        return XhrResult<BrDevice>.CreateError("Not Found");
        //    }

        //    _context.BrDevices.Remove(brDevice);
        //    await _context.SaveChangesAsync();

        //    return XhrResult<BrDevice>.CreateSucceeded(null);
        //}

        private bool BrDeviceExists(int id)
        {
            return _dbc.BrDevices.Any(e => e.Id == id);
        }
    }
}
