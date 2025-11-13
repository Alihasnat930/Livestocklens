# Cattle Registry System - Database + Blockchain

Complete system with MongoDB database and Ethereum blockchain integration.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v5 or higher)
3. **Hardhat** for blockchain

## 🚀 Setup Instructions

### Step 1: Install MongoDB

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Install and start MongoDB service
```

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Install Backend Dependencies

```bash
# Create backend folder
mkdir backend
cd backend

# Copy server.js, package.json, and .env files here

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

Update `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/cattle_registry
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
RPC_URL=http://127.0.0.1:8545
PORT=5000
```

### Step 4: Start Blockchain (Terminal 1)

```bash
# Start Hardhat node
npx hardhat node
```

### Step 5: Deploy Contract (Terminal 2)

```bash
# Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Copy the deployed contract address and update .env file
```

### Step 6: Start Backend Server (Terminal 3)

```bash
cd backend
npm start
```

Server will run on `http://localhost:5000`

### Step 7: Open Frontend

Open `index.html` in your browser or serve it:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js http-server
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

## 📊 Database Structure

### Collections:

1. **cattle** - Main cattle records
   - rfid, breed, gender, ownerCNIC, ownerName
   - blockchainTxHash, registrationTimestamp

2. **heritages** - Heritage information
   - rfid, fatherRfid, motherRfid, certification

3. **vaccinations** - Vaccination records
   - rfid, vaccineName, vaccinationDate, recordedAt

4. **ownerships** - Ownership transfer history
   - rfid, ownerCNIC, ownerName, timestamp

## 🔗 API Endpoints

### Register Cattle
```http
POST /api/cattle/register
Content-Type: application/json

{
  "rfid": "RFID-001",
  "breed": "Sahiwal",
  "gender": 1,
  "ownerCNIC": "42101-1234567-8",
  "ownerName": "Ahmed Khan",
  "fatherRfid": "FATHER-001",
  "motherRfid": "MOTHER-001",
  "certification": "Pure Breed"
}
```

### Add Vaccination
```http
POST /api/cattle/vaccination
Content-Type: application/json

{
  "rfid": "RFID-001",
  "vaccineName": "FMD Vaccine",
  "vaccinationDate": "2025-01-15"
}
```

### Transfer Ownership
```http
POST /api/cattle/transfer
Content-Type: application/json

{
  "rfid": "RFID-001",
  "newOwnerCNIC": "42201-9876543-2",
  "newOwnerName": "Ali Hassan"
}
```

### Get Cattle Details
```http
GET /api/cattle/:rfid
```

### Get All Cattle
```http
GET /api/cattle
```

### Get Statistics
```http
GET /api/stats
```

## ✅ Testing

1. Login with: `admin@farm.com` / `password123`
2. Register a new cattle
3. Add vaccinations
4. Transfer ownership
5. View records - data is now in both database and blockchain!

## 🔍 Verify Data Storage

### Check MongoDB:
```bash
mongosh
use cattle_registry
db.cattle.find()
db.vaccinations.find()
db.ownerships.find()
```

### Check Blockchain:
```bash
npx hardhat run scripts/interact.js --network localhost
```

## 🎉 Features

✅ Data stored in MongoDB database
✅ Data stored on Ethereum blockchain  
✅ RESTful API backend
✅ Professional UI with white & lime design
✅ CNIC-based owner identification
✅ Complete vaccination history
✅ Ownership transfer tracking
✅ Heritage/certification records
✅ Real-time blockchain transaction hashes

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check connection string in .env

**Blockchain Connection Error:**
- Ensure Hardhat node is running
- Verify contract is deployed
- Check CONTRACT_ADDRESS in .env

**CORS Error:**
- Backend server must be running
- Check API_URL in index.html matches backend port

## 📝 Login Credentials

**Email:** admin@farm.com  
**Password:** password123