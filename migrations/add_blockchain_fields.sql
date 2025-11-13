-- Add blockchain tracking fields to cattle table
ALTER TABLE cattle 
ADD COLUMN IF NOT EXISTS blockchain_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS blockchain_registered BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS owner_cnic TEXT;

-- Add blockchain tracking field to vaccinations table
ALTER TABLE vaccinations 
ADD COLUMN IF NOT EXISTS blockchain_tx_hash TEXT;

-- Create index for faster blockchain lookups
CREATE INDEX IF NOT EXISTS idx_cattle_blockchain_registered ON cattle(blockchain_registered);
CREATE INDEX IF NOT EXISTS idx_cattle_blockchain_tx_hash ON cattle(blockchain_tx_hash);
CREATE INDEX IF NOT EXISTS idx_vaccinations_blockchain_tx_hash ON vaccinations(blockchain_tx_hash);
