using System;
using Microsoft.AspNetCore.Mvc.Routing;

namespace backend.Models;

public class WishList:ModelBase
{
    // item to search for
    public string Wish{get; set;}="";
    // url used for scheduler
    public string Url{get; set;}="";
    // body for post request
    public string Body {get; set;}="";
    // last update date and time
    public DateTime LastUpdate { get; set; }
    // last update date
    public string LastDate { get; set; } = "";
    // last update time
    public string LastTime { get; set; } = "";
    // items found associated to wish list
    public ICollection<Item> Items { get; set; } = new List<Item>();

}
