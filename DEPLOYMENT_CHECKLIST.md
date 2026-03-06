# Holi Billing Deployment Checklist (React + .NET + PostgreSQL)

## 1. Database (PostgreSQL)
- Create a PostgreSQL database on your chosen provider (Neon/Supabase/Render/Railway).
- Copy the full connection string.
- Ensure SSL mode is enabled if provider requires it.

## 2. Backend (.NET API) environment variables
- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection=<your_postgres_connection_string>`
- `Jwt__Key=<strong_random_secret_at_least_32_chars>`
- `DefaultAdmin__Username=admin`
- `DefaultAdmin__Password=<strong_admin_password>`
- `Cors__AllowedOrigins__0=https://your-frontend-domain.com`

Optional:
- `DATABASE_URL=<your_postgres_connection_string>` (supported as fallback in code)

## 3. Frontend (React) environment variables
- `REACT_APP_API_URL=https://your-backend-domain.com/api`

If using a React build host (Vercel/Netlify/Cloudflare Pages), set this in project env vars before building.

## 4. Build/Run commands
Backend:
- Build: `dotnet build backend/HoliBillingApi/HoliBillingApi.csproj`
- Run: `dotnet run --project backend/HoliBillingApi/HoliBillingApi.csproj`

Frontend:
- Install: `npm install` (inside `frontend`)
- Build: `npm run build` (inside `frontend`)

## 5. Post-deploy verification
- Open frontend URL and log in with configured admin credentials.
- Confirm API login endpoint works: `POST /api/auth/login`
- Create one item, one customer, one bill.
- Refresh and verify data persists (confirms PostgreSQL is connected).

## 6. Provider notes
- Supabase/Neon usually require SSL; include it in the connection string provided by the platform.
- Render free Postgres may have free-tier limitations; check current policy on their dashboard/docs.
- Railway free resources are usage-based; monitor credits.

## 7. Security minimums
- Never keep default JWT key or admin password in production.
- Keep DB credentials only in hosting environment variables.
- Restrict CORS to your real frontend domain(s) only.
