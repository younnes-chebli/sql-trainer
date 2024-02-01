namespace prid.Models;

public class AttemptDTO
{
    public int Id { get; set; }
    public DateTimeOffset Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
    public int QuizId { get; set; }
    public int StudentId { get; set; }
    public double Evaluation { get; set; }
}

public class AttemptWithAnswersDTO : AttemptDTO
{
    public ICollection<AnswerDTO> Answers { get; set; } = new HashSet<AnswerDTO>();
}

public class AttemptWithQuizDTO : AttemptDTO
{
    public QuizDTO Quiz { get; set; } = null!;
}