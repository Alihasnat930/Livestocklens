# Copilot Instructions for fyp-blockchain

## Project Overview
This is a Hardhat-based Ethereum smart contract project for cattle registry and management. It includes Solidity contracts, deployment scripts, and interaction scripts for managing cattle data, ownership, heritage, and vaccination records.

## Key Components
- `contracts/`: Solidity smart contracts (CattleRegistry, Ownership, Heritage, Vaccination, etc.)
- `scripts/`: Node.js scripts for deploying and interacting with contracts
- `artifacts/`: Compiled contract ABIs and build info
- `test/`: JavaScript tests for contracts
- `hardhat.config.js`: Hardhat configuration
- `deployed-address.txt`: Stores deployed contract addresses

## Developer Workflows
- **Build/Compile Contracts:**
  - `npx hardhat compile`
- **Run Tests:**
  - `npx hardhat test`
  - For gas reporting: `REPORT_GAS=true npx hardhat test`
- **Local Blockchain Node:**
  - `npx hardhat node`
- **Deploy Contracts:**
  - `npx hardhat run scripts/deploy.js`
- **Interact with Contracts:**
  - Use scripts in `scripts/` (e.g., `interact.js`, `interactOwnership.js`)

## Patterns & Conventions
- Contract addresses are hardcoded in interaction scripts; update them after deployment.
- Use `hre.ethers.getContractAt` to attach to deployed contracts.
- Cattle data flows: Registry → Ownership → Heritage → Vaccination.
- Ownership and history are managed via the `Ownership` contract; see `interact.js` for usage.
- Heritage and vaccination records are set and retrieved via respective contracts.
- Scripts use async/await and log results to the console for traceability.

## Integration Points
- Relies on Hardhat and Ethers.js for blockchain interaction.
- External dependencies managed via `package.json` (install with `npm install`).
- No frontend; all interaction is via scripts and console output.

## Example: Adding a Cattle
See `scripts/interact.js` for a full workflow:
- Add or update cattle in registry
- Update ownership
- Set heritage info
- Add vaccination record

## Tips for AI Agents
- Always check/update contract addresses in scripts after redeployment.
- Follow the async/await pattern for contract calls.
- Use the artifacts in `artifacts/contracts/` for ABI references if needed.
- For new features, mirror the structure and style of existing scripts.

---
If any section is unclear or missing, please request clarification or provide feedback for improvement.
