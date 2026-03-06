using HoliBillingApi.Data;
using HoliBillingApi.DTOs;
using HoliBillingApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HoliBillingApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BillsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BillsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBills()
        {
            var bills = await _context.Bills
                .Include(b => b.Customer)
                .Include(b => b.BillItems)
                .ThenInclude(bi => bi.Item)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            var response = bills.Select(ToBillResponse);
            return Ok(response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBillById(int id)
        {
            var bill = await _context.Bills
                .Include(b => b.Customer)
                .Include(b => b.BillItems)
                .ThenInclude(bi => bi.Item)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bill == null)
            {
                return NotFound();
            }

            return Ok(ToBillResponse(bill));
        }

        [HttpPost]
        public async Task<IActionResult> CreateBill([FromBody] CreateBillRequest request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
            {
                return BadRequest("At least one item is required");
            }

            if (string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.Phone))
            {
                return BadRequest("Customer name and phone are required");
            }

            if (request.Items.Any(i => i.ItemId <= 0 || i.Quantity <= 0))
            {
                return BadRequest("Invalid item payload");
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Phone == request.Phone);

            if (customer == null)
            {
                customer = new Customer
                {
                    Name = request.CustomerName.Trim(),
                    Phone = request.Phone.Trim(),
                    Email = request.Email?.Trim() ?? string.Empty
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }
            else
            {
                customer.Name = request.CustomerName.Trim();
                customer.Email = request.Email?.Trim() ?? customer.Email;
            }

            var bill = new Bill
            {
                CustomerId = customer.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            decimal subtotal = 0m;
            var billItems = new List<BillItem>();

            foreach (var item in request.Items)
            {
                var dbItem = await _context.Items.FirstOrDefaultAsync(i => i.Id == item.ItemId);
                if (dbItem == null)
                {
                    return BadRequest($"Invalid item id: {item.ItemId}");
                }

                var lineTotal = dbItem.Price * item.Quantity;
                subtotal += lineTotal;

                billItems.Add(new BillItem
                {
                    BillId = bill.Id,
                    ItemId = dbItem.Id,
                    Quantity = item.Quantity,
                    Price = dbItem.Price,
                    Total = lineTotal
                });
            }

            _context.BillItems.AddRange(billItems);

            bill.SubTotal = subtotal;
            bill.GST = Math.Round(subtotal * 0.18m, 2);
            bill.GrandTotal = bill.SubTotal + bill.GST;

            await _context.SaveChangesAsync();

            var fullBill = await _context.Bills
                .Include(b => b.Customer)
                .Include(b => b.BillItems)
                .ThenInclude(bi => bi.Item)
                .FirstAsync(b => b.Id == bill.Id);

            return Ok(ToBillResponse(fullBill));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            var bill = await _context.Bills
                .Include(b => b.BillItems)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bill == null)
            {
                return NotFound();
            }

            _context.BillItems.RemoveRange(bill.BillItems);
            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static object ToBillResponse(Bill bill)
        {
            return new
            {
                bill.Id,
                bill.CreatedAt,
                Customer = new
                {
                    bill.Customer.Name,
                    bill.Customer.Phone,
                    bill.Customer.Email
                },
                bill.SubTotal,
                bill.GST,
                bill.GrandTotal,
                Items = bill.BillItems.Select(bi => new
                {
                    Name = bi.Item!.Name,
                    bi.Quantity,
                    bi.Price,
                    bi.Total
                })
            };
        }
    }
}
