using Microsoft.AspNetCore.Mvc;
using ServiceTicketApi.Models;

namespace ServiceTicketApi.Controllers;

[ApiController]
[Route("api/tickets")]

public class TicketsController : ControllerBase
{
  private static readonly List<TicketModel> _tickets = new()
  {
    new TicketModel(1, "Printer not working", "open", "medium", null)
  };

  [HttpGet]
  public async Task<ActionResult<TicketModel>> GetAll()
  {
    await Task.Delay(50);
    return Ok(_tickets);
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<TicketModel>> GetById(int id)
  {
    await Task.Delay(50);
    var ticket = _tickets.FirstOrDefault(t => t.Id == id);
    return ticket is null ? NotFound() : Ok(ticket);
  }

  [HttpPost]
  public async Task<ActionResult<TicketModel>> Create([FromBody] TicketModel request)
  {
    await Task.Delay(50);
    var nextId = _tickets.Count == 0 ? 1 : _tickets.Max(t => t.Id) + 1;
    var created = request with { Id = nextId };
    _tickets.Add(created);
    return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
  }

  [HttpPut("{id:int}")]
  public async Task<ActionResult<TicketModel>> Update(int id, [FromBody] TicketModel request)
  {
    await Task.Delay(50);
    var index = _tickets.FindIndex(t => t.Id == id);
    if (index < 0) return NotFound();
    var updated = request with { Id = id };
    _tickets[index] = updated;
    return Ok(updated);
  }

  [HttpDelete("{id:int}")]
  public async Task<IActionResult> Delete(int id)
  {
    await Task.Delay(50);
    var removed = _tickets.RemoveAll(t => t.Id == id);
    return removed == 0 ? NotFound() : NoContent();
  }
}