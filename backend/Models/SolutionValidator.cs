using FluentValidation;

namespace prid.Models;

public class SolutionValidator : AbstractValidator<Solution>
{
    private readonly PridContext _context;

    public SolutionValidator(PridContext context) {
        _context = context;

        RuleFor(solution => solution.Sql)
            .NotEmpty().WithMessage("Sql solution is required.")
            .Must(sql => !string.IsNullOrWhiteSpace(sql));

        RuleFor(solution => solution.Order)
            .Must(BeUniqueOrderInQuestion)
            .WithMessage("Each solution must have a unique order number within the question.");
    }

    private bool BeUniqueOrderInQuestion(Solution solution, int order) {
        var question = _context.Questions.Find(solution.QuestionId);
        if (question == null) return true;

        return !question.Solutions
                .Any(s => s.Order == order && s.Id != solution.Id);
    }
}
