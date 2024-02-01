using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid.Models;

public class Attempt
{
    [Key]
    public int Id { get; set; }
    public DateTimeOffset Start { get; set; }
    public DateTimeOffset? Finish { get; set; }
    [ForeignKey(nameof(Quiz))]
    public int QuizId { get; set; }
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }

    public Student Student { get; set; } = null!;
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    public Quiz Quiz { get; set; } = null!;

    [NotMapped]
    public double? Evaluation { get; set; }

    public Attempt() { }
}