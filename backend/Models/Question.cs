using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public class Question
{
    [Key]
    public int Id { get; set; }
    [ForeignKey(nameof(Quiz))]
    public int QuizId { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = null!;

    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    public ICollection<Solution> Solutions { get; set; } = new HashSet<Solution>();
    public Quiz Quiz { get; set; } = null!;

    [NotMapped]
    public DateTimeOffset? LastAnswerTimestamp { get; set; }

    [NotMapped]
    public Answer? LastAnswer { get; set; }

    [NotMapped]
    public int[] QuestionIds { get; set; } = null!;

    public Question() { }
}