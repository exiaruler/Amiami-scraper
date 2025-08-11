using System.Collections;
using System.ComponentModel;
using System.Net;
using backend.Base;
using backend.Models;
using backend.ReferenceModels;
using backend.ReferenceModels.AmiamiReference;
using backend.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Newtonsoft.Json;
namespace backend.Controller
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        public ItemService itemService;
        public ItemController(ItemService itemService)
        {
            this.itemService = itemService;
        }

        [HttpGet("get-items")]
        public async Task<ActionResult<IEnumerable<Item>>>GetItems(){
            return await itemService.GetItemsAsync();
        }
        // search items by tag and sold status
        [HttpGet("get-items-tag/{search?}/{sold?}")]
        public async Task<ActionResult<IEnumerable<Item>>>GetItemsTag(string search,Boolean sold){
            var items = await itemService.GetItemsByTagAsync(search, sold);
            if (items.Count<1) return NotFound("Item with that tag does not exist");
            return items;
        }
        [HttpGet("get-items-wide/{search?}/{sold?}")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItemsWideSearch(string search, Boolean sold)
        {
            var items = await itemService.GetItemsWide(search, sold);
            if (items.Count<1) return NotFound("Item with that tag does not exist");
            return items;
        }
    
        [HttpGet("get-item/{id?}")]
        public async Task<ActionResult<Item>> GetItem(long id){
            var item = await itemService.GetItemAsync(id);
            if(item!=null){
                return item;
            }else return NotFound();
        }
        // add, update and delete item data
        [HttpPost("update-inventory")]
        public async Task<ActionResult<Item>> AddItemsBatch(AmiamiJson batchJsonString){

            string result = await itemService.AmiamiUpdate(batchJsonString);
            if (result != "ok") return ValidationProblem(result);
            return Ok(result);
        }
    }
}
