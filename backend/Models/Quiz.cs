using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public enum Status
{
    EN_COURS = 0,
    FINI = 1,
    PAS_COMMENCE = 2,
    CLOTURE = 3
}

public class Quiz
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int DatabaseId { get; set; }
    public bool IsPublished { get; set; }
    public bool IsTest { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }

    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();
    public Database Database { get; set; } = null!;

    [NotMapped]
    public string? Status { get; set; }

    [NotMapped]
    public string? FirstQuestionId { get; set; }

    [NotMapped]
    public Attempt? LastAttempt { get; set; }

    [NotMapped]
    public bool? HasAttempt { get; set; }

    public Quiz() { }
}