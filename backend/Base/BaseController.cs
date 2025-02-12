
using System.Text.Json;
using backend.ReferenceModels.Setting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Npgsql;
namespace backend.Base;

public class BaseController: ControllerBase
{
    private string Connection="Host=localhost;Port=5432;Database=scraper;Username=postgres;Password=admin123";
    public BaseController(){
        using (StreamReader read=new StreamReader("appsettings.json"))
        {
            string json=read.ReadToEnd();
            Console.WriteLine(json);
            //settings=JsonConvert.DeserializeObject<List<AppSettings>>(json);
        }
    }
    public string GetDataString(string query)
    {
        using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            using (var cmd = new NpgsqlCommand(query, conn))
            {
                return cmd.ExecuteScalar()?.ToString() ?? string.Empty;
            }
        }
    }
    public int GetDataInt(string query){
        int output= (int)Int128.MinValue;
        using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            using (var cmd = new NpgsqlCommand(query,conn))
            {
                var value= cmd.ExecuteScalar()?.ToString() ?? string.Empty;
                if(value!="") output= (int)Int128.Parse(value);
                return output;
            }
        }
    }
    public long GetDataLong(string query){
        long output=long.MinValue;
        using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            using (var cmd = new NpgsqlCommand(query,conn))
            {
                var value= cmd.ExecuteScalar()?.ToString() ?? string.Empty;
                if(value!="") output=long.Parse(value);
                return output;
            }
        }
    }
    // query to retrieve multiple rows
    public NpgsqlDataReader CreateQuery(string query){
        using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            using (var cmd = new NpgsqlCommand(query,conn))
            using(var reader=cmd.ExecuteReader())
            return reader;
        }
    }
    public int ExecuteQuery(string query){
       using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            var cmd = new NpgsqlCommand(query,conn);
            int exe = cmd.ExecuteNonQuery();
            return exe;
        }
    }
    // quote param in single quotes
    public string QuoteParam(string param){
        return "'"+param+"'";
    }
    // quote field in double quotes
    public string QuoteField(string field){
        string output="\""+field+"\"";
        return output;
    }

}
