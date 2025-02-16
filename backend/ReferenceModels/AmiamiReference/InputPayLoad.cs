using System;
using backend.ReferenceModels.Setting;

namespace backend.ReferenceModels.AmiamiReference;

public class InputPayLoad
{
    public required string search {get; set;}
    public required string postApi{get; set;}
    public required Config config {get; set;}
    public required PayLoad payload {get; set;}

}
