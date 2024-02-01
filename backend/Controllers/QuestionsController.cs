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
public class QuestionsController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public QuestionsController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    private async Task<User?> GetLoggedUser() {
        var username = User.Identity!.Name;
        return await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == username);
    }

    // GET api/Questions/1
    [Authorized(Role.Student)]
    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionWithSolutionsAndAnswersDTO>> GetOne(int id) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var question = await _context.Questions
            .Include(q => q.Quiz)
            .Include(q => q.Solutions)
            .Include(q => q.Answers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            return NotFound();

        var questionDTO = _mapper.Map<QuestionWithSolutionsAndAnswersDTO>(question);
        var quiz = await _context.Quizzes
            .Include(q => q.Database)
            .Include(q => q.Attempts)
                .ThenInclude(a => a.Answers)
            .FirstOrDefaultAsync(q => q.Id == question.QuizId);
        var quizDTO = _mapper.Map<QuizWithDatabaseWithAttemptsDTO>(quiz);
        QuizzesService.SetStudentAttempts(quizDTO, loggedUser);
        QuizzesService.SetStatusStudent(quizDTO);
        questionDTO.Quiz = quizDTO;

        questionDTO.QuestionIds = _context.Questions
                            .Where(q => q.QuizId == quizDTO.Id)
                            .OrderBy(q => q.Order)
                            .Select(q => q.Id)
                            .ToArray();

        var lastAttemptId = quizDTO.Attempts.LastOrDefault()?.Id;
        if (lastAttemptId != null) {
            var attemptAnswers = questionDTO.Answers
                                .Where(a => a.AttemptId == lastAttemptId)
                                .ToList();
            questionDTO.Answers = attemptAnswers;
            var lastAnswer = questionDTO.Answers.LastOrDefault();
            if (lastAnswer != null) {
                questionDTO.LastAnswer = lastAnswer;
                questionDTO.LastAnswer = await EvaluationService.Evaluate(lastAnswer, _context);
                questionDTO.LastAnswerTimestamp = lastAnswer.Timestamp;
            }
        } else {
            questionDTO.Answers = null!;
        }

        return questionDTO;
    }
}
