const express = require('express');
const { Credit } = require('../models');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { mintCredit } = require('../blockchain/contract');

const router = express.Router();

// POST /credits (org submits a new credit request)
router.post('/', protect, restrictTo('org'), async (req, res) => {
  try {
    const { amount, description, doc_url } = req.body;
    
    const credit = await Credit.create({
      org_id: req.user.id,
      amount,
      description,
      doc_url,
      status: 'pending'
    });

    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /credits/mine (returns logged-in org's own credits)
router.get('/mine', protect, restrictTo('org'), async (req, res) => {
  try {
    const credits = await Credit.findAll({ where: { org_id: req.user.id } });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /credits/pending (returns all pending credits for admin)
router.get('/pending', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { User } = require('../models');
    const credits = await Credit.findAll({
      where: { status: 'pending' },
      include: [{ model: User, attributes: ['name'] }]
    });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /credits/:id/approve (admin-only, calls mintCredit)
router.patch('/:id/approve', protect, restrictTo('admin'), async (req, res) => {
  try {
    const credit = await Credit.findByPk(req.params.id);
    if (!credit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    
    if (credit.status !== 'pending') {
      return res.status(400).json({ message: 'Credit is not in pending status' });
    }

    // Call blockchain
    const metadataURI = credit.doc_url || "https://example.com/metadata"; // Should be a real URI
    
    // In a real scenario, the admin mints it to the Org's wallet
    // Get the org's wallet address (or use a default dummy wallet for testing)
    const org = await credit.getUser();
    const orgWallet = org.wallet_address || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

    const { txHash, tokenId } = await mintCredit(orgWallet, credit.amount, metadataURI);

    // Update DB
    credit.status = 'verified';
    credit.tx_hash = txHash;
    credit.token_id = tokenId;
    await credit.save();

    res.json(credit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
