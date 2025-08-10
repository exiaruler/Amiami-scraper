using System;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;
[Index(nameof(ItemTag))]
public class Tag:ModelBase
{
    // search reference
    public required string ItemTag {get; set;}
    // tag search by wish list
    public Boolean Search { get; set; }
    // added manually by user
    public bool ManualAdd { get; set; } = false;
    // system created tag
    public bool SystemAdd { get; set; } = false;
    public ICollection<Item> Items { get; set; } = new List<Item>();
}
