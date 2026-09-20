const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, wallet_address } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const assignedWallet = wallet_address || ("0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''));

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      wallet_address: assignedWallet
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      wallet_address: user.wallet_address,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // Ensure wallet address exists
      if (!user.wallet_address) {
        user.wallet_address = "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        await user.save();
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallet_address: user.wallet_address,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
