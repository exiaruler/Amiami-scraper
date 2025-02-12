using System.Collections;
using System.ComponentModel;
using System.Net;
using backend.Base;
using backend.Models;
using backend.ReferenceModels;
using backend.ReferenceModels.AmiamiReference;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
namespace backend.Controller
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : BaseController
    {
         private readonly AppDbContext _context;
         public ItemController(AppDbContext context){
            _context=context;
         }

        [HttpGet("get-items")]
        public async Task<ActionResult<IEnumerable<Item>>>GetItems(){
            return await _context.Item.Include(item=>item.Tags).ToListAsync();
        }
        // search items by tag and sold status
        [HttpGet("get-items-tag/{search?}/{sold?}")]
        public async Task<ActionResult<IEnumerable<Item>>>GetItemsTag(string search,Boolean sold){
            long tagId=GetDataLong("select "+QuoteField("Id")+" from public."+QuoteField("Tag")+" where lower("+QuoteField("ItemTag")+") ="+QuoteParam(search.ToLower()));  
            return await _context.Item.Where(item=>item.SoldOut==sold).Where(item=>item.Tags.Any(fil=>fil.Id==tagId)).Include(item=>item.Tags).ToListAsync();
        }
    
        [HttpGet("get-item/{id?}")]
        public async Task<ActionResult<Item>> GetItem(long id){
            var item=await _context.Item.Include(item=>item.Tags).FirstOrDefaultAsync(item=>item.Id==id);
            if(item!=null){
                return item;
            }else return NotFound();
        }
        // add, update and delete item data
        [HttpPost("update-inventory")]
        public async Task<ActionResult<Item>> AddItemsBatch(AmiamiJson batchJsonString){
            AmiamiJson jsonObj=batchJsonString;
            if(jsonObj!=null){
                // create or check for existing search tag
                long tagId=GetDataLong("select "+QuoteField("Id")+" from public."+QuoteField("Tag")+" where lower("+QuoteField("ItemTag")+") ="+QuoteParam(jsonObj.search.ToLower()));
                var tagExist=_context.Tag.Find(tagId);
                Tag? tag =null;
                if(tagExist==null){
                    tag = new Tag{ItemTag = jsonObj.search};
                }else tag=tagExist;
                List<Amiami> amiamiList=jsonObj.items;
                DateTime currDateTime=DateTime.UtcNow;
                for(int i=0; i<amiamiList.Count(); i++){
                    Amiami ami=amiamiList[i];
                    // check if item alaready exist
                    long getId= GetDataLong("select "+QuoteField("Id")+" from public."+QuoteField("Item")+" where "+QuoteField("ShopIdCode")+" ="+QuoteParam(ami.gcode));
                    var existItem=await _context.Item.Include(item=>item.Tags).FirstOrDefaultAsync(item=>item.Id==getId);
                    if(existItem!=null){
                        existItem.LastSeenDateTime=currDateTime;
                        existItem.LastSeenDate=currDateTime.Date.ToString();
                        existItem.LastSeenTime=new TimeSpan();
                        existItem.Price=ami.min_price;
                        existItem.SoldOut=false;
                        existItem.TransactionId=jsonObj.transactionId;
                        existItem.Name=ami.gname;
                        if(!existItem.Tags.Contains(tag)){
                            tag.Items.Add(existItem);
                            existItem.Tags.Add(tag);
                        }
                        _context.Item.Update(existItem);
                    }else
                    {
                        Item newItem=new Item{Name=ami.gname, ShopIdCode=ami.gcode,TransactionId=jsonObj.transactionId};
                        newItem.Manufacturer=ami.maker_name;
                        newItem.Price=ami.min_price;
                        newItem.UrlLink="https://www.amiami.com/eng/detail/?gcode="+ami.gcode;
                        newItem.Tags.Add(tag);
                        newItem.LastSeenDateTime=currDateTime;
                        newItem.LastSeenDate=currDateTime.Date.ToString();
                        tag.Items.Add(newItem);
                        _context.Item.Add(newItem);
                    }
                    
                }
                if(tagExist!=null){
                    _context.Tag.Update(tag);
                }else _context.Tag.Add(tag);

                await _context.SaveChangesAsync();
                // update items by search tag that have not been update to update those items as sold out to true
                string updateQuery="Update public."+QuoteField("Item")+" as Up";
                updateQuery+=" Set "+QuoteField("SoldOut")+"='true'";
                updateQuery+=" From public."+QuoteField("Item")+" as Item";
                updateQuery+=" Inner join public."+QuoteField("ItemTags")+" as Tag";
                updateQuery+=" On Tag."+QuoteField("ItemsId")+"= Item."+QuoteField("Id");
                updateQuery+=" where Tag."+QuoteField("TagsId")+"= (Select "+QuoteField("Id")+" from public."+QuoteField("Tag")+" where Lower("+QuoteField("ItemTag")+") ="+QuoteParam(jsonObj.search.ToLower())+")";
                updateQuery+=" and Up."+QuoteField("LastSeenDateTime")+"<"+QuoteParam(currDateTime.ToString());
                updateQuery+=" and Tag."+QuoteField("ItemsId")+"= Up."+QuoteField("Id");
                Console.WriteLine(updateQuery);
                ExecuteQuery(updateQuery);
            }else return StatusCode(500);
            
            return Ok();
        }
    }
}
