using AutoMapper;

namespace prid.Models;

public class MappingProfile : Profile
{
    private PridContext _context;

    public MappingProfile(PridContext context) {
        _context = context;

        CreateMap<Answer, AnswerDTO>();
        CreateMap<AnswerDTO, Answer>();

        CreateMap<Attempt, AttemptWithQuizDTO>();
        CreateMap<AttemptWithQuizDTO, Attempt>();

        CreateMap<Attempt, AttemptDTO>();
        CreateMap<AttemptDTO, Attempt>();

        CreateMap<Attempt, AttemptWithAnswersDTO>();
        CreateMap<AttemptWithAnswersDTO, Attempt>();

        CreateMap<Database, DatabaseDTO>();
        CreateMap<DatabaseDTO, Database>();

        CreateMap<Question, QuestionWithQuizDTO>();
        CreateMap<QuestionWithQuizDTO, Question>();

        CreateMap<Question, QuestionWithSolutionsDTO>();
        CreateMap<QuestionWithSolutionsDTO, Question>();

        CreateMap<Question, QuestionWithSolutionsAndAnswersDTO>();
        CreateMap<QuestionWithSolutionsAndAnswersDTO, Question>();

        CreateMap<Quiz, QuizDTO>();
        CreateMap<QuizDTO, Quiz>();

        CreateMap<Quiz, QuizWithDatabaseDTO>();
        CreateMap<QuizWithDatabaseDTO, Quiz>();

        CreateMap<Quiz, QuizWithDatabaseWithQuestionsAndSolutionsDTO>();
        CreateMap<QuizWithDatabaseWithQuestionsAndSolutionsDTO, Quiz>();

        CreateMap<Quiz, QuizWithDatabaseWithAttemptsDTO>();
        CreateMap<QuizWithDatabaseWithAttemptsDTO, Quiz>();

        CreateMap<Solution, SolutionDTO>();
        CreateMap<SolutionDTO, Solution>();

        CreateMap<Student, StudentDTO>();
        CreateMap<StudentDTO, Student>();

        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();

        CreateMap<User, UserWithPasswordDTO>();
        CreateMap<UserWithPasswordDTO, User>();
    }
}
