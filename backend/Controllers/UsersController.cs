using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using prid.Helpers;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public UsersController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    private async Task<User?> GetLoggedUser() {
        var username = User.Identity!.Name;
        return await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == username);
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<UserDTO>> Authenticate(UserWithPasswordDTO dto) {
        var user = await Authenticate(dto.Pseudo, dto.Password);

        var result = await new UserValidator(_context).ValidateForAuthenticate(user);
        if (!result.IsValid)
            return BadRequest(result);

        return Ok(_mapper.Map<UserDTO>(user));
    }

    private async Task<User?> Authenticate(string pseudo, string password) {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);

        if (user == null)
            return null;

        if (user.Password == password) {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Pseudo),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
        }

        return user;
    }

    // GET api/Users/Session1
    [Authorized(Role.Teacher)]
    [HttpGet("session1")]
    public async Task<ActionResult<IEnumerable<StudentDTO>>> GetStudentsWithAttempts() {
        var students = await _context.Students
                        .Include(s => s.Attempts.Where(a => !a.Quiz.IsTest && a.Finish == null))
                            .ThenInclude(a => a.Quiz)
                        .Where(a => a.Attempts.Any(a => !a.Quiz.IsTest && a.Finish == null))
                        .ToListAsync();

        return _mapper.Map<List<StudentDTO>>(students);
    }

    // EXERCICES

    // GET api/Users
    /* [Authorized(Role.Teacher)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
        return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
    } */

    // POST api/Users
    /* [Authorized(Role.Teacher)]
    [HttpPost]
    public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO userDTO) {
        var newUser = _mapper.Map<User>(userDTO);
        var result = await new UserValidator(_context).ValidateAsync(newUser);

        if (!result.IsValid)
            return BadRequest(result);

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = userDTO.ID }, _mapper.Map<UserDTO>(newUser));
    } */

    // PUT api/Users
    /* [Authorized(Role.Teacher)]
    [HttpPut]
    public async Task<IActionResult> PutUser(UserDTO userDTO) {
        var user = await _context.Users.FindAsync(userDTO.ID);
        if (user == null)
            return NotFound();

        _mapper.Map<UserDTO, User>(userDTO, user);

        var result = await new UserValidator(_context).ValidateAsync(user);
        if (!result.IsValid)
            return BadRequest(result);

        await _context.SaveChangesAsync();
        return NoContent();
    } */

    // GET api/Users/1
    /* [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetOne(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        return _mapper.Map<UserDTO>(user);
    } */

    // DELETE api/Users/1
    /* [Authorized(Role.Teacher)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    } */

    // GET api/Users/ben
    /* [HttpGet("byPseudo/{pseudo}")]
    public async Task<ActionResult<UserDTO>> GetByPseudo(string pseudo) {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == pseudo);
        if (user == null)
            return NotFound();

        return _mapper.Map<UserDTO>(user);
    } */

    // GET api/Users/byEmail/ben@epfc.eu
    /* [HttpGet("byEmail/{email}")]
    public async Task<ActionResult<UserDTO>> GetByEmail(string email) {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return NotFound();

        return _mapper.Map<UserDTO>(user);
    } */
}
