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
public class DatabasesController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public DatabasesController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    private async Task<User?> GetLoggedUser() {
        var username = User.Identity!.Name;
        return await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == username);
    }

    // GET api/Databases
    [Authorized(Role.Teacher)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DatabaseDTO>>> GetAll() {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var databases = _mapper.Map<List<DatabaseDTO>>(await _context.Databases.ToListAsync()); ;

        return databases;
    }
}
