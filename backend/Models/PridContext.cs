using Microsoft.EntityFrameworkCore;

namespace prid.Models;

public class PridContext : DbContext
{
    public PridContext(DbContextOptions<PridContext> options)
        : base(options) {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Attempt> Attempts => Set<Attempt>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Solution> Solutions => Set<Solution>();
    public DbSet<Database> Databases => Set<Database>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        new SeedData(modelBuilder);

        // REGLES METIERS

        modelBuilder.Entity<Quiz>()
            .HasIndex(quizz => quizz.Name)
            .IsUnique();

        // modelBuilder.Entity<Question>()
        //     .HasIndex(question => new { question.QuizId, question.Order })
        //     .IsUnique();

        // modelBuilder.Entity<Solution>()
        //     .HasIndex(solution => new { solution.QuestionId, solution.Order })
        //     .IsUnique();

        modelBuilder.Entity<Quiz>()
            .Property(quizz => quizz.Name)
            .IsRequired();

        modelBuilder.Entity<Question>()
            .Property(question => question.Body)
            .IsRequired();

        modelBuilder.Entity<Solution>()
            .Property(solution => solution.Sql)
            .IsRequired();
    }
}
