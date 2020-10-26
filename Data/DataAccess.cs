using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using System;
using System.Data;
using Microsoft.Data.Sqlite;
using System.Linq;

namespace WebAppDemo.Data
{
    public class DataAccess
    {
        private string _connString;

        public DataAccess(string connectionString)
        {
            _connString = connectionString;
        }

        public async Task<List<T>> Get<T>(string sql)
        {
            using (IDbConnection connection = new SqliteConnection(_connString))
            {
                var rows = await connection.QueryAsync<T>(sql);
                return rows.ToList();
            }
        }
        public async Task<T> GetFirstOrDefault<T>(string sql)
        {
            using (IDbConnection connection = new SqliteConnection(_connString))
            {
                T row = await connection.QueryFirstOrDefaultAsync<T>(sql);
                return row;
            }
        }
        public async Task Set(string sql)
        {
            using (IDbConnection connection = new SqliteConnection(_connString))
            {
                await connection.ExecuteAsync(sql);
            }
        }
    }
}