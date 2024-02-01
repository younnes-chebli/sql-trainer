using Microsoft.AspNetCore.Mvc;
using prid.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AttemptsController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public AttemptsController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    private async Task<User?> GetLoggedUser() {
        var username = User.Identity!.Name;
        return await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == username);
    }

    // GET api/Attempts/1
    [Authorized(Role.Student)]
    [HttpGet("{id}")]
    public async Task<ActionResult<AttemptWithAnswersDTO>> GetAttemptById(int id) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var attempt = await _context.Attempts.FindAsync(id);
        if (attempt == null) {
            return NotFound();
        }
        return _mapper.Map<AttemptWithAnswersDTO>(attempt);
    }

    // PUT api/Attempts/1
    [HttpPut]
    public async Task<IActionResult> PutAttempt(AttemptWithAnswersDTO attemptDTO) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var attempt = await _context.Attempts.FindAsync(attemptDTO.Id);
        if (attempt == null)
            return NotFound();

        _mapper.Map<AttemptWithAnswersDTO, Attempt>(attemptDTO, attempt);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // POST api/Attempts
    [Authorized(Role.Student)]
    [HttpPost]
    public async Task<ActionResult<AttemptWithAnswersDTO>> PostAttempt(AttemptWithAnswersDTO attemptDTO) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }
        var newAttempt = _mapper.Map<Attempt>(attemptDTO);

        _context.Attempts.Add(newAttempt);
        await _context.SaveChangesAsync();

        var createdAttemptsDTO = _mapper.Map<AttemptWithAnswersDTO>(newAttempt);

        return CreatedAtAction(nameof(GetAttemptById), new { id = createdAttemptsDTO.Id }, createdAttemptsDTO);
    }
}
