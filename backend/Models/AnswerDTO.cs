namespace prid.Models;

public class AnswerDTO
{
    public int Id { get; set; }
    public string Sql { get; set; } = null!;
    public DateTimeOffset? Timestamp { get; set; }
    public bool IsCorrect { get; set; }
    public int AttemptId { get; set; }
    public int QuestionId { get; set; }

    public List<string> Errors { get; set; } = new List<string>();
    public string[] ResultColumns { get; set; } = Array.Empty<string>();
    public string[][] ResultData { get; set; } = Array.Empty<string[]>();
}