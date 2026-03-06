namespace HoliBillingApi.DTOs
{
    public class CreateBillRequest
    {
        public string CustomerName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public List<CreateBillItemDto> Items { get; set; } = new();
    }

    public class CreateBillItemDto
    {
        public int ItemId { get; set; }
        public int Quantity { get; set; }
    }
}
