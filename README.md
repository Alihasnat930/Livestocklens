# LivestockLens - Local Development Setup

## 🎉 Project Successfully Configured for Local Development

Your LivestockLens application has been completely configured to run locally on Windows.

## ✅ What Was Configured

1. **Clean Dependencies**: All dependencies optimized for local development
2. **Database Configuration**: Set up with standard PostgreSQL configuration
3. **Updated Package Scripts**: Modified npm scripts to work with Windows PowerShell
4. **Environment Variables**: Created proper .env configuration
5. **Authentication System**: Implemented development mode with test users
6. **Proxy Configuration**: Set up Vite proxy to communicate with backend API
7. **🔗 Blockchain Integration**: Polygon (Matic) Amoy Testnet for immutable record-keeping

## 🚀 How to Run the Application

### Prerequisites
- Node.js (you have v20.14.0 - works with warnings)
- No database required for development (uses in-memory test users)

### Starting the Application

**Option 1: Start both servers with one command**
```powershell
npm run dev
```

**Option 2: Start servers separately**

Backend server:
```powershell
$env:NODE_ENV="development"; $env:DATABASE_URL="postgresql://user:password@localhost:5432/livestocklens"; npx tsx server/index.ts
```

Frontend server (in a new terminal):
```powershell
npx vite
```

### Access the Application
- **Frontend**: http://localhost:5174 (or 5173)
- **Backend API**: http://localhost:5000

## 🔐 Test User Accounts

The application includes built-in test users for development:

| Email | Password | Role |
|-------|----------|------|
| farmer@test.com | test123 | farmer |
| buyer@test.com | test123 | buyer |
| admin@test.com | test123 | admin |
   - Backend API: http://localhost:5000
| vet@test.com | | veterinarian |
| buyer@test.com | | buyer |
| admin@test.com | | admin |

### Development Mode Authentication

The application runs in development mode with mock authentication. Use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Farmer | farmer@test.com | test123 |
| Veterinarian | vet@test.com | test123 |
| Buyer | buyer@test.com | test123 |
| Administrator | admin@test.com | test123 |

## Environment Configuration

Create a `.env` file in the root directory (use `.env.example` as template):

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/livestock_lens
JWT_SECRET=your-secret-key-here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

## Database Setup (Optional for Development)

For production or full development with persistent data:

1. **Install PostgreSQL locally or use a cloud service**

2. **Create database:**
   ```sql
   CREATE DATABASE livestock_lens;
   ```

3. **Update DATABASE_URL in .env with your connection string**

4. **Run database migrations:**
   ```bash
   npm run db:push
   ```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── lib/            # Utility functions
├── server/                 # Express backend application
│   ├── routes.ts           # API routes
│   ├── db.ts              # Database configuration
│   └── storage.ts         # Data access layer
├── shared/                 # Shared TypeScript schemas
└── uploads/               # File upload directory
```

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- Radix UI for component primitives
- React Query for state management
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM for database operations
- JWT for authentication
- Multer for file uploads
- **ethers.js v6** for blockchain integration

### Database
- PostgreSQL with Drizzle ORM
- Development mode with mock data

### Blockchain
- **Polygon (Matic) Amoy Testnet**
- Smart Contract: CattleRegistry
- Immutable record-keeping for:
  - Cattle registration
  - Vaccination history
  - Ownership transfers
  - Heritage tracking

📖 **See [BLOCKCHAIN_INTEGRATION.md](./BLOCKCHAIN_INTEGRATION.md) for detailed documentation**

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 5000 or 5173 are in use, kill the processes or change ports in the configuration.

2. **Node.js version warnings**: Vite requires Node.js 20.19+, but the application works with 20.14+ despite warnings.

3. **Database connection errors**: In development mode, the app uses mock data. For production, ensure PostgreSQL is running and DATABASE_URL is correct.

4. **Sign-in button not working**: Make sure both frontend (5173) and backend (5000) servers are running. The Vite proxy should route API calls to the backend.

### Support

For issues and questions, check the troubleshooting section or create an issue in the project repository.

## License

MIT License - see LICENSE file for details.