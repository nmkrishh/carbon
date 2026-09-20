/**
 * EcoSankalp Comprehensive Knowledge Base for RAG (Retrieval-Augmented Generation)
 * Contains domain knowledge, calculation formulas, project architecture, blockchain specs, and FAQs.
 */

const KNOWLEDGE_BASE = [
  {
    id: "about-ecosankalp",
    category: "Platform Overview",
    keywords: ["what is ecosankalp", "platform", "purpose", "mission", "features", "overview"],
    content: `EcoSankalp is a decentralized carbon and waste credit exchange and verification ecosystem. 
It bridges climate actions—specifically waste segregation, scientific processing, biomethanation, and composting—with transparent financial rewards. 
Key components include:
1. Carbon & Waste Sahayak: Real-time interactive calculation and certified credit estimation engine.
2. Decentralized Carbon Marketplace: Direct trading of verified carbon credits with transparent pricing (in INR ₹).
3. Polygon Amoy Blockchain Verification: Every credit is uniquely tokenized as an ERC-1155 smart contract asset with on-chain minting, trading, and retirement proof.
4. Smart Custodial Eco-Wallet: Allows organizations and buyers to hold, track, and verify credits seamlessly without third-party wallet friction.`
  },
  {
    id: "carbon-sahayak-formulas",
    category: "Calculations & Formulas",
    keywords: ["sahayak", "calculate", "formula", "emission factor", "methane", "equation", "math", "parameters"],
    content: `Carbon & Waste Sahayak calculates carbon offset credits (tCO₂e) based on empirical IPCC waste management guidelines:
Basic Equation:
E_baseline (tCO₂e) = Waste (tonnes) × DOC × DOC_f × F × 16/12 × GWP_CH4
- DOC (Degradable Organic Carbon) fraction: ~0.15 for municipal organic waste.
- DOC_f (Dissimilated DOC fraction): ~0.50.
- F (Fraction of methane in landfill gas): ~0.50.
- 16/12: Molecular ratio conversion factor from carbon to methane.
- GWP_CH4 (Global Warming Potential of Methane): 28 (IPCC 6th Assessment report, 100-year horizon).

Processing Offsets:
- Composting: Diverts organic waste from anaerobic landfills, yielding ~0.45 tCO₂e avoided emissions per tonne of waste treated.
- Bio-methanation (Anaerobic Digestion): Captures methane for clean biogas energy, yielding ~0.65 to 0.85 tCO₂e avoided emissions per tonne of wet waste.
- Dry Recyclables (Plastic, Paper, Glass, Metals): Recycling 1 tonne of dry recyclables saves between 1.2 to 2.8 tCO₂e compared to virgin material extraction and incineration.`
  },
  {
    id: "sahayak-waste-parameters",
    category: "Carbon & Waste Sahayak",
    keywords: ["waste parameters", "inputs", "wet waste", "dry waste", "sanitization", "segregation", "tonnes", "kg"],
    content: `Parameters processed in Carbon & Waste Sahayak:
1. Daily Wet Waste (Organic / Kitchen / Agri waste) in kg/day or tonnes/day.
2. Daily Dry Waste (Plastics, Cardboard, Paper, Metal) in kg/day or tonnes/day.
3. Waste Segregation Efficiency (%): Represents adherence to source-segregation standards (0% to 100%).
4. Processing Mode: Composting (Aerobic), Bio-methanation (Clean Energy capture), or Mechanical Recycling.
5. Project Lifespan / Horizon: Typically 1 year to 5 years calculation window.
Estimated credits generated are given in metric tonnes of CO₂ equivalent (tCO₂e). 1 tCO₂e = 1 Carbon Credit.`
  },
  {
    id: "credit-lifecycle",
    category: "Credit Lifecycle & Verification",
    keywords: ["lifecycle", "how credits are minted", "verification", "admin approval", "workflow", "steps"],
    content: `The lifecycle of an EcoSankalp Carbon Credit follows four verifiable stages:
1. Generation & Submission: An authorized Organization (seller) calculates credits on Carbon Sahayak or submits a project proposal detailing project name, tonnage, description, and supporting documentation.
2. Status 'pending': The proposal enters the Admin Verification Queue.
3. Verification & Minting: The platform Admin audits the documentation against CPCB/CCTS compliance standards. Once approved, the smart contract mints an ERC-1155 token on the Polygon Amoy blockchain. Status transitions to 'verified'.
4. Listing & Marketplace: The organization sets a price (in INR ₹ per tCO₂e) and lists the credit on the EcoSankalp Marketplace. Status becomes 'listed'.
5. Purchase & Retirement: When a buyer purchases the credit, a transaction is recorded with a Polygon Amoy transaction hash, the credit status becomes 'retired', and an official tamper-proof Certificate of Carbon Offset is generated.`
  },
  {
    id: "blockchain-polygon-amoy",
    category: "Blockchain & Web3",
    keywords: ["blockchain", "polygon", "amoy", "smart contract", "erc-1155", "token", "tx_hash", "polygonscan"],
    content: `EcoSankalp utilizes the Polygon Amoy Testnet (Proof of Stake) for fast, low-gas, and eco-friendly blockchain verification:
- Contract Standard: ERC-1155 Multi-Token standard for fractionalized and batch carbon credit minting.
- Blockchain Explorer: PolygonScan Amoy (https://amoy.polygonscan.com/).
- On-Chain Record: Every credit minting, buyer transfer, and final retirement produces an irreversible 66-character transaction hash (0x...).
- Double-Counting Prevention: Once a credit is retired by an individual or enterprise, its status is immutable and it cannot be re-listed or sold again.`
  },
  {
    id: "smart-custodial-wallet",
    category: "Smart Custodial Wallet",
    keywords: ["wallet", "custodial", "private key", "metamask", "balance", "transaction history"],
    content: `EcoSankalp employs a Web2.5 Smart Custodial Eco-Wallet architecture:
- Ease of Use: Users do not need complex browser extensions like MetaMask or to manage private seed phrases.
- Generated Address: Each user (consumer, organization, admin) is assigned a unique cryptographic Ethereum-compatible wallet address on signup/login.
- Real-Time Balance: The wallet dashboard shows active carbon offset balance (tCO₂e) for consumers and total credits sold for organizations.
- Transaction History: Shows all on-chain purchases, dates, INR values, counterparties, and instant links to PolygonScan.`
  },
  {
    id: "marketplace-buying-selling",
    category: "Marketplace Operations",
    keywords: ["marketplace", "buy", "sell", "price", "rupees", "inr", "listings", "bids", "filters"],
    content: `Operating on the EcoSankalp Marketplace:
- Filtering: Buyers can filter verified projects by Category (Waste Segregation, Renewable Energy, Forest Conservation), Country, Vintage year (2023–2026), Registry, and UN Sustainable Development Goals (SDG 12, SDG 13, SDG 6, SDG 11).
- Instant Purchase: Buyers click 'View Details & Buy' on any active listing to purchase certified credits.
- Instant Certificate: Upon purchase, the credit is retired on-chain, and an official Certificate of Carbon Offset is generated with the buyer's name, tonnage, date, and Polygon blockchain hash.`
  },
  {
    id: "user-roles-permissions",
    category: "User Roles & Permissions",
    keywords: ["roles", "consumer", "org", "organization", "admin", "permissions"],
    content: `EcoSankalp has 3 user roles:
1. Consumer (Buyer): Can browse Marketplace, purchase carbon credits, view their custodial smart wallet balance, view transaction history, and download retirement certificates.
2. Organization (Seller): Can use Carbon Sahayak, submit carbon offset projects, track verified credits, set listing prices, and manage portfolio sales.
3. Admin: Audits incoming credit submissions, approves verified projects, and triggers smart contract token minting on Polygon Amoy.`
  }
];

module.exports = { KNOWLEDGE_BASE };
