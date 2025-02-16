using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace backend.Models;
[Index(nameof(ShopIdCode),nameof(TransactionId))]
public class Item:ModelBase
{   
    // item name
    public required string Name {get;set;}
    // item manufactuer
    public string? Manufacturer {get; set;}
    // unique id of item from shop
    public required string ShopIdCode {get; set;}
    // url link to item from that shop
    public string? UrlLink {get; set;}
    // price (currently yen)
    public int Price {get; set;}
    // transaction Id when entered 
    public required string TransactionId{get; set;}
    // item last previous seen when update occurs
    public DateTime LastSeenDateTime {get; set;}=DateTime.UtcNow;
    public string? LastSeenDate {get; set;}=DateTime.UtcNow.Date.ToString();
    public TimeSpan LastSeenTime {get; set;}=new TimeSpan();
    // item is sold out
    public Boolean SoldOut{get; set;}=false;
    // search keyword tags
    public ICollection<Tag> Tags {get;set;}=new List<Tag>();
    // items associate to wish list
    public ICollection<WishList> Wishs {get; set;}=new List<WishList>();
    

}
