const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const creditsRoutes = require('./routes/credits');
const marketplaceRoutes = require('./routes/marketplace');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Carbon Credit Exchange API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync({ alter: true }); // Automatically creates/updates tables in Postgres
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
