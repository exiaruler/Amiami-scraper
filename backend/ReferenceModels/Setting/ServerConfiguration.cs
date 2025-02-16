using System;

namespace backend.ReferenceModels.Setting;

public class ServerConfiguration
{
    public string? ApiServer{get; set;}
    public string? ServerHost=Environment.GetEnvironmentVariable("ASPNETCORE_URLS")+"/api";
}
