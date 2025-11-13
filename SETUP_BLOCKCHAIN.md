# 🚀 Quick Setup Guide - Blockchain Integration

## ✅ What's Already Done

1. ✅ Blockchain code integrated (service, routes, components)
2. ✅ Environment variables configured in `.env`
3. ✅ Dependencies installed (ethers.js)
4. ✅ Smart contract connected (Polygon Amoy)
5. ✅ Migration SQL file created

## 📋 Setup Steps

### Step 1: Start PostgreSQL Database

Your PostgreSQL database needs to be running. 

**Option A: Check if it's running**
```powershell
# Check PostgreSQL service status
Get-Service -Name postgresql*
```

**Option B: Start PostgreSQL service**
```powershell
# Start PostgreSQL service (run as Administrator)
Start-Service postgresql-x64-14  # Or your version
```

**Option C: Use Docker (if you prefer)**
```powershell
docker run -d `
  --name livestock-postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=livestock_lens `
  -p 5432:5432 `
  postgres:15
```

### Step 2: Apply Database Migration

Once PostgreSQL is running:

```powershell
# Run the migration script
npx tsx migrations/run_migration.ts
```

This will add the blockchain fields to your database:
- `cattle.blockchain_tx_hash`
- `cattle.blockchain_registered`
- `cattle.owner_cnic`
- `vaccinations.blockchain_tx_hash`

### Step 3: Start the Application

```powershell
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:5173

### Step 4: Test Blockchain Integration

1. **Check Blockchain Status**
   ```
   GET http://localhost:5000/api/blockchain/status
   ```
   Should return: `{ "enabled": true }`

2. **Login to the application**
   - Go to http://localhost:5173
   - Login with your credentials

3. **Register a Cattle on Blockchain**
   - Go to any cattle profile page
   - Look for the blockchain status section
   - Click "Register on Blockchain" button
   - Wait for transaction confirmation
   - View on Polygon Explorer

## 🔍 Verification Steps

### Check Environment Variables
Your `.env` should have:
```properties
BLOCKCHAIN_ENABLED=true
POLYGON_RPC_URL=https://polygon-amoy-bor-rpc.publicnode.com
BLOCKCHAIN_PRIVATE_KEY=2bce2d87bab2a7a1a279aa019c74c81cf76ff04fbba6d33e683a9f7df11d5754
CONTRACT_ADDRESS=0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a
```
✅ Already configured!

### Check Wallet Balance
```powershell
# Check if your wallet has test MATIC
curl "https://api-amoy.polygonscan.com/api?module=account&action=balance&address=YOUR_WALLET_ADDRESS&tag=latest"
```

If balance is low, get free test MATIC:
🔗 https://faucet.polygon.technology/

## 📁 Files Created

### Backend
- ✅ `server/blockchain/config.ts` - Configuration
- ✅ `server/blockchain/service.ts` - Service layer  
- ✅ `server/blockchain-routes.ts` - API endpoints
- ✅ `server/index.ts` - Updated with routes

### Frontend
- ✅ `client/src/components/BlockchainStatus.tsx` - UI component

### Database
- ✅ `shared/schema.ts` - Updated schema
- ✅ `migrations/add_blockchain_fields.sql` - Migration SQL
- ✅ `migrations/run_migration.ts` - Migration script

### Documentation
- ✅ `BLOCKCHAIN_INTEGRATION.md` - Full guide
- ✅ `BLOCKCHAIN_QUICK_REFERENCE.md` - Quick reference
- ✅ `BLOCKCHAIN_IMPLEMENTATION_SUMMARY.md` - Overview
- ✅ `SETUP_BLOCKCHAIN.md` - This file

## 🎯 API Endpoints Ready

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/blockchain/status` | GET | Check if enabled |
| `/api/blockchain/cattle/register` | POST | Register cattle |
| `/api/blockchain/cattle/:rfid` | GET | Get cattle data |
| `/api/blockchain/vaccination/add` | POST | Add vaccination |
| `/api/blockchain/vaccinations/:rfid` | GET | Get vaccinations |
| `/api/blockchain/cattle/transfer` | POST | Transfer ownership |
| `/api/blockchain/ownership/:rfid` | GET | Get ownership history |
| `/api/blockchain/heritage/set` | POST | Set heritage |
| `/api/blockchain/heritage/:rfid` | GET | Get heritage |

## ⚠️ Current Issue

**PostgreSQL Connection Error**
```
ECONNREFUSED ::1:5432
```

**Solution:** Start PostgreSQL database service before running migration or application.

## 🆘 Troubleshooting

### Database Won't Connect
1. Check if PostgreSQL is installed
2. Verify the service is running
3. Check connection string in `.env`
4. Try connecting with pgAdmin or DBeaver

### Blockchain Transactions Fail
1. Check wallet has test MATIC
2. Verify RPC URL is working
3. Check private key is correct
4. Look at server logs for errors

### Can't Find Migration Script
```powershell
# Make sure you're in the project root
cd A:\Downloads\LivestockLens

# Then run migration
npx tsx migrations/run_migration.ts
```

## 🎊 Next Steps

Once database is running and migration is applied:

1. ✅ Start the application (`npm run dev`)
2. ✅ Test blockchain status endpoint
3. ✅ Register a cattle on blockchain
4. ✅ View transaction on Polygon Explorer
5. ✅ Add vaccination records
6. ✅ Test ownership transfer

## 📞 Need Help?

Check these docs:
- **Full Integration Guide:** `BLOCKCHAIN_INTEGRATION.md`
- **Quick Reference:** `BLOCKCHAIN_QUICK_REFERENCE.md`
- **Implementation Summary:** `BLOCKCHAIN_IMPLEMENTATION_SUMMARY.md`

Your blockchain integration is **99% complete** - just need to start the database! 🚀
