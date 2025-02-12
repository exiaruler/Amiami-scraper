using System;

namespace backend.ReferenceModels.AmiamiReference;

public class AmiamiJson
{
    public required string search{get; set;}
    public required List<Amiami> items {get;set;}
    public int total{get; set;}
    public required string transactionId{get; set;}
}
