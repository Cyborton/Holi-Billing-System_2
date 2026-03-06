using HoliBillingApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HoliBillingApi.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context, IConfiguration configuration)
        {
            var adminUsername = configuration["DefaultAdmin:Username"] ?? "admin";
            var adminPassword = configuration["DefaultAdmin:Password"] ?? "admin123";

            context.Admins.RemoveRange(context.Admins);
            context.Admins.Add(new Admin
            {
                Username = adminUsername,
                Password = adminPassword
            });

            if (!await context.Items.AnyAsync())
            {
                var items = new List<Item>
                {
                    new() { Name = "Organic Gulal - Pink (250g)", Price = 95m },
                    new() { Name = "Organic Gulal - Yellow (250g)", Price = 95m },
                    new() { Name = "Organic Gulal - Green (250g)", Price = 95m },
                    new() { Name = "Organic Gulal - Blue (250g)", Price = 95m },
                    new() { Name = "Premium Herbal Color Combo (1kg)", Price = 320m },
                    new() { Name = "Neon Holi Color Pack (500g)", Price = 180m },
                    new() { Name = "Kids Safe Gulal Combo (4x100g)", Price = 210m },
                    new() { Name = "Silver Sparkle Color Dust (100g)", Price = 75m },
                    new() { Name = "Gold Sparkle Color Dust (100g)", Price = 75m },
                    new() { Name = "Water Balloons (100 pcs)", Price = 70m },
                    new() { Name = "Jumbo Water Balloons (250 pcs)", Price = 145m },
                    new() { Name = "Pichkari Classic 18-inch", Price = 160m },
                    new() { Name = "Pichkari Pressure Blaster", Price = 290m },
                    new() { Name = "Mini Pichkari for Kids", Price = 85m },
                    new() { Name = "Holi Water Gun Metallic", Price = 240m },
                    new() { Name = "Color Foam Spray Can", Price = 130m },
                    new() { Name = "Rain Dance Color Cannon", Price = 520m },
                    new() { Name = "Holi Party Goggles", Price = 110m },
                    new() { Name = "Face Shield Color Guard", Price = 140m },
                    new() { Name = "Disposable Rain Poncho", Price = 60m },
                    new() { Name = "Color Protection Hair Oil (200ml)", Price = 155m },
                    new() { Name = "Skin Guard Cream (100ml)", Price = 145m },
                    new() { Name = "Color Removal Soap Bar", Price = 55m },
                    new() { Name = "Post-Holi Herbal Face Wash", Price = 165m },
                    new() { Name = "Gujiya Box (500g)", Price = 280m },
                    new() { Name = "Thandai Mix (250g)", Price = 190m },
                    new() { Name = "Kesar Thandai Bottle (750ml)", Price = 260m },
                    new() { Name = "Holi Celebration Banner Kit", Price = 120m },
                    new() { Name = "DJ Party Wristbands (20 pcs)", Price = 95m },
                    new() { Name = "Holi Return Gift Pouches (10 pcs)", Price = 135m }
                };

                context.Items.AddRange(items);
            }

            if (!await context.Customers.AnyAsync() && !await context.Bills.AnyAsync())
            {
                var customers = new List<Customer>
                {
                    new() { Name = "Sharma Holi Event Group", Phone = "9876543210", Email = "sharma.holi@example.com" },
                    new() { Name = "Patel Rang Utsav Club", Phone = "9823014567", Email = "patel.rang@example.com" },
                    new() { Name = "Mehta Society Holi Committee", Phone = "9811122233", Email = "mehta.committee@example.com" },
                    new() { Name = "Singh Family Holi Party", Phone = "9898981212", Email = "singh.holi@example.com" },
                    new() { Name = "Verma Color Fest Team", Phone = "9765432109", Email = "verma.colors@example.com" },
                    new() { Name = "Nair Rainbow Gatherings", Phone = "9740011223", Email = "nair.rainbow@example.com" },
                    new() { Name = "Rao Holi Bash Organizers", Phone = "9791919191", Email = "rao.bash@example.com" },
                    new() { Name = "Joshi Rang Panchami Crew", Phone = "9833300011", Email = "joshi.rang@example.com" }
                };

                context.Customers.AddRange(customers);
                await context.SaveChangesAsync();

                var itemMap = await context.Items.OrderBy(i => i.Id).ToListAsync();
                var random = new Random(2026);

                var bills = new List<Bill>();
                var billItems = new List<BillItem>();

                for (var i = 0; i < 16; i++)
                {
                    var customer = customers[random.Next(customers.Count)];
                    var bill = new Bill
                    {
                        CustomerId = customer.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 45))
                    };
                    bills.Add(bill);
                }

                context.Bills.AddRange(bills);
                await context.SaveChangesAsync();

                foreach (var bill in bills)
                {
                    var lineCount = random.Next(2, 6);
                    decimal subTotal = 0m;

                    var selectedItems = itemMap
                        .OrderBy(_ => random.Next())
                        .Take(lineCount)
                        .ToList();

                    foreach (var item in selectedItems)
                    {
                        var qty = random.Next(1, 4);
                        var total = item.Price * qty;
                        subTotal += total;

                        billItems.Add(new BillItem
                        {
                            BillId = bill.Id,
                            ItemId = item.Id,
                            Quantity = qty,
                            Price = item.Price,
                            Total = total
                        });
                    }

                    bill.SubTotal = decimal.Round(subTotal, 2);
                    bill.GST = decimal.Round(subTotal * 0.18m, 2);
                    bill.GrandTotal = bill.SubTotal + bill.GST;
                }

                context.BillItems.AddRange(billItems);
            }

            await context.SaveChangesAsync();
        }
    }
}
