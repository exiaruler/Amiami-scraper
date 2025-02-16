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
    // items found associated to wish lish
    public ICollection<Item> Items{get; set;}=new List<Item>();

}
