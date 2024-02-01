using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using prid.Models;
using System.Data;

namespace prid.Helpers;

public static class EvaluationService
{
    private static void SetErrors(AnswerDTO answerDTO, DataTable answerTable, DataTable solutionTable) {
        if (answerTable.Rows.Count != solutionTable.Rows.Count)
            answerDTO.Errors.Add("nombre de lignes incorrect");

        if (answerTable.Columns.Count != solutionTable.Columns.Count)
            answerDTO.Errors.Add("nombre de colonnes incorrect");
    }

    private static (string[] columns, string[][] data) Parkour(DataTable table) {
        // Récupère les noms des colonnes dans un tableau de strings
        var RowCount = table.Rows.Count;
        var Columns = new string[table.Columns.Count];
        for (int i = 0; i < table.Columns.Count; ++i)
            Columns[i] = table.Columns[i].ColumnName;

        // Récupère les données dans un tableau de strings à deux dimensions
        var Data = new string[table.Rows.Count][];
        for (int j = 0; j < table.Rows.Count; ++j) {
            Data[j] = new string[table.Columns.Count];
            for (int i = 0; i < table.Columns.Count; ++i) {
                object value = table.Rows[j][i];
                string str;
                if (value == null)
                    str = "NULL";
                else {
                    if (value is DateTime d) {
                        if (d.TimeOfDay == TimeSpan.Zero)
                            str = d.ToString("yyyy-MM-dd");
                        else
                            str = d.ToString("yyyy-MM-dd hh:mm:ss");
                    } else
                        str = value?.ToString() ?? "";
                }
                Data[j][i] = str;
            }
        }

        return (Columns, Data);
    }

    private static void CompareTables(AnswerDTO answerDTO, string[][] answerTableData, string[][] solutionTableData) {
        List<string> sortedAnswer = new();
        List<string> sortedSolution = new();

        for (int i = 0; i < answerTableData.Length; ++i) {
            sortedAnswer.AddRange(answerTableData[i]);
            sortedSolution.AddRange(solutionTableData[i]);
        }

        sortedAnswer.Sort();
        sortedSolution.Sort();

        if (!sortedAnswer.SequenceEqual(sortedSolution))
            answerDTO.Errors.Add("wrong data");

    }

    private static AnswerDTO GetEvaluatedAnswer(AnswerDTO answerDTO, DataTable answerTable, DataTable solutionTable) {
        SetErrors(answerDTO, answerTable, solutionTable);

        if (answerDTO.Errors.Count == 0) {
            var (answerTableColumns, answerTableData) = Parkour(answerTable);
            answerDTO.ResultColumns = answerTableColumns;
            answerDTO.ResultData = answerTableData;

            var (solutionTableColumns, solutionTableData) = Parkour(answerTable);
            CompareTables(answerDTO, answerTableData, solutionTableData);
        }

        return answerDTO;
    }

    public static async Task<AnswerDTO> Evaluate(AnswerDTO answerDTO, PridContext _context) {
        var question = await _context.Questions.FindAsync(answerDTO.QuestionId);
        var firstSolution = await _context.Solutions.FirstOrDefaultAsync(s => s.QuestionId == answerDTO.QuestionId);
        var quiz = await _context.Quizzes.FindAsync(question!.QuizId);
        var database = await _context.Databases.FindAsync(quiz!.DatabaseId);

        using MySqlConnection connection = new($"server=localhost;database={database!.Name};uid=root;password=");
        DataTable answerTable;
        DataTable solutionTable;


        try {
            connection.Open();
            MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + answerDTO.Sql, connection);
            MySqlDataAdapter adapter = new MySqlDataAdapter(command);
            answerTable = new DataTable();
            adapter.Fill(answerTable);

            MySqlCommand command2 = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + firstSolution!.Sql, connection);
            MySqlDataAdapter adapter2 = new MySqlDataAdapter(command2);
            solutionTable = new DataTable();
            adapter2.Fill(solutionTable);

            return GetEvaluatedAnswer(answerDTO, answerTable, solutionTable);
        } catch (Exception e) {
            string error = e.Message;
            answerDTO.Errors.Add(error);
            return answerDTO;
        }
    }
}