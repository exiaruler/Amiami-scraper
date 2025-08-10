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
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Newtonsoft.Json;
namespace backend.Controller
{
    [Route("api/item")]
    [ApiController]
    public class ItemController : BaseController
    {
        public ItemController(AppDbContext context) : base(context)
        {
        }

        [HttpGet("get-items")]
        public async Task<ActionResult<IEnumerable<Item>>>GetItems(){
            return await _context.Item.Include(item=>item.Tags).ToListAsync();
        }
        // search items by tag and sold status
        [HttpGet("get-items-tag/{search?}/{sold?}")]
        public async Task<ActionResult<IEnumerable<Item>>>GetItemsTag(string search,Boolean sold){
            long tagId=GetDataLong("select "+QuoteField("Id")+" from public."+QuoteField("Tag")+" where lower("+QuoteField("ItemTag")+") ="+QuoteParam(search.ToLower()));
            List<Item> itemsListTag=await _context.Item.Where(item => item.SoldOut == sold).Where(item => item.Tags.Any(fil => fil.Id == tagId)).Include(item => item.Wishs).ToListAsync();
            return itemsListTag;
        }
        [HttpGet("get-items-wide/{search?}/{sold?}")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItemsWideSearch(string search, Boolean sold)
        {
            search = search.ToLower();
            long tagId=GetDataLong("select "+QuoteField("Id")+" from public."+QuoteField("Tag")+" where lower("+QuoteField("ItemTag")+") ="+QuoteParam(search.ToLower()));
            List<Item> itemsSearchName = await _context.Item.Where(item => item.Name.ToLower().Contains(search) && item.SoldOut==sold || item.Tags.Any(fil => fil.Id == tagId) && item.SoldOut==sold).ToListAsync();
            // filter items that don't have the search tag and tag it
            // create tag if it does not exist
            if (tagId != long.MinValue)
            {
                Tag tag = new Tag { ItemTag = search };
                _context.Tag.Add(tag);
                //await _context.SaveChangesAsync();
                tagId = tag.Id;

            }
            else
            {
                
            }
            //await _context.Item.Where(item => item.Name.ToLower().Contains(search) && item.SoldOut == sold || item.Tags.Any(fil => fil.Id == tagId) && item.SoldOut == sold).ExecuteUpdateAsync();
                //List<Item> itemsNoTag=itemsSearchName.FindAll(item=> item.Tags.Any(fil => fil.Id != tagId));
                return itemsSearchName;
        }
    
        [HttpGet("get-item/{id?}")]
        public async Task<ActionResult<Item>> GetItem(long id){
            var item=await _context.Item.Include(item=>item.Tags).Include(item=>item.Wishs).FirstOrDefaultAsync(item=>item.Id==id);
            if(item!=null){
                return item;
            }else return NotFound();
        }
        // add, update and delete item data
        [HttpPost("update-inventory")]
        public async Task<ActionResult<Item>> AddItemsBatch(AmiamiJson batchJsonString){
            AmiamiJson jsonObj=batchJsonString;
            if (jsonObj != null) {
                // find wish list
                var wishList = await _context.WishList.Include(wish => wish.Items).FirstOrDefaultAsync(wish => wish.Id == jsonObj.payLoad.wishId);
                if (wishList != null && jsonObj.search.ToLower() == wishList.Wish.ToLower()) {
                    // create or check for existing search tag
                    long tagId = GetDataLong("select " + QuoteField("Id") + " from public." + QuoteField("Tag") + " where lower(" + QuoteField("ItemTag") + ") =" + QuoteParam(jsonObj.search.ToLower()));
                    var tagExist = _context.Tag.Find(tagId);
                    Tag? tag = null;
                    if (tagExist == null)
                    {
                        tag = new Tag { ItemTag = jsonObj.search, Search = true };
                    }
                    else
                    {
                        tag = tagExist;
                        tag.Search = true;
                    }

                    List<Amiami> amiamiList = jsonObj.items;
                    DateTime currDateTime = DateTime.UtcNow;
                    string[] dateArr = currDateTime.ToString().Split(" ");
                    string date = dateArr[0];
                    string time = dateArr[1] + dateArr[2];
                    for (int i = 0; i < amiamiList.Count(); i++)
                    {
                        Amiami ami = amiamiList[i];
                        // check if item alaready exist
                        long getId = GetDataLong("select " + QuoteField("Id") + " from public." + QuoteField("Item") + " where " + QuoteField("ShopIdCode") + " =" + QuoteParam(ami.gcode));
                        var existItem = await _context.Item.Include(item => item.Tags).FirstOrDefaultAsync(item => item.Id == getId);

                        // check for other existing search tags base on product name description (product line, character, series) create new tags if it does not exist
                        string prodName = ami.gname.Replace("[", "").Replace("]", "");
                        // remove specific words
                        string[] removeContains = { "Defective Item", "Manufacture Error Product", "Exclusive Sale" };
                        for (int a = 0; a < removeContains.Length; a++)
                        {
                            string filter = removeContains[a].ToLower();
                            if (prodName.ToLower().Contains(filter))
                            {
                                prodName = prodName.Replace(filter, "");
                            }
                        }
                        List<string> nameBreak = new();
                        nameBreak.AddRange(prodName.Split(" "));
                        string pasPart = "";
                        List<Tag> otherTagList = new List<Tag>();
                        /*
                        for (int x = 0; x < nameBreak.Count(); x++)
                        {
                            string part = nameBreak[x].ToLower();
                            var tagsQuery = _context.Tag.Where(rec => rec.ItemTag.ToLower().Contains(part) && rec.Id != tag.Id);
                            // if potential results exist verify by check in items
                            if (tagsQuery.Count() > 0)
                            {
                                List<string> partArr = new List<string>();
                                string original = nameBreak[x];
                                partArr.Add(part);
                                // search part in items
                                foreach (var l in tagsQuery)
                                {
                                    string[] tagArr = l.ItemTag.Split(" ");
                                    for (int y = 0; y < tagArr.Length; y++)
                                    {
                                        string tagPart = tagArr[i];
                                        string partComp = String.Join(" ", partArr);
                                        if (tagPart.ToLower() == partComp)
                                        {
                                            string searchQuery = "select " + QuoteField("Name") + " from " + QuoteTable("Item") + " where lower(" + QuoteField("Name") + ") like ";
                                            searchQuery += QuoteParam(partComp + "%") + " Order By " + QuoteField("Id") + " Limit 1";
                                            string searchItemQuery = GetDataString(searchQuery);
                                            if (searchItemQuery != "")
                                            {
                                                int searchStartIndex = searchItemQuery.IndexOf(original);
                                                int searchEndIndex = searchItemQuery.LastIndexOf(original);
                                                string sub = searchItemQuery.Substring(searchStartIndex,original.Length);
                                                Tag lookupTag= (Tag)_context.Tag.Where(t => t.ItemTag.ToLower() == sub.ToLower());
                                                if (sub == original && lookupTag == null)
                                                {
                                                    Tag othTag = new Tag { ItemTag = sub, SystemAdd = true };
                                                    otherTagList.Add(othTag);

                                                }
                                                else
                                                {
                                                    otherTagList.Add(lookupTag);
                                                }

                                            }

                                        }
                                        else
                                        {
                                            x++;
                                            part = nameBreak[x].ToLower();
                                            partArr.Add(part);
                                            original += " " + nameBreak[x];

                                        }
                                    }

                                }
                                // search tags query using equal
                                // if potential matches found create a new tag
                            }

                        }
                        */
                        if (existItem != null)
                        {
                            existItem.LastSeenDateTime = currDateTime;
                            existItem.LastSeenDate = date;
                            existItem.LastSeenTime = new TimeSpan();
                            existItem.LastSeenTimeString = time;
                            existItem.Price = ami.min_price;
                            existItem.SoldOut = false;
                            existItem.TransactionId = jsonObj.transactionId;
                            existItem.Name = ami.gname;
                            if (!existItem.Tags.Contains(tag))
                            {
                                tag.Items.Add(existItem);
                                existItem.Tags.Add(tag);
                            }
                            if (!wishList.Items.Contains(existItem))
                            {
                                wishList.Items.Add(existItem);
                                existItem.Wishs.Add(wishList);
                            }
                            _context.Item.Update(existItem);
                        }
                        else
                        {
                            Item newItem = new Item { Name = ami.gname, ShopIdCode = ami.gcode, TransactionId = jsonObj.transactionId };
                            newItem.Manufacturer = ami.maker_name;
                            newItem.Price = ami.min_price;
                            newItem.UrlLink = "https://www.amiami.com/eng/detail/?gcode=" + ami.gcode;
                            newItem.LastSeenDateTime = currDateTime;
                            newItem.LastSeenDate = currDateTime.Date.ToString();
                            // add to tags
                            newItem.Tags.Add(tag);
                            tag.Items.Add(newItem);
                            // add to wish list
                            wishList.Items.Add(newItem);
                            newItem.Wishs.Add(wishList);
                            _context.Item.Add(newItem);
                        }

                    }
                    if (tagExist != null) {
                        _context.Tag.Update(tag);
                    } else _context.Tag.Add(tag);
                    // update wish date and time
                    wishList.LastUpdate = currDateTime;
                    wishList.LastDate = date;
                    wishList.LastTime = time;
                    _context.WishList.Update(wishList);

                    await _context.SaveChangesAsync();
                    // update items by search tag that have not been update to update those items as sold out to true
                    string updateQuery = "Update public." + QuoteField("Item") + " as Up";
                    updateQuery += " Set " + QuoteField("SoldOut") + "='true'";
                    updateQuery += " From public." + QuoteField("Item") + " as Item";
                    updateQuery += " Inner join public." + QuoteField("ItemTags") + " as Tag";
                    updateQuery += " On Tag." + QuoteField("ItemsId") + "= Item." + QuoteField("Id");
                    updateQuery += " where Tag." + QuoteField("TagsId") + "= (Select " + QuoteField("Id") + " from public." + QuoteField("Tag") + " where Lower(" + QuoteField("ItemTag") + ") =" + QuoteParam(jsonObj.search.ToLower()) + ")";
                    updateQuery += " and Up." + QuoteField("LastSeenDateTime") + "<" + QuoteParam(currDateTime.ToString());
                    updateQuery += " and Up." + QuoteField("TransactionId") + "!=" + QuoteParam(jsonObj.transactionId);
                    updateQuery += " and Tag." + QuoteField("ItemsId") + "= Up." + QuoteField("Id");
                    //Console.WriteLine(updateQuery);
                    ExecuteQuery(updateQuery);
                } else return StatusCode(500);

            } else return StatusCode(500);
            
            return Ok();
        }
    }
}
