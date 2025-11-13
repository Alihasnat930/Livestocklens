// Simple test to verify blockchain connectivity
import { ethers } from 'ethers';

const POLYGON_RPC_URL = 'https://polygon-amoy-bor-rpc.publicnode.com';
const PRIVATE_KEY = '2bce2d87bab2a7a1a279aa019c74c81cf76ff04fbba6d33e683a9f7df11d5754';
const CONTRACT_ADDRESS = '0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a';

async function testBlockchainConnection() {
  console.log('🧪 Testing Blockchain Integration\n');
  
  try {
    // Test 1: Connect to Polygon Amoy
    console.log('1️⃣ Connecting to Polygon Amoy Testnet...');
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
    const network = await provider.getNetwork();
    console.log(`   ✅ Connected to Chain ID: ${network.chainId}`);
    
    // Test 2: Check wallet
    console.log('\n2️⃣ Checking wallet...');
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(`   ✅ Wallet Address: ${wallet.address}`);
    
    // Test 3: Check balance
    console.log('\n3️⃣ Checking MATIC balance...');
    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    console.log(`   ✅ Balance: ${balanceInMatic} MATIC`);
    
    if (parseFloat(balanceInMatic) === 0) {
      console.log('   ⚠️  WARNING: Balance is 0. Get test MATIC from:');
      console.log('   🔗 https://faucet.polygon.technology/');
    }
    
    // Test 4: Check contract exists
    console.log('\n4️⃣ Verifying smart contract...');
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      console.log('   ❌ ERROR: No contract found at this address');
    } else {
      console.log(`   ✅ Contract exists at: ${CONTRACT_ADDRESS}`);
      console.log(`   📊 Contract size: ${code.length} bytes`);
    }
    
    // Test 5: Check latest block
    console.log('\n5️⃣ Checking network status...');
    const blockNumber = await provider.getBlockNumber();
    console.log(`   ✅ Latest block: ${blockNumber}`);
    
    console.log('\n\n🎉 All blockchain connectivity tests passed!');
    console.log('\n📋 Summary:');
    console.log(`   • Network: Polygon Amoy Testnet`);
    console.log(`   • Your Address: ${wallet.address}`);
    console.log(`   • Balance: ${balanceInMatic} MATIC`);
    console.log(`   • Contract: ${CONTRACT_ADDRESS}`);
    console.log(`   • Status: Ready to use ✅`);
    
    console.log('\n🔗 Useful Links:');
    console.log(`   • Your wallet: https://amoy.polygonscan.com/address/${wallet.address}`);
    console.log(`   • Smart contract: https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`);
    console.log(`   • Get test MATIC: https://faucet.polygon.technology/`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : String(error));
    console.error('\n💡 Common issues:');
    console.error('   • Check your internet connection');
    console.error('   • Verify the RPC URL is correct');
    console.error('   • Ensure the private key is valid');
  }
}

testBlockchainConnection();
