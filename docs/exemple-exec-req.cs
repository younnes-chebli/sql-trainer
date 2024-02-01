string sql = "SELECT * FROM P";
using MySqlConnection connection = new($"server=localhost;database=fournisseurs;uid=root;password=root");
DataTable table;
try {
    connection.Open();
    MySqlCommand command = new MySqlCommand("SET sql_mode = 'STRICT_ALL_TABLES'; " + sql, connection);
    MySqlDataAdapter adapter = new MySqlDataAdapter(command);
    table = new DataTable();
    adapter.Fill(table);
} catch (Exception e) {
    Error = e.Message;
    return false;
}
