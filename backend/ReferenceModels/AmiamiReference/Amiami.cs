using System;

namespace backend.ReferenceModels;

public class Amiami
{
    public required string gcode{get; set;}
    public required string gname{get; set;}
    public string? thumb_url{get; set;}
    public string? thumb_alt{get; set;}
    public string? thumb_title{get; set;}
    public int min_price{get; set;}
    public int max_price {get; set;}
    public int c_price_text {get; set;}
    public string? maker_name{get; set;}
    public int saleitem {get; set;}
    public int condition_flg {get; set;}
    public int list_preorder_available {get; set;}
    public int list_backorder_available {get; set;}
    public int list_store_bonus {get; set;}
    public int list_amiami_limited {get; set;}
    public int instock_flg {get; set;}
    public int order_closed_flg {get; set;}
    public string? element_id{get; set;}
    public string? salestatus{get; set;}
    public string? salestatus_detail{get; set;}
    public string? releasedate{get; set;}
    public string? jancode{get; set;}
    public int preorderitem {get; set;}
    public int saletopitem {get;set;}
    public int resale_flg {get;set;}
    public int preowned_sale_flg {get; set;}
    public int for_women_flg {get; set;}
    public int genre_moe {get; set;}
    public string? cate6{get; set;}
    public string? cate7{get; set;}
    public int buy_flg {get; set;}
    public int buy_price {get; set;}
    public string? buy_remarks{get; set;}
    public int stock_flg{get; set;}
    public int image_on {get; set;}
    public string? image_category{get; set;}
    public string? image_name{get; set;}
    public string? metaalt{get; set;}



}
