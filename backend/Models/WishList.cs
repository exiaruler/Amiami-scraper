using System;
using Microsoft.AspNetCore.Mvc.Routing;

namespace backend.Models;

public class WishList:ModelBase
{
    public required string Wish{get; set;}
    // url used for scheduler
    public required string Url{get; set;}
}
