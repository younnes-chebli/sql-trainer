namespace prid.Models;

public class Student : User
{
    public ICollection<Attempt> Attempts { get; set; } = new HashSet<Attempt>();

    public Student() {
        Role = Role.Student;
    }
}