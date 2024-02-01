using FluentValidation;

namespace prid.Models;

public class QuestionValidator : AbstractValidator<Question>
{
    private readonly PridContext _context;

    public QuestionValidator(PridContext context) {
        _context = context;

        RuleFor(question => question)
            .Must(BeUniqueOrderInQuiz)
            .WithMessage("Each question must have a unique order number within the quiz.");

        RuleFor(question => question.Body)
            .NotEmpty().WithMessage("Question body is required.")
            .MinimumLength(2).WithMessage("Question body must be at least 2 caracters.")
            .Must(BeAtLeastTwoNonSpaceCharacters);

        RuleFor(question => question.Solutions)
            .Must(HaveAtLeastOneSolution)
            .WithMessage("Each question must have at least one solution.");

        RuleForEach(question => question.Solutions).SetValidator(new SolutionValidator(_context));
    }

    private bool BeUniqueOrderInQuiz(Question question) {
        var otherQuestionsInQuiz = _context.Questions
                                           .Where(q => q.QuizId == question.QuizId && q.Id != question.Id)
                                           .ToList();

        return !otherQuestionsInQuiz.Any(q => q.Order == question.Order);
    }

    private bool BeAtLeastTwoNonSpaceCharacters(string body) {
        if (string.IsNullOrWhiteSpace(body)) {
            return false;
        }

        var nonSpaceCharCount = body.Count(c => !char.IsWhiteSpace(c));
        return nonSpaceCharCount >= 2;
    }

    private bool HaveAtLeastOneSolution(ICollection<Solution> solutions) {
        return solutions != null && solutions.Count > 0;
    }
}
