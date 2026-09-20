const express = require('express');
const { Credit, Listing, Transaction, User } = require('../models');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { retireCredit } = require('../blockchain/contract');

const router = express.Router();

// GET /marketplace (returns all credits with status 'verified' or 'listed', joined with org info)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { is_active: true },
      include: [
        {
          model: Credit,
          where: { status: 'listed' },
          include: [{ model: User, attributes: ['name', 'wallet_address'] }]
        }
      ]
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /marketplace/list (Org lists a verified credit on marketplace)
router.post('/list', protect, restrictTo('org'), async (req, res) => {
  try {
    const { creditId, price } = req.body;
    const credit = await Credit.findOne({ where: { id: creditId, org_id: req.user.id, status: 'verified' }});
    
    if (!credit) return res.status(404).json({ message: 'Verified credit not found' });

    const listing = await Listing.create({
      credit_id: credit.id,
      price: price,
      seller_id: req.user.id
    });

    credit.status = 'listed';
    await credit.save();

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /marketplace/:listingId/buy (consumer buys a credit)
router.post('/:listingId/buy', protect, restrictTo('consumer'), async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.listingId, {
      include: [Credit]
    });

    if (!listing || !listing.is_active) {
      return res.status(404).json({ message: 'Active listing not found' });
    }

    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    // Record transaction
    const transaction = await Transaction.create({
      listing_id: listing.id,
      buyer_id: req.user.id,
      amount_paid: listing.price,
      tx_hash: txHash
    });

    // Update status
    listing.is_active = false;
    await listing.save();
    
    const credit = listing.Credit;
    credit.status = 'verified'; 
    credit.tx_hash = txHash;
    await credit.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /marketplace/transactions (User or Admin transaction history)
router.get('/transactions', protect, async (req, res) => {
  try {
    let whereClause = {};
    let listingWhereClause = {};

    if (req.user.role === 'consumer') {
      whereClause.buyer_id = req.user.id;
    } else if (req.user.role === 'org') {
      listingWhereClause.seller_id = req.user.id;
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [
        {
          model: Listing,
          where: Object.keys(listingWhereClause).length ? listingWhereClause : undefined,
          include: [
            { model: Credit },
            { model: User, attributes: ['name', 'wallet_address'] }
          ]
        },
        {
          model: User,
          attributes: ['name', 'wallet_address']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /marketplace/:creditId/retire (calls retireCredit() from my blockchain file)
router.post('/retire/:creditId', protect, restrictTo('consumer', 'org'), async (req, res) => {
  try {
    const credit = await Credit.findByPk(req.params.creditId);
    if (!credit) return res.status(404).json({ message: 'Credit not found' });
    
    if (credit.status === 'retired') return res.status(400).json({ message: 'Already retired' });

    // Call blockchain
    const { txHash } = await retireCredit(credit.token_id, credit.amount);

    credit.status = 'retired';
    credit.tx_hash = txHash;
    await credit.save();

    res.json({
      message: 'Credit retired successfully',
      certificateData: {
        buyer: req.user.name,
        amount: credit.amount,
        tx_hash: txHash,
        date: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
