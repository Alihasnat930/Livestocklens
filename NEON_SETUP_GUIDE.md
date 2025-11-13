# Neon Cloud Database Setup Guide

## Overview
Your LivestockLens application is now configured to use Neon as a cloud PostgreSQL database with automatic preview branches for pull requests.

## What's Been Set Up

### 1. GitHub Actions Workflow
- **File**: `.github/workflows/neon_workflow.yml`
- **Purpose**: Automatically creates and manages database branches for each pull request
- **Features**:
  - Creates a new Neon database branch when a PR is opened
  - Runs migrations automatically on the preview branch
  - Deletes the branch when the PR is closed
  - Posts comments on PRs with database connection details

### 2. Database Configuration Updates
- **Updated Files**:
  - `server/db.ts` - Now uses Neon's serverless HTTP driver
  - `drizzle.config.ts` - Updated to use modern Drizzle Kit configuration
  - `.env.example` - Added Neon-specific environment variables

## Setup Instructions

### Step 1: Get Your Neon Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project: `Alihasnat930/Livestocklens`
3. Click on "Connection Details"
4. Copy the connection string (it should look like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Update Your Local Environment

1. Open your `.env` file (create one if it doesn't exist)
2. Update the `DATABASE_URL` with your Neon connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Verify GitHub Secrets (Already Done)

The following secrets have been added to your GitHub repository:
- ✅ `NEON_API_KEY` - For API authentication
- ✅ `NEON_PROJECT_ID` - Your Neon project identifier

### Step 4: Run Migrations

```bash
npm run db:push
```

This will push your database schema to Neon.

### Step 5: Test the Setup

```bash
npm run dev
```

Your application should now connect to the Neon cloud database.

## How It Works

### Development Workflow

1. **Main Branch**: Uses the main Neon database
2. **Pull Requests**: Each PR gets its own isolated database branch
3. **Testing**: Changes can be tested without affecting the main database
4. **Cleanup**: Preview branches are automatically deleted when PRs close

### Database Branching Flow

```
Main Database (production)
    │
    ├── preview/pr-1 (PR #1)
    ├── preview/pr-2 (PR #2)
    └── preview/pr-3 (PR #3)
```

## Troubleshooting

### Connection Issues

If you get database connection errors:

1. **Check your connection string format**:
   - Must include `?sslmode=require` at the end
   - Verify the endpoint is correct

2. **Test connection manually**:
   ```bash
   npm run db:push
   ```

3. **Check Neon Console**:
   - Ensure the database is active (not suspended)
   - Verify connection limits aren't exceeded

### GitHub Actions Issues

If the workflow fails:

1. **Verify GitHub Secrets**:
   - Go to Settings → Secrets and variables → Actions
   - Confirm `NEON_API_KEY` and `NEON_PROJECT_ID` are set

2. **Check workflow logs**:
   - Go to Actions tab in your GitHub repo
   - Click on the failed workflow run
   - Review the error messages

### Migration Issues

If migrations fail:

1. **Ensure DATABASE_URL is set**:
   ```bash
   echo $DATABASE_URL
   ```

2. **Check schema syntax**:
   ```bash
   npm run check
   ```

3. **Generate migrations manually**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

## Benefits of Neon

✅ **Serverless**: Automatic scaling and zero management
✅ **Instant Branching**: Create database copies in seconds
✅ **Cost Effective**: Pay only for what you use
✅ **Fast**: Built on top of PostgreSQL with instant read replicas
✅ **Secure**: SSL/TLS encryption by default
✅ **Backup**: Automatic backups and point-in-time recovery

## Migration from Local PostgreSQL

Your application now uses Neon instead of a local PostgreSQL installation:

### Before (Local):
```typescript
// Used node-postgres with Pool
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

### After (Neon):
```typescript
// Uses Neon's serverless HTTP driver
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
```

## Next Steps

1. **Commit and push** the changes to your repository
2. **Create a test PR** to see the automatic branch creation in action
3. **Update your production environment** with the Neon connection string
4. **Monitor your database** in the Neon Console

## Support

- **Neon Documentation**: https://neon.tech/docs
- **Neon GitHub Integration Guide**: https://neon.tech/docs/guides/github-integration
- **Drizzle ORM Docs**: https://orm.drizzle.team/docs/overview

## Important Notes

⚠️ **Connection String Security**: Never commit your actual DATABASE_URL to Git
⚠️ **API Keys**: Keep your NEON_API_KEY secure in GitHub Secrets only
⚠️ **SSL Mode**: Always use `?sslmode=require` in production
⚠️ **Dependencies**: The `@neondatabase/serverless` package is already installed

## Quick Reference Commands

```bash
# Push schema to database
npm run db:push

# Generate migration files
npm run db:generate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Your LivestockLens application is now ready to use Neon's cloud database! 🚀
