# Blockchain Quick Reference

## 🚀 Quick Start

### 1. Enable Blockchain
```bash
# In your .env file
BLOCKCHAIN_ENABLED=true
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
BLOCKCHAIN_PRIVATE_KEY=your-wallet-private-key
```

### 2. Get Test MATIC
Visit: https://faucet.polygon.technology/
- Select "Amoy Testnet"
- Enter your wallet address
- Get free test tokens

### 3. Register a Cattle
```bash
POST /api/blockchain/cattle/register
{
  "cattleId": "uuid-of-cattle-from-database"
}
```

## 📋 Key API Endpoints

| Action | Endpoint | Method |
|--------|----------|--------|
| Check Status | `/api/blockchain/status` | GET |
| Register Cattle | `/api/blockchain/cattle/register` | POST |
| Get Cattle Info | `/api/blockchain/cattle/:rfid` | GET |
| Add Vaccination | `/api/blockchain/vaccination/add` | POST |
| Get Vaccinations | `/api/blockchain/vaccinations/:rfid` | GET |
| Transfer Owner | `/api/blockchain/cattle/transfer` | POST |
| Get Owner History | `/api/blockchain/ownership/:rfid` | GET |
| Set Heritage | `/api/blockchain/heritage/set` | POST |
| Get Heritage | `/api/blockchain/heritage/:rfid` | GET |

## 🔍 View on Blockchain Explorer

**Contract Address:**
```
0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a
```

**Explorer URLs:**
- Contract: https://amoy.polygonscan.com/address/0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a
- Transactions: https://amoy.polygonscan.com/tx/{txHash}

## 📊 React Component Usage

```tsx
import BlockchainStatus from '@/components/BlockchainStatus';

<BlockchainStatus 
  cattleId="cattle-uuid"
  rfidId="RF12345"
  showActions={true}
/>
```

## 💾 Database Schema

### cattle table
```sql
blockchain_tx_hash TEXT
blockchain_registered BOOLEAN
owner_cnic TEXT
```

### vaccinations table
```sql
blockchain_tx_hash TEXT
```

## 🔐 Security Checklist

- [ ] Use testnet for development
- [ ] Never commit private keys
- [ ] Store keys in environment variables
- [ ] Use hardware wallet for production
- [ ] Validate all inputs before blockchain submission
- [ ] Handle blockchain errors gracefully

## 💰 Estimated Gas Costs (Amoy Testnet)

| Operation | Gas Cost |
|-----------|----------|
| Register Cattle | ~0.001 MATIC |
| Add Vaccination | ~0.0005 MATIC |
| Transfer Ownership | ~0.0007 MATIC |
| Set Heritage | ~0.0008 MATIC |

## 🛠️ Common Commands

```bash
# Install dependencies
npm install ethers@6.13.0

# Push database schema
npm run db:push

# Start with blockchain enabled
npm run dev
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Blockchain not enabled" | Set `BLOCKCHAIN_ENABLED=true` in .env |
| "Insufficient funds" | Get test MATIC from faucet |
| "Transaction failed" | Check RPC URL and wallet balance |
| "Cattle already registered" | Each cattle can only be registered once |

## 📚 Resources

- [Full Documentation](./BLOCKCHAIN_INTEGRATION.md)
- [Polygon Docs](https://docs.polygon.technology/)
- [ethers.js Docs](https://docs.ethers.org/)
- [Amoy Faucet](https://faucet.polygon.technology/)
- [Amoy Explorer](https://amoy.polygonscan.com/)

## 🎯 Benefits

✅ **Immutable Records** - Cannot be altered or deleted  
✅ **Transparency** - Anyone can verify ownership  
✅ **Trust** - No central authority needed  
✅ **Traceability** - Complete history of cattle  
✅ **Fraud Prevention** - Cryptographic verification  
✅ **Export Compliance** - International standards  

## 📞 Need Help?

1. Check [BLOCKCHAIN_INTEGRATION.md](./BLOCKCHAIN_INTEGRATION.md)
2. Review error logs in console
3. Verify wallet has test MATIC
4. Check network connectivity
5. Open GitHub issue with details
