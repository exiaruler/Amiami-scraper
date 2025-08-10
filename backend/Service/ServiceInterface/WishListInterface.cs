using System;
using backend.Models;

namespace backend.Service.ServiceInterface;

public interface WishListInterface
{
    Task<List<WishList>> GetWishes();
}
