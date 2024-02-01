namespace prid.Models;

public class UserDTO
{
    public int ID { get; set; }
    public string Pseudo { get; set; } = null!;
    public string? Email { get; set; } = null!;
    public string? LastName { get; set; }
    public string? FirstName { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public Role Role { get; set; }
    public string? Token { get; set; }
}

public class UserWithPasswordDTO : UserDTO
{
    public string Password { get; set; } = null!;
}
