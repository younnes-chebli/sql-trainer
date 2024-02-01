// Récupère les noms des colonnes dans un tableau de strings
RowCount = table.Rows.Count;
Columns = new string[table.Columns.Count];
for (int i = 0; i < table.Columns.Count; ++i)
    Columns[i] = table.Columns[i].ColumnName;

// Récupère les données dans un tableau de strings à deux dimensions
Data = new string[table.Rows.Count][];
for (int j = 0; j < table.Rows.Count; ++j)
{
    Data[j] = new string[table.Columns.Count];
    for (int i = 0; i < table.Columns.Count; ++i)
    {
        object value = table.Rows[j][i];
        string str;
        if (value == null)
            str = "NULL";
        else
        {
            if (value is DateTime d)
            {
                if (d.TimeOfDay == TimeSpan.Zero)
                    str = d.ToString("yyyy-MM-dd");
                else
                    str = d.ToString("yyyy-MM-dd hh:mm:ss");
            }
            else
                str = value?.ToString() ?? "";
        }
        Data[j][i] = str;
    }
}
