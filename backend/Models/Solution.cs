using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public class Solution
{
    [Key]
    public int Id { get; set; }
    [ForeignKey(nameof(Question))]
    public int QuestionId { get; set; }
    public int Order { get; set; }
    public string Sql { get; set; } = null!;

    public Question Question { get; set; } = null!;

    public Solution() { }
}