using System;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;
[Index(nameof(ItemTag))]
public class Tag:ModelBase
{
    // search reference
    public required string ItemTag {get; set;}
    public ICollection<Item> Items {get;set;}=new List<Item>();
}
