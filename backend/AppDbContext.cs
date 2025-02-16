using System;
using System.Collections.Generic;
using backend.Models;
using Microsoft.EntityFrameworkCore;
namespace backend;
public class AppDbContext:DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>().HasMany(it=>it.Tags).WithMany(c=>c.Items).UsingEntity("ItemTags");
        modelBuilder.Entity<WishList>().HasMany(wish=>wish.Items).WithMany(c=>c.Wishs).UsingEntity("WishItems");
    }
    public DbSet<Item> Item{get;set;}
    public DbSet<WishList> WishList{get;set;}
    public DbSet<Tag> Tag {get; set;}

}
