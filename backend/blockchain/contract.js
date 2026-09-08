const { ethers } = require('ethers');
require('dotenv').config();

const contractABI = [
  "function mintCredit(address org, uint256 amount, string memory metadataURI) external returns (uint256)",
  "function retireCredit(uint256 tokenId, uint256 amount) external",
  "function uri(uint256 tokenId) public view returns (string memory)",
  "event CreditMinted(uint256 indexed tokenId, address indexed org, uint256 amount)",
  "event CreditRetired(uint256 indexed tokenId, address indexed by, uint256 amount)"
];

const isConfigured = () => {
  const pk = process.env.PRIVATE_KEY;
  const addr = process.env.CONTRACT_ADDRESS;
  return pk && pk !== 'your_private_key' && addr && addr !== 'deployed_contract_address';
};

const getContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://rpc-amoy.polygon.technology");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);
};

const mintCredit = async (orgWalletAddress, amount, metadataURI) => {
  if (!isConfigured()) {
    console.log("⚠️ [MOCK MODE] Real blockchain key/address not provided. Simulating on-chain minting...");
    const mockTokenId = Math.floor(Math.random() * 1000) + 1;
    const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      txHash: mockTxHash,
      tokenId: mockTokenId
    };
  }

  try {
    const contract = getContract();
    const tx = await contract.mintCredit(orgWalletAddress, amount, metadataURI);
    const receipt = await tx.wait();
    
    let tokenId = null;
    for (const log of receipt.logs) {
        try {
            const parsed = contract.interface.parseLog(log);
            if (parsed.name === 'CreditMinted') {
                tokenId = parsed.args.tokenId.toString();
            }
        } catch (e) {}
    }
    
    return {
      txHash: receipt.hash,
      tokenId: tokenId || 1
    };
  } catch (error) {
    console.error("Error minting credit on blockchain:", error);
    throw error;
  }
};

const retireCredit = async (tokenId, amount) => {
  if (!isConfigured()) {
    console.log("⚠️ [MOCK MODE] Real blockchain key/address not provided. Simulating on-chain retiring...");
    const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      txHash: mockTxHash
    };
  }

  try {
    const contract = getContract();
    const tx = await contract.retireCredit(tokenId, amount);
    const receipt = await tx.wait();
    return {
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error retiring credit on blockchain:", error);
    throw error;
  }
};

module.exports = {
  mintCredit,
  retireCredit
};
