using System;

namespace backend.ReferenceModels.AmiamiReference;

public class AmiamiJson
{
    public required string search{get; set;}
    public required List<Amiami> items {get;set;}
    public int total{get; set;}
    public Boolean finalRequest{get; set;}=false;
    public required string transactionId{get; set;}
    public required PayLoad payLoad{get; set;}
}
