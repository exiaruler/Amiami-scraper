using backend.Base;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controller
{
    [Route("api/tag")]
    [ApiController]
    public class TagController : BaseController
    {
        public TagController(AppDbContext context) : base(context)
        {
        }
        [HttpGet("new")]
        public ActionResult<Tag> NewTag()
        {
            return new Tag { ItemTag = "", ManualAdd = true };
        }
        [HttpPost("add")]
        public async Task<ActionResult<Tag>> AddTag(Tag tag)
        {
            var tagExist = _context.Tag.Where(rec => rec.ItemTag.ToLower().Contains(tag.ItemTag.ToLower()));
            if (tagExist.Count() == 0)
            {
                _context.Tag.Add(tag);
                var save = await _context.SaveChangesAsync();
            }
            else return Content("Tag already exist");

            return tag;
        }
        [HttpGet("get-tags")]
        public async Task<ActionResult<IEnumerable<Tag>>> GetAllTags() {
            return await _context.Tag.ToListAsync();
        }
        [HttpGet("get-tag/{id?}/{sold?}")]
        public async Task<ActionResult<Tag>> GetTag(long id,bool sold){
            var exist=await _context.Tag.Include(tag=>tag.Items.Where(it=>it.SoldOut==sold)).FirstOrDefaultAsync(tag=>tag.Id==id);
            if(exist==null) return NotFound();
            return exist;
        }
        [HttpDelete("delete/{id?}")]
        public async Task<ActionResult> DeleteTag(long id)
        {
            var exist = await _context.Tag.FindAsync(id);
            if (exist == null) return NotFound();
            if (exist.ManualAdd)
            {
                _context.Tag.Remove(exist);
                await _context.SaveChangesAsync();
            }
            else return Content("Tag is not a custom input but wishlist generated");
            return Ok();
        }
    }
}
