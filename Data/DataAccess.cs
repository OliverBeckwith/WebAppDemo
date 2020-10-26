using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using System;

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
            throw new NotImplementedException();
        }
        public async Task<T> GetFirstOrDefault<T>(string sql)
        {
            throw new NotImplementedException();
        }
        public async Task Set(string sql)
        {
            throw new NotImplementedException();
        }
    }
}