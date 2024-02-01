using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid.Helpers;
using System.Text.RegularExpressions;

namespace prid.Models;

public class UserValidator : AbstractValidator<User>
{
    private readonly PridContext _context;

    public UserValidator(PridContext context) {
        _context = context;

        RuleFor(u => u.Pseudo)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10)
            .Matches("^[a-zA-Z][a-zA-Z0-9_]*$", RegexOptions.IgnoreCase)
            .WithMessage("'{PropertyName}' must start with a letter and contain only letters, digits, or underscores.");

        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10);

        RuleFor(u => u.Email)
        .NotEmpty()
        .EmailAddress();

        RuleFor(u => u.LastName)
            .MinimumLength(3)
            .MaximumLength(50)
            .Must(name => !name.StartsWith(" ") && !name.EndsWith(" "))
            .When(m => !string.IsNullOrWhiteSpace(m.FirstName))
            .WithMessage("'{PropertyName}' cannot start or end with space or tabulation.");

        RuleFor(u => u.FirstName)
            .MinimumLength(3)
            .MaximumLength(50)
            .Must(name => !name.StartsWith(" ") && !name.EndsWith(" "))
            .When(m => !string.IsNullOrWhiteSpace(m.LastName))
            .WithMessage("'{PropertyName}' cannot start or end with space or tabulation.");

        RuleFor(u => new { u.LastName, u.FirstName })
            .Must(u => String.IsNullOrEmpty(u.LastName) && String.IsNullOrEmpty(u.FirstName) ||
                       !String.IsNullOrEmpty(u.LastName) && !String.IsNullOrEmpty(u.FirstName))
            .WithMessage("'Last Name' and 'First Name' must be both empty or both not empty.");

        RuleFor(u => new { u.ID, u.Pseudo })
            .MustAsync((u, token) => BeUniquePseudo(u.ID, u.Pseudo, token))
            .OverridePropertyName(nameof(User.Pseudo))
            .WithMessage("'{PropertyName}' must be unique.");

        RuleFor(u => new { u.ID, u.Email })
            .MustAsync((u, token) => BeUniqueEmail(u.ID, u.Email, token))
            .OverridePropertyName(nameof(User.Email))
            .WithMessage("'{PropertyName}' must be unique.");

        RuleFor(u => new { u.ID, u.LastName, u.FirstName })
            .MustAsync((u, token) => BeUniqueFullName(u.ID, u.LastName, u.FirstName, token))
            .WithMessage("The combination of 'Last Name' and 'First Name' must be unique.");

        RuleFor(u => u.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(u => u.Age)
                    .GreaterThanOrEqualTo(18)
                    .LessThanOrEqualTo(125);
            });

        RuleFor(m => m.Role)
        .IsInEnum();

        RuleSet("authenticate", () => {
            RuleFor(m => m.Token)
                .NotNull().OverridePropertyName("Password").WithMessage("Incorrect password.");
        });

    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(User? user) {
        if (user == null)
            return ValidatorHelper.CustomError("User not found.", "Pseudo");
        return await this.ValidateAsync(user!, o => o.IncludeRuleSets("authenticate"));
    }

    private async Task<bool> BeUniquePseudo(int id, string pseudo, CancellationToken token) {
        return !await _context.Users.AnyAsync(u => u.ID != id &&
                                                   u.Pseudo == pseudo,
                                              cancellationToken: token);
    }

    private async Task<bool> BeUniqueEmail(int id, string email, CancellationToken token) {
        return !await _context.Users.AnyAsync(u => u.ID != id &&
                                                   u.Email == email,
                                              cancellationToken: token);
    }

    private async Task<bool> BeUniqueFullName(int id, string? lastName, string? firstName, CancellationToken token) {
        if (lastName == null && firstName == null) return true;
        return !await _context.Users.AnyAsync(u => u.ID != id &&
                                                   u.LastName == lastName &&
                                                   u.FirstName == firstName,
                                              cancellationToken: token);
    }
}
