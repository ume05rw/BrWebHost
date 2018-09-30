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

namespace BroadlinkWeb.Areas.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/BrDevices")]
    public class BrDevicesController : Controller
    {
        private readonly Dbc _context;

        private BrDeviceStore _store;

        public BrDevicesController(Dbc context)
        {
            this._context = context;
            this._store = new BrDeviceStore(this._context);
        }

        // GET: api/BrDevices/Discover
        [HttpGet("Discover")]
        public IEnumerable<BrDevice> Discover()
        {
            var result = this._store.Discover();
            return result;
        }

        // GET: api/BrDevices/5
        [HttpGet("GetA1SensorValues/{id}")]
        public async Task<IActionResult> GetA1SensorValues([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var brDevice = await _context.BrDevices.SingleOrDefaultAsync(m => m.Id == id);

            if (brDevice == null)
            {
                return NotFound();
            }

            var mac = brDevice.MacAddressString
                .Split('-')
                .Select(hex => Convert.ToByte(hex, 16))
                .ToArray();
            var endPoint = new IPEndPoint(IPAddress.Parse(brDevice.IpAddressString), brDevice.Port);
            var dev = SharpBroadlink.Broadlink.Create(brDevice.DeviceTypeNumber, mac, endPoint);

            if (dev.DeviceType != SharpBroadlink.Devices.DeviceType.A1)
            {
                return NotFound();
            }

            var a1Dev = (SharpBroadlink.Devices.A1)dev;

            a1Dev.Auth()
                .GetAwaiter()
                .GetResult();

            var result = a1Dev.CheckSensorsRaw()
                .GetAwaiter()
                .GetResult();

            return Ok(result);
        }



        // GET: api/BrDevices
        [HttpGet]
        public IEnumerable<BrDevice> GetBrDevices()
        {
            return _context.BrDevices;
        }

        // GET: api/BrDevices/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrDevice([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var brDevice = await _context.BrDevices.SingleOrDefaultAsync(m => m.Id == id);

            if (brDevice == null)
            {
                return NotFound();
            }

            return Ok(brDevice);
        }

        // PUT: api/BrDevices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrDevice([FromRoute] int id, [FromBody] BrDevice brDevice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != brDevice.Id)
            {
                return BadRequest();
            }

            _context.Entry(brDevice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BrDeviceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/BrDevices
        [HttpPost]
        public async Task<IActionResult> PostBrDevice([FromBody] BrDevice brDevice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.BrDevices.Add(brDevice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBrDevice", new { id = brDevice.Id }, brDevice);
        }

        // DELETE: api/BrDevices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrDevice([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var brDevice = await _context.BrDevices.SingleOrDefaultAsync(m => m.Id == id);
            if (brDevice == null)
            {
                return NotFound();
            }

            _context.BrDevices.Remove(brDevice);
            await _context.SaveChangesAsync();

            return Ok(brDevice);
        }

        private bool BrDeviceExists(int id)
        {
            return _context.BrDevices.Any(e => e.Id == id);
        }
    }
}