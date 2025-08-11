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
    public class WishListController : ControllerBase
    {
        public readonly WishListService wishListService;
        public WishListController(WishListService wIshList)
        {
            wishListService = wIshList;
        }
        [HttpGet("new")]
        public ActionResult<WishList> NewWish()
        {
            return new WishList { };
        }
        [HttpPost("add")]
        // add wish
        public async Task<ActionResult<WishList>> AddWish(WishList wish){
            var add = await wishListService.AddWishAsync(wish);
            return Ok(add);
        }
        // update wish
        [HttpPut("update/{id?}")]
        public async Task<ActionResult<WishList>> UpdateWish(long id,WishList wish){
            if(wish.Id==id){
                var update = await wishListService.UpdateWishAsync(wish, id);
            }else return NotFound();
            return Ok(wish);
        }
        [HttpGet("get-wish/{id?}/{sold?}")]
        public async Task<ActionResult<WishList>> GetWish(long id,Boolean sold){
            var exist = await wishListService.GetWish(id, sold);
            if(exist==null) return NotFound();
            return exist;
        }
        [HttpGet("get-wishes")]
        public async Task<ActionResult<IEnumerable<WishList>>> GetAllWish(){
            var res = await wishListService.GetWishes();
            return Ok(res);
        }
        [HttpDelete("delete/{id?}")]
        public async Task<ActionResult<WishList>> DeleteWish(long id){
            Boolean delete = await wishListService.DeleteWishAsync(id);
            if(!delete) return NotFound();
            return Ok();
        }
        
    }
}
