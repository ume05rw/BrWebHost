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
        public IEnumerable<ControlSet> GetControlSets()
        {
            return _context.ControlSets;
        }

        // GET: api/ControlSets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetControlSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var controlSet = await _context.ControlSets.SingleOrDefaultAsync(m => m.Id == id);

            if (controlSet == null)
            {
                return NotFound();
            }

            return Ok(controlSet);
        }

        // PUT: api/ControlSets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutControlSet([FromRoute] int id, [FromBody] ControlSet controlSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != controlSet.Id)
            {
                return BadRequest();
            }

            _context.Entry(controlSet).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ControlSetExists(id))
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

        // POST: api/ControlSets
        [HttpPost]
        public async Task<IActionResult> PostControlSet([FromBody] ControlSet controlSet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ControlSets.Add(controlSet);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetControlSet", new { id = controlSet.Id }, controlSet);
        }

        // DELETE: api/ControlSets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteControlSet([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var controlSet = await _context.ControlSets.SingleOrDefaultAsync(m => m.Id == id);
            if (controlSet == null)
            {
                return NotFound();
            }

            _context.ControlSets.Remove(controlSet);
            await _context.SaveChangesAsync();

            return Ok(controlSet);
        }

        private bool ControlSetExists(int id)
        {
            return _context.ControlSets.Any(e => e.Id == id);
        }
    }
}