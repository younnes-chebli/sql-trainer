using FluentValidation;

namespace prid.Models;

public class QuizValidator : AbstractValidator<Quiz>
{
    private readonly PridContext _context;

    public QuizValidator(PridContext context) {
        _context = context;

        RuleFor(quiz => quiz.Name)
            .NotEmpty().WithMessage("Quiz name is required.")
            .MinimumLength(3).WithMessage("Quiz name must be at least 3 characters long.")
            .Must(BeUniqueName).WithMessage("Quiz name must be unique.");

        RuleFor(quiz => quiz.Questions)
            .Must(HaveAtLeastOneQuestion).WithMessage("The quiz must have at least one question.");

        When(quiz => quiz.IsTest, () => {
            RuleFor(quiz => quiz.StartDate)
                .NotEmpty().WithMessage("Start date is required for a test quiz.")
                .LessThanOrEqualTo(q => q.EndDate)
                .WithMessage("Start date must be before or equal to end date.");

            RuleFor(quiz => quiz.EndDate)
                .NotEmpty().WithMessage("End date is required for a test quiz.")
                .GreaterThanOrEqualTo(q => q.StartDate)
                .WithMessage("End date must be after or equal to start date.");
        });

        RuleForEach(quiz => quiz.Questions).SetValidator(new QuestionValidator(_context));
    }

    private bool BeUniqueName(string name) {
        return !_context.Quizzes.Any(q => q.Name == name);
    }

    private bool HaveAtLeastOneQuestion(ICollection<Question> questions) {
        return questions != null && questions.Count > 0;
    }
}
