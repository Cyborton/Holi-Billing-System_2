# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY HoliBillingApi.csproj ./
RUN dotnet restore HoliBillingApi.csproj

COPY . ./
RUN dotnet publish HoliBillingApi.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish ./

# Render sends PORT (usually 10000)
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}
EXPOSE 10000

ENTRYPOINT ["dotnet", "HoliBillingApi.dll"]
