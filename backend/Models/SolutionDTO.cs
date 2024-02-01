namespace prid.Models;

public class SolutionDTO
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int Order { get; set; }
    public string Sql { get; set; } = null!;
}