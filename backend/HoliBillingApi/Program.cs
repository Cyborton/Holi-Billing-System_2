using HoliBillingApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// allow reading environment variables (needed for Render deployment)
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();

// choose database provider
var databaseProvider = builder.Configuration["Database:Provider"];

if (string.IsNullOrWhiteSpace(databaseProvider))
{
    databaseProvider = builder.Environment.IsDevelopment() ? "Sqlite" : "Postgres";
}

// configure database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (databaseProvider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
    {
        var sqliteConnection =
            builder.Configuration.GetConnectionString("SqliteConnection")
            ?? "Data Source=holi-dev.db";

        options.UseSqlite(sqliteConnection);
        return;
    }

    var postgresConnection =
        builder.Configuration.GetConnectionString("DefaultConnection")
        ?? builder.Configuration["DATABASE_URL"]
        ?? "Host=localhost;Port=5432;Database=HoliBillingDb;Username=postgres;Password=postgres";

    options.UseNpgsql(postgresConnection);
});

// JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "THIS_IS_A_SUPER_SECRET_KEY_FOR_HOLI_BILLING_2026";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

builder.Services.AddAuthorization();

// CORS configuration
builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
        ?? new[]
        {
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173"
        };

    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// apply migrations + seed database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await context.Database.MigrateAsync();

    await DbSeeder.SeedAsync(context, builder.Configuration);
}

app.Run();