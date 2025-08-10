using System;
using backend.ReferenceModels.Setting;
using Npgsql;

namespace backend.Base;

public class BaseService
{
    public readonly AppDbContext _context;
    private string? Connection = "";
    public ServerConfiguration ServerConfig = new ServerConfiguration { };

    public BaseService(AppDbContext context)
    {
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        var serverConfig = config.GetSection("ServerConfiguration").Get<ServerConfiguration>();
        if (serverConfig != null)
        {
            ServerConfig = serverConfig;
        }
        string? sqlConnect = config.GetConnectionString("DefaultConnection");
        Connection = sqlConnect;
        _context = context;
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
    public int GetDataInt(string query)
    {
        int output = (int)Int128.MinValue;
        try
        {
            using (var conn = new NpgsqlConnection(Connection))
            {
                conn.Open();
                using (var cmd = new NpgsqlCommand(query, conn))
                {
                    var value = cmd.ExecuteScalar()?.ToString() ?? string.Empty;
                    if (value != "") output = (int)Int128.Parse(value);

                }
            }

        }
        catch
        {
            
        }
        return output;
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
    public Object GetDataQuery(string query)
    {
        Object res = new Object();
        using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            using (var cmd = new NpgsqlCommand(query, conn))
            {
                var value = cmd.ExecuteScalar();
                //if(value!="") output=long.Parse(value);
                //return output;
            }
        }
        return res;
    }
    // query to retrieve multiple rows
    public NpgsqlDataReader CreateQuery(string query)
    {
        using (var conn = new NpgsqlConnection(Connection))
        {
            conn.Open();
            using (var cmd = new NpgsqlCommand(query, conn))
            using (var reader = cmd.ExecuteReader())
                return reader;
        }
    }
    // execute INSERT and UPDATE queries
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
    public string QuoteTable(string table){
        return "public."+QuoteField(table);
    }

}
