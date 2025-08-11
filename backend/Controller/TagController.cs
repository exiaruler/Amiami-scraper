using backend.Base;
using backend.Models;
using backend.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controller
{
    [Route("api/tag")]
    [ApiController]
    public class TagController : ControllerBase
    {
        public readonly TagService tagService;
        public TagController(TagService tagService)
        {
            this.tagService = tagService;
        }
        [HttpGet("new")]
        public ActionResult<Tag> NewTag()
        {
            return new Tag { ItemTag = "", ManualAdd = true };
        }
        [HttpPost("add")]
        public async Task<ActionResult<Tag>> AddTag(Tag tag)
        {
            var addTag = await tagService.AddTagAsync(tag);
            if(addTag==null) return Content("Tag already exist");
            return Ok(addTag);
        }
        [HttpGet("get-tags")]
        public async Task<ActionResult<IEnumerable<Tag>>> GetAllTags() {
            return await tagService.GetTagsAsync();
        }
        [HttpGet("get-tag/{id?}/{sold?}")]
        public async Task<ActionResult<Tag>> GetTag(long id,bool sold){
            var exist = await tagService.GetTag(id, sold);
            if(exist==null) return NotFound();
            return Ok(exist);
        }
        [HttpDelete("delete/{id?}")]
        public async Task<ActionResult> DeleteTag(long id)
        {
            string delete = await tagService.DeleteTag(id);
            if(delete!="ok") return Content(delete);
            return Ok(delete);
        }
    }
}
