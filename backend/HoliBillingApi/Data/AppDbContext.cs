using HoliBillingApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HoliBillingApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<BillItem> BillItems { get; set; }
        public DbSet<Customer> Customers { get; set; }

        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>()
                .Property(i => i.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Bill>()
                .Property(b => b.SubTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Bill>()
                .Property(b => b.GST)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Bill>()
                .Property(b => b.GrandTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<BillItem>()
                .Property(bi => bi.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<BillItem>()
                .Property(bi => bi.Total)
                .HasPrecision(18, 2);
        }
    }
}