# Blockchain Integration Guide

## Overview

LivestockLens now includes blockchain integration using **Polygon (Matic) Amoy Testnet** for immutable record-keeping of cattle registration, vaccination history, ownership transfers, and heritage information.

## Features

### 1. **Cattle Registration on Blockchain**
- Permanent, tamper-proof record of cattle registration
- RFID-based identification
- Owner information with CNIC (National ID)
- Breed and gender information

### 2. **Vaccination Records**
- Immutable vaccination history
- Timestamped records
- Verifiable by anyone on the blockchain

### 3. **Ownership Transfer**
- Complete chain of custody
- Historical ownership records
- Transparent transfer process

### 4. **Heritage Tracking**
- Father and mother RFID linkage
- Breeding certification
- Lineage verification

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LivestockLens Frontend                    │
│                  (React + TypeScript + Vite)                 │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ REST API
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                  Express.js Backend Server                    │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        Blockchain Service (ethers.js v6)               │ │
│  │                                                          │ │
│  │  • registerCattle()                                     │ │
│  │  • addVaccination()                                     │ │
│  │  • transferOwnership()                                  │ │
│  │  • setHeritage()                                        │ │
│  │  • Query functions                                      │ │
│  └────────────────┬────────────────────────────────────────┘ │
│                   │                                           │
│  ┌────────────────▼────────────────────────────────────────┐ │
│  │            PostgreSQL Database                          │ │
│  │                                                          │ │
│  │  • Stores blockchain tx hashes                          │ │
│  │  • Links off-chain and on-chain data                    │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ JSON-RPC
                           │
┌──────────────────────────▼───────────────────────────────────┐
│              Polygon Amoy Testnet (PoS)                       │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │       CattleRegistry Smart Contract                     │ │
│  │       Address: 0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a│ │
│  │                                                          │ │
│  │  • Stores cattle records                                │ │
│  │  • Vaccination history                                  │ │
│  │  • Ownership transfers                                  │ │
│  │  • Heritage information                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Add the following to your `.env` file:

```bash
# Blockchain Configuration
BLOCKCHAIN_ENABLED=true
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
BLOCKCHAIN_PRIVATE_KEY=your-private-key-here
```

**Important Notes:**
- Set `BLOCKCHAIN_ENABLED=true` to enable blockchain features
- Get your private key from MetaMask or another wallet
- Never commit your private key to version control
- Use a testnet wallet with test MATIC tokens

### 2. Get Test MATIC Tokens

To interact with the blockchain, you need test MATIC tokens:

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy Testnet"
3. Enter your wallet address
4. Request test tokens

### 3. Database Migration

Update your database schema to include blockchain fields:

```sql
-- Add blockchain columns to cattle table
ALTER TABLE cattle 
ADD COLUMN blockchain_tx_hash TEXT,
ADD COLUMN blockchain_registered BOOLEAN DEFAULT FALSE,
ADD COLUMN owner_cnic TEXT;

-- Add blockchain column to vaccinations table
ALTER TABLE vaccinations 
ADD COLUMN blockchain_tx_hash TEXT;
```

Or run the Drizzle migration:
```bash
npm run db:push
```

## API Endpoints

### Check Blockchain Status
```http
GET /api/blockchain/status
```

Response:
```json
{
  "enabled": true,
  "network": "Polygon Amoy Testnet",
  "contract": "https://amoy.polygonscan.com/address/0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a"
}
```

### Register Cattle on Blockchain
```http
POST /api/blockchain/cattle/register
Content-Type: application/json
Authorization: Bearer <token>

{
  "cattleId": "uuid-of-cattle"
}
```

Response:
```json
{
  "success": true,
  "txHash": "0x...",
  "explorerUrl": "https://amoy.polygonscan.com/tx/0x..."
}
```

### Get Cattle from Blockchain
```http
GET /api/blockchain/cattle/:rfid
```

### Add Vaccination to Blockchain
```http
POST /api/blockchain/vaccination/add
Content-Type: application/json

{
  "vaccinationId": "uuid-of-vaccination-record"
}
```

### Transfer Ownership
```http
POST /api/blockchain/cattle/transfer
Content-Type: application/json

{
  "cattleId": "uuid",
  "newOwnerCNIC": "12345-6789012-3",
  "newOwnerName": "John Doe"
}
```

