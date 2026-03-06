using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoliBillingApi.Models
{
    public class Bill
    {
        public int Id { get; set; }

        public decimal SubTotal { get; set; }

        public decimal GST { get; set; }

        public decimal GrandTotal { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        public List<BillItem> BillItems { get; set; } = new();
    }
}
