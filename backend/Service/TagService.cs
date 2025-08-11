using System;
using backend.Base;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Service;

public class TagService : BaseService
{
    public TagService(AppDbContext context) : base(context)
    {
    }
    public async Task<Tag> AddTagAsync(Tag tag)
    {
        Tag? addTag = null;
        var tagExist = _context.Tag.Where(rec => rec.ItemTag.ToLower().Contains(tag.ItemTag.ToLower()));
        if (tagExist.Count() == 0)
        {
            _context.Tag.Add(tag);
            var save = await _context.SaveChangesAsync();
            addTag = tag;
        }
        return addTag;
    }
    public async Task<List<Tag>> GetTagsAsync()
    {
        return await _context.Tag.ToListAsync();
    }
    public async Task<Tag> GetTag(long id, bool sold)
    {
        var exist = await _context.Tag.Include(tag => tag.Items.Where(it => it.SoldOut == sold)).FirstOrDefaultAsync(tag => tag.Id == id);
        return exist;
    }
    public async Task<string> DeleteTag(long id)
    {
        string res = "ok";
        var exist = await _context.Tag.FindAsync(id);
        if (exist.ManualAdd)
        {
            _context.Tag.Remove(exist);
            await _context.SaveChangesAsync();
        }
        else res = "Tag is not a custom input but wishlist generated";
        return res;
    }

}
