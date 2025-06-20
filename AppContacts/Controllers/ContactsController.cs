using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Attributes;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using AppContacts.Data;
using AppContacts.Shared.Models;

namespace AppContacts.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
[EnableRateLimiting("Fixed")]
public class ContactsController(ApplicationDbContext ctx) : ControllerBase
{
    [HttpGet("")]
    [EnableQuery]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<IQueryable<Contacts>> Get()
    {
        return Ok(ctx.Contacts);
    }

    [HttpGet("{key}")]
    [EnableQuery]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Contacts>> GetAsync(long key)
    {
        var contacts = await ctx.Contacts.FirstOrDefaultAsync(x => x.Id == key);

        if (contacts == null)
        {
            return NotFound();
        }
        else
        {
            return Ok(contacts);
        }
    }

    [HttpPost("")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Contacts>> PostAsync(Contacts contacts)
    {
        var record = await ctx.Contacts.FindAsync(contacts.Id);
        if (record != null)
        {
            return Conflict();
        }
    
        await ctx.Contacts.AddAsync(contacts);

        await ctx.SaveChangesAsync();

        return Created($"/contacts/{contacts.Id}", contacts);
    }

    [HttpPut("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Contacts>> PutAsync(long key, Contacts update)
    {
        var contacts = await ctx.Contacts.FirstOrDefaultAsync(x => x.Id == key);

        if (contacts == null)
        {
            return NotFound();
        }

        ctx.Entry(contacts).CurrentValues.SetValues(update);

        await ctx.SaveChangesAsync();

        return Ok(contacts);
    }

    [HttpPatch("{key}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Contacts>> PatchAsync(long key, Delta<Contacts> delta)
    {
        var contacts = await ctx.Contacts.FirstOrDefaultAsync(x => x.Id == key);

        if (contacts == null)
        {
            return NotFound();
        }

        delta.Patch(contacts);

        await ctx.SaveChangesAsync();

        return Ok(contacts);
    }

    [HttpDelete("{key}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(long key)
    {
        var contacts = await ctx.Contacts.FindAsync(key);

        if (contacts != null)
        {
            ctx.Contacts.Remove(contacts);
            await ctx.SaveChangesAsync();
        }

        return NoContent();
    }
}
