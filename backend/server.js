const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes   = require('./routes/auth');
const gameRoutes   = require('./routes/games');
const reviewRoutes = require('./routes/reviews');
const forumRoutes  = require('./routes/forum');
const adminRoutes  = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth',    authRoutes);
app.use('/api/games',   gameRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/forum',   forumRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/', (req, res) => res.json({ message: 'IndieGamer Hub API running' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('DB connection error:', err));
