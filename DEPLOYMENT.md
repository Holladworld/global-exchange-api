# 🚀 Deployment Checklist

## Pre-Deployment Tests
- [ ] `npm run test:production` - Production configuration test
- [ ] `NODE_ENV=production npm start` - Local production test
- [ ] All endpoints work in production mode
- [ ] MySQL connection works
- [ ] Image generation works

## Railway Deployment Steps
1. [ ] Merge production branch to main
2. [ ] Connect GitHub repo to Railway
3. [ ] Add MySQL service in Railway
4. [ ] Set environment variables in Railway:
   - `NODE_ENV=production`
   - `PORT=3010`
   - Database variables (auto-provided by Railway MySQL)
   - `COUNTRIES_API_URL`
   - `EXCHANGE_API_URL`
   - `ALLOWED_ORIGINS` (your frontend URLs)

## Post-Deployment Tests
- [ ] Health check: `https://yourapp.railway.app/health`
- [ ] Database health: `https://yourapp.railway.app/health/db`
- [ ] Refresh data: POST `https://yourapp.railway.app/countries/refresh`
- [ ] Get countries: GET `https://yourapp.railway.app/countries`
- [ ] Get image: GET `https://yourapp.railway.app/countries/image`

## Environment Variables for Production
```env
NODE_ENV=production
PORT=3010
DB_HOST=your-railway-mysql-host
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your-railway-mysql-password
COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_API_URL=https://open.er-api.com/v6/latest/USD
ALLOWED_ORIGINS=https://yourapp.railway.app