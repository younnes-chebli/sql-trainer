using prid.Models;

namespace prid.Helpers;

public static class QuizzesService
{
    public static void SetStudentAttempts(QuizWithDatabaseWithAttemptsDTO quiz, User loggedUser) {
        var studentAttempts = quiz.Attempts
                                        .Where(a => a.StudentId == loggedUser.ID)
                                        .ToList();

        quiz.Attempts = studentAttempts;
        quiz.LastAttempt = studentAttempts.LastOrDefault();
    }

    public static void SetFirstQuestionId(QuizWithDatabaseWithAttemptsDTO quiz, PridContext _context) {
        var firstQuestion = _context.Questions.FirstOrDefault(q => q.QuizId == quiz.Id);

        if (firstQuestion != null) {
            quiz.FirstQuestionId = firstQuestion.Id.ToString();
        }
    }

    public static void SetStatusTeacher(QuizWithDatabaseDTO q) {
        if (q.EndDate < DateTimeOffset.Now) {
            q.Status = "CLOTURE";
        } else if (q.IsPublished) {
            q.Status = "PUBLIE";
        } else {
            q.Status = "PAS PUBLIE";
        }
    }

    public static void SetStatusStudent(QuizWithDatabaseWithAttemptsDTO q) {
        var attemptsCount = q.Attempts.Count;
        var lastAttemptFinishDate = q.LastAttempt?.Finish;

        if (q.EndDate != null) {
            if (q.EndDate < DateTimeOffset.Now) {
                q.Status = "CLOTURE";
            }
            if (q.EndDate > DateTimeOffset.Now && attemptsCount == 0) {
                q.Status = "PAS_COMMENCE";
            }
        } else {
            if (attemptsCount == 0) {
                q.Status = "PAS_COMMENCE";
            }
        }
        if (attemptsCount != 0 && lastAttemptFinishDate != null) {
            q.Status = "FINI";
        }
        if (attemptsCount != 0 && lastAttemptFinishDate == null) {
            q.Status = "EN_COURS";
        }
    }
}