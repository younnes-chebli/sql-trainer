using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using prid.Helpers;

namespace prid.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class QuizzesController : ControllerBase
{
    private readonly PridContext _context;
    private readonly IMapper _mapper;

    public QuizzesController(PridContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    private async Task<User?> GetLoggedUser() {
        var username = User.Identity!.Name;
        return await _context.Users.SingleOrDefaultAsync(u => u.Pseudo == username);
    }

    private int GetTotalQuestions(int quizId) {
        return _context.Questions.Count(q => q.QuizId == quizId);
    }

    // GET api/Quizzes
    [Authorized(Role.Teacher)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuizWithDatabaseDTO>>> GetAll() {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var quizzes = _mapper.Map<List<QuizWithDatabaseDTO>>(await _context.Quizzes
                    .Include(q => q.Database)
                    .OrderBy(q => q.Name)
                    .ToListAsync()); ;

        quizzes.ForEach(QuizzesService.SetStatusTeacher);

        return quizzes;
    }

    // GET api/Quizzes/1
    [Authorized(Role.Teacher)]
    [HttpGet("{id}")]
    public async Task<ActionResult<QuizWithDatabaseWithQuestionsAndSolutionsDTO>> GetOne(int id) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var quiz = await _context.Quizzes
            .Include(q => q.Database)
            .Include(q => q.Questions.OrderBy(q => q.Order))
                .ThenInclude(q => q.Solutions.OrderBy(s => s.Order))
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz == null) {
            return NotFound();
        }

        quiz.HasAttempt = await _context.Attempts.AnyAsync(a => a.QuizId == quiz.Id);

        return _mapper.Map<QuizWithDatabaseWithQuestionsAndSolutionsDTO>(quiz);
    }

    // GET api/Quizzes/Trainings
    [Authorized(Role.Student)]
    [HttpGet("trainings")]
    public async Task<ActionResult<IEnumerable<QuizWithDatabaseWithAttemptsDTO>>> GetTrainings() {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var trainings = _mapper.Map<List<QuizWithDatabaseWithAttemptsDTO>>(await _context.Quizzes
            .Where(q => !q.IsTest && q.IsPublished)
            .Include(q => q.Database)
            .Include(q => q.Attempts)
                .ThenInclude(a => a.Answers)
            .OrderBy(q => q.Name)
            .ToListAsync());

        trainings.ForEach(training => {
            QuizzesService.SetStudentAttempts(training, loggedUser);
        });

        trainings.ForEach(QuizzesService.SetStatusStudent);

        trainings.ForEach(training => {
            QuizzesService.SetFirstQuestionId(training, _context);
        });

        return trainings;
    }

    // GET api/Quizzes/Tests
    [Authorized(Role.Student)]
    [HttpGet("tests")]
    public async Task<ActionResult<IEnumerable<QuizWithDatabaseWithAttemptsDTO>>> GetTests() {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var testsDTO = _mapper.Map<List<QuizWithDatabaseWithAttemptsDTO>>(await _context.Quizzes
            .Where(q => q.IsTest && q.IsPublished)
            .Include(q => q.Database)
            .Include(q => q.Attempts)
                .ThenInclude(a => a.Answers)
            .OrderBy(q => q.Name)
            .ToListAsync());

        testsDTO.ForEach(t => {
            QuizzesService.SetStudentAttempts(t, loggedUser);
        });

        testsDTO.ForEach(t => {
            QuizzesService.SetStatusStudent(t);
            //calcul de l'évaluation
            if (t.IsTest && t.Attempts.Count != 0) {
                t.Attempts.ToList().ForEach(a => {
                    if (loggedUser.ID == a.StudentId) {
                        var correctAnswersCount = a.Answers.Count(a => a.IsCorrect);
                        var totalQuestions = GetTotalQuestions(t.Id);
                        var evaluation = totalQuestions == 0 ? 0.0 : (double)correctAnswersCount / totalQuestions;
                        a.Evaluation = evaluation * 10;
                    }
                });
            }

            QuizzesService.SetFirstQuestionId(t, _context);
        });

        return testsDTO;
    }

    // PUT api/Quizzes/1
    [Authorized(Role.Teacher)]
    [HttpPut]
    public async Task<IActionResult> PutQuiz(QuizWithDatabaseWithQuestionsAndSolutionsDTO quizDTO) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var quiz = await _context.Quizzes
                        .Include(q => q.Questions)
                            .ThenInclude(q => q.Solutions)
                        .SingleOrDefaultAsync(q => q.Id == quizDTO.Id);

        if (quiz == null)
            return NotFound();

        _mapper.Map<QuizWithDatabaseWithQuestionsAndSolutionsDTO, Quiz>(quizDTO, quiz);

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // GET api/Quizzes/quizName
    [Authorized(Role.Teacher)]
    [HttpGet("name/{quizName}")]
    public async Task<ActionResult<QuizDTO>> GetByQuizName(string quizName) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Name == quizName);

        return _mapper.Map<QuizDTO>(quiz);
    }

    // POST api/Quizzes
    [Authorized(Role.Teacher)]
    [HttpPost]
    public async Task<ActionResult<QuizWithDatabaseWithQuestionsAndSolutionsDTO>> PostQuiz(QuizWithDatabaseWithQuestionsAndSolutionsDTO quizDTO) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var newQuiz = _mapper.Map<Quiz>(quizDTO);
        var database = await _context.Databases.FindAsync(newQuiz.DatabaseId);
        newQuiz.Database = database!;

        var result = await new QuizValidator(_context).ValidateAsync(newQuiz);
        if (!result.IsValid)
            return BadRequest(result);

        _context.Quizzes.Add(newQuiz);
        await _context.SaveChangesAsync();

        var createdQuizDTO = _mapper.Map<QuizWithDatabaseWithQuestionsAndSolutionsDTO>(newQuiz);

        return CreatedAtAction(nameof(GetOne), new { id = createdQuizDTO.Id }, createdQuizDTO);
    }

    // DELETE api/Quizzes/1
    [Authorized(Role.Teacher)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
        var loggedUser = await GetLoggedUser();

        if (loggedUser == null) {
            return BadRequest();
        }

        var quiz = await _context.Quizzes.FindAsync(id);
        if (quiz == null)
            return NotFound();

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
