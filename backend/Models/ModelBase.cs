using System;
using System.ComponentModel.DataAnnotations;
namespace backend.Models
{
    public class ModelBase{
        [Key]
        public long Id {get;set;}
        public DateTime Created{get; set;} =DateTime.UtcNow;
        public DateTime Updated{get; set;} =DateTime.UtcNow;
        
    }
}