### Get Ownership History
```http
GET /api/blockchain/ownership/:rfid
```

### Set Heritage Information
```http
POST /api/blockchain/heritage/set
Content-Type: application/json

{
  "cattleId": "uuid",
  "fatherRfid": "RF001",
  "motherRfid": "RF002",
  "certification": "Pure Breed Certificate #123"
}
```

### Get Heritage Information
```http
GET /api/blockchain/heritage/:rfid
```

## Frontend Integration

### Using the BlockchainStatus Component

```tsx
import BlockchainStatus from '@/components/BlockchainStatus';

function CattleDetailPage() {
  const cattleId = "uuid-of-cattle";
  const rfidId = "RF12345";

  return (
    <div>
      {/* Other cattle information */}
      
      <BlockchainStatus 
        cattleId={cattleId}
        rfidId={rfidId}
        showActions={true}
      />
    </div>
  );
}
```

## Smart Contract Details

### Contract Address
```
0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a
```

### Network
- **Name:** Polygon Amoy Testnet
- **Chain ID:** 80002
- **RPC URL:** https://rpc-amoy.polygon.technology
- **Explorer:** https://amoy.polygonscan.com

### Key Functions

1. **registerCattle()**
   - Registers a new cattle on the blockchain
   - Emits `CattleRegistered` event
   
2. **addVaccination()**
   - Adds vaccination record
   - Emits `VaccinationAdded` event

3. **transferOwnership()**
   - Transfers ownership to new owner
   - Records history
   - Emits `OwnershipTransferred` event

4. **setHeritage()**
   - Sets father and mother RFID
   - Stores certification info
   - Emits `HeritageSet` event

## Benefits of Blockchain Integration

### 1. **Immutability**
- Records cannot be altered or deleted
- Prevents fraud and data manipulation
- Provides permanent audit trail

### 2. **Transparency**
- Anyone can verify records
- Public ownership history
- Verifiable vaccination records

### 3. **Trust**
- No central authority needed
- Cryptographic verification
- Tamper-proof certification

### 4. **Traceability**
- Complete lineage tracking
- Chain of custody
- Export certification support

### 5. **Compliance**
- Regulatory compliance
- International standards
- Export documentation

## Cost Considerations

### Transaction Costs
Approximate gas costs on Polygon Amoy (testnet):
- Register Cattle: ~0.001 MATIC
- Add Vaccination: ~0.0005 MATIC
- Transfer Ownership: ~0.0007 MATIC
- Set Heritage: ~0.0008 MATIC

**Note:** Mainnet costs would be similar, but use real MATIC tokens.

## Security Best Practices

1. **Private Key Security**
   - Never commit private keys to code
   - Use environment variables
   - Consider using a hardware wallet for production

2. **Access Control**
   - Only authenticated users can write to blockchain
   - Implement role-based permissions
   - Validate all inputs before blockchain submission

3. **Data Validation**
   - Verify RFID uniqueness
   - Check cattle existence before operations
   - Validate owner information

4. **Error Handling**
   - Handle blockchain errors gracefully
   - Provide fallback for when blockchain is down
   - Log all blockchain operations

## Troubleshooting

### Issue: "Blockchain service not enabled"
**Solution:** Set `BLOCKCHAIN_ENABLED=true` in your `.env` file

### Issue: "Insufficient funds"
**Solution:** Get test MATIC from the faucet

### Issue: "Transaction failed"
**Solution:** 
- Check your RPC URL is correct
- Verify your private key has funds
- Check network connectivity

### Issue: "Cattle already registered"
**Solution:** Each cattle can only be registered once. Check `blockchain_registered` field in database.

## Future Enhancements

- [ ] NFT certificates for cattle
- [ ] QR code integration for quick verification
- [ ] Mobile app for field verification
- [ ] Integration with livestock markets
- [ ] Cross-border certification system
- [ ] AI-powered fraud detection
- [ ] Multi-signature ownership transfers
- [ ] Automated insurance claims

## Support

For issues or questions:
- Check the [Polygon Documentation](https://docs.polygon.technology/)
- Review [ethers.js Documentation](https://docs.ethers.org/)
- Open an issue on GitHub

## License

This blockchain integration is part of LivestockLens and follows the same MIT License.
