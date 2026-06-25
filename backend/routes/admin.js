const express = require('express');
const Game    = require('../models/Game');
const User    = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');
const router  = express.Router();

// GET /api/admin/games — all games including unpublished
router.get('/games', protect, requireRole('admin'), async (req, res) => {
  try {
    const games = await Game.find().populate('developerID', 'username email').sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/games/:id/feature — toggle isFeatured
router.patch('/games/:id/feature', protect, requireRole('admin'), async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    game.isFeatured = !game.isFeatured;
    await game.save();
    res.json({ isFeatured: game.isFeatured, message: `Game ${game.isFeatured ? 'featured' : 'unfeatured'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/games/:id/publish — toggle isPublished
router.patch('/games/:id/publish', protect, requireRole('admin'), async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      [{ $set: { isPublished: { $not: '$isPublished' } } }],
      { new: true }
    );
    res.json({ isPublished: game.isPublished });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', protect, requireRole('admin'), async (req, res) => {
  try {
    const [totalGames, totalUsers, featuredGames] = await Promise.all([
      Game.countDocuments(),
      User.countDocuments(),
      Game.countDocuments({ isFeatured: true })
    ]);
    res.json({ totalGames, totalUsers, featuredGames });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
