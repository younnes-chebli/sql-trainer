using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public class Answer
{
    [Key]
    public int Id { get; set; }

    public string Sql { get; set; } = null!;
    public DateTimeOffset? Timestamp { get; set; }
    public bool IsCorrect { get; set; }
    [ForeignKey(nameof(Attempt))]
    public int AttemptId { get; set; }
    [ForeignKey(nameof(Question))]
    public int QuestionId { get; set; }

    public Attempt Attempt { get; set; } = null!;
    public Question Question { get; set; } = null!;

    [NotMapped]
    public List<string> Errors { get; set; } = new List<string>();
    [NotMapped]
    public string[] ResultColumns { get; set; } = Array.Empty<string>();
    [NotMapped]
    public string[][] ResultData { get; set; } = Array.Empty<string[]>();

    public Answer() {
        Timestamp = DateTimeOffset.Now;
    }
}