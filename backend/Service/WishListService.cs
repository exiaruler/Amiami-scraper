using System;
using backend.Base;
using backend.Models;
using backend.ReferenceModels.AmiamiReference;
using backend.ReferenceModels.Setting;
using Microsoft.EntityFrameworkCore;

namespace backend.Service;

public class WishListService :BaseService
{
    public WishListService(AppDbContext context) : base(context)
    {
    }
    private string ReturnPostUrl()
    {
        return ServerConfig.ApiServer + "/amiami/request-post";
    }
    public string CreatePayLoad(long id, string search)
    {
        ReferenceModels.AmiamiReference.PayLoad payload = new PayLoad { wishId = id };
        Config config = new Config { };
        InputPayLoad inputPayload = new InputPayLoad { search = search, postApi = ServerConfig.ServerHost + "/item/update-inventory", config = config, payload = payload };
        string payloadStr = Newtonsoft.Json.JsonConvert.SerializeObject(inputPayload);
        return payloadStr;
    }
    public async Task<WishList> AddWishAsync(WishList wishInput)
    {
        wishInput.Url = ReturnPostUrl();
        var add = _context.WishList.Add(wishInput);
        var save = await _context.SaveChangesAsync();
        wishInput.Body = CreatePayLoad(wishInput.Id, wishInput.Wish);
        _context.WishList.Update(wishInput);
        await _context.SaveChangesAsync();
        return wishInput;
    }
    public async Task<WishList> UpdateWishAsync(WishList wishUpdate, long id)
    {
        string prevWish = GetDataString("Select " + QuoteField("Wish") + " from " + QuoteTable("WishList") + " where " + QuoteField("Id") + "=" + id);
        wishUpdate.Body = CreatePayLoad(wishUpdate.Id, wishUpdate.Wish);
        if (prevWish.ToLower() != wishUpdate.Wish.ToLower())
        {
            wishUpdate.Items.Clear();
            _context.Item.Include(item => item.Wishs.Where(it => it.Id == id));
            ExecuteQuery("Delete from " + QuoteTable("WishItems") + " where " + QuoteField("WishsId") + "=" + id);
        }
        _context.Entry(wishUpdate).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return wishUpdate;
    }
    public async Task<Boolean> DeleteWishAsync(long id)
    {
        Boolean deleted = false;
        var exist = await _context.WishList.FindAsync(id);
        if (exist != null)
        {
            _context.WishList.Remove(exist);
            await _context.SaveChangesAsync();
            deleted = true;
        }
        return deleted;
    }
    public Task<List<WishList>> GetWishes()
    {
        return _context.WishList.ToListAsync();
    }
    public async Task<WishList> GetWish(long id,Boolean sold)
    {
        var exist = await _context.WishList.Include(wish => wish.Items.Where(item => item.SoldOut == sold)).FirstOrDefaultAsync(wish => wish.Id == id);
        return exist;
    }
}
