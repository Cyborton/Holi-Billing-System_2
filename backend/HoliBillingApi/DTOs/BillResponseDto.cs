namespace HoliBillingApi.DTOs
{
    public class BillResponseDto
    {
        public int Id { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GST { get; set; }
        public decimal GrandTotal { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<BillItemResponseDto>? Items { get; set; }
    }
}