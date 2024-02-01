namespace prid.Models;

public class QuestionDTO
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public int Order { get; set; }
    public string Body { get; set; } = null!;
    public DateTimeOffset? LastAnswerTimestamp { get; set; }
    public AnswerDTO? LastAnswer { get; set; }
    public int[] QuestionIds { get; set; } = null!;
}

public class QuestionWithQuizDTO : QuestionDTO
{
    public QuizWithDatabaseWithAttemptsDTO Quiz { get; set; } = null!;
}

public class QuestionWithSolutionsAndAnswersDTO : QuestionWithQuizDTO
{
    public ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();
    public ICollection<AnswerDTO> Answers { get; set; } = new HashSet<AnswerDTO>();
}

public class QuestionWithSolutionsDTO : QuestionDTO
{
    public ICollection<SolutionDTO> Solutions { get; set; } = new HashSet<SolutionDTO>();
}