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
public class AnswersController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public AnswersController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    private async Task<User?> GetLoggedUser() {
        var username = User.Identity!.Name;
        return await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == username);
    }

    // GET api/Answers/1
    [Authorized(Role.Student)]
    [HttpGet("{id}")]
    public async Task<ActionResult<AnswerDTO>> GetAnswerById(int id) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var answer = await _context.Answers.FindAsync(id);
        if (answer == null) {
            return NotFound();
        }
        return _mapper.Map<AnswerDTO>(answer);
    }

    // POST api/Answers
    [Authorized(Role.Student)]
    [HttpPost]
    public async Task<ActionResult<AnswerDTO>> PostAnswer(AnswerDTO answerDTO) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var evaluatedAnswerDTO = await EvaluationService.Evaluate(answerDTO, _context);

        var newAnswer = _mapper.Map<Answer>(evaluatedAnswerDTO);
        newAnswer.Timestamp = DateTimeOffset.Now;
        if (evaluatedAnswerDTO.Errors.Count == 0) {
            newAnswer.IsCorrect = true;
        } else {
            newAnswer.IsCorrect = false;
        }

        _context.Answers.Add(newAnswer);
        await _context.SaveChangesAsync();

        var createdAnswerDTO = _mapper.Map<AnswerDTO>(newAnswer);

        return CreatedAtAction(nameof(GetAnswerById), new { id = createdAnswerDTO.Id }, createdAnswerDTO);
    }
}
