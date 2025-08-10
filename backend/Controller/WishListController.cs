using backend.Base;
using backend.Models;
using backend.ReferenceModels.AmiamiReference;
using backend.ReferenceModels.Setting;
using backend.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controller
{
    [Route("api/wishlist")]
    [ApiController]
    public class WishListController : BaseController
    {
        //public readonly WishListService wishListService;
        public WishListController(AppDbContext context) : base(context)
        {
            //wishListService = wIshList;
        }
        [HttpGet("new")]
        public ActionResult<WishList> NewWish()
        {
            return new WishList { };
        }
        [HttpPost("add")]
        // add wish
        public async Task<ActionResult<WishList>> AddWish(WishList wish){
            wish.Url=ReturnPostUrl();
            var add=_context.WishList.Add(wish);
            var save=await _context.SaveChangesAsync();
            wish.Body=CreatePayLoad(wish.Id,wish.Wish);
            _context.WishList.Update(wish);
            await _context.SaveChangesAsync();
            return wish;
        }
        // update wish
        [HttpPut("update/{id?}")]
        public async Task<ActionResult<WishList>> UpdateWish(long id,WishList wish){
            if(wish.Id==id){
                string prevWish=GetDataString("Select "+QuoteField("Wish")+" from "+QuoteTable("WishList")+" where "+QuoteField("Id")+"="+id);
                wish.Body=CreatePayLoad(wish.Id,wish.Wish);
                if(prevWish.ToLower()!=wish.Wish.ToLower()){
                    wish.Items.Clear();
                    _context.Item.Include(item=>item.Wishs.Where(it=>it.Id==id));
                    ExecuteQuery("Delete from "+QuoteTable("WishItems")+" where "+QuoteField("WishsId")+"="+id);
                }
                _context.Entry(wish).State=EntityState.Modified;
                await _context.SaveChangesAsync();
            }else return NotFound();
            return wish;
        }
        [HttpGet("get-wish/{id?}/{sold?}")]
        public async Task<ActionResult<WishList>> GetWish(long id,Boolean sold){
            var exist=await _context.WishList.Include(wish=>wish.Items.Where(item=>item.SoldOut==sold)).FirstOrDefaultAsync(wish=>wish.Id==id);
            if(exist==null) return NotFound();
            return exist;
        }
        [HttpGet("get-wishes")]
        public async Task<ActionResult<IEnumerable<WishList>>> GetAllWish(){
            return await _context.WishList.ToListAsync();
        }
        [HttpDelete("delete/{id?}")]
        public async Task<ActionResult<WishList>> DeleteWish(long id){
            var exist=await _context.WishList.FindAsync(id);
            if(exist==null) return NotFound();
            _context.WishList.Remove(exist);
            await _context.SaveChangesAsync();
            return Ok();
        }
        private string ReturnPostUrl(){
            return ServerConfig.ApiServer+"/amiami/request-post";
        }
        public string CreatePayLoad(long id,string search){
            PayLoad payload=new PayLoad{wishId=id};
            Config config=new Config{};
            InputPayLoad inputPayload=new InputPayLoad{search=search, postApi=ServerConfig.ServerHost+"/item/update-inventory",config=config,payload=payload};
            string payloadStr=Newtonsoft.Json.JsonConvert.SerializeObject(inputPayload);
            return payloadStr;
        }
       
        
    }
}
