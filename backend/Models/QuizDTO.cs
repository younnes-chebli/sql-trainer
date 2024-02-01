namespace prid.Models;

public class QuizDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int DatabaseId { get; set; }
    public bool IsPublished { get; set; }
    public bool IsTest { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }

    public string? Status { get; set; }
    public string? FirstQuestionId { get; set; }
    public AttemptWithAnswersDTO? LastAttempt { get; set; }
    public bool? HasAttempt { get; set; }
}

public class QuizWithDatabaseDTO : QuizDTO
{
    public DatabaseDTO Database { get; set; } = null!;

}

public class QuizWithDatabaseWithAttemptsDTO : QuizWithDatabaseDTO
{
    public ICollection<AttemptWithAnswersDTO> Attempts { get; set; } = new HashSet<AttemptWithAnswersDTO>();
}

public class QuizWithDatabaseWithQuestionsAndSolutionsDTO : QuizWithDatabaseDTO
{
    public ICollection<QuestionWithSolutionsDTO> Questions { get; set; } = new HashSet<QuestionWithSolutionsDTO>();
}
