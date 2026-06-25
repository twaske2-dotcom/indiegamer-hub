const express = require('express');
const Review  = require('../models/Review');
const Game    = require('../models/Game');
const { protect } = require('../middleware/auth');
const router  = express.Router();

// GET /api/reviews/:gameId
router.get('/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ gameID: req.params.gameId })
      .populate('userID', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews/:gameId — post a review + recalculate averageRating
router.post('/:gameId', protect, async (req, res) => {
  try {
    const { rating, content } = req.body;
    const existing = await Review.findOne({ gameID: req.params.gameId, userID: req.user.id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this game' });

    const review = await Review.create({
      gameID: req.params.gameId,
      userID: req.user.id,
      rating,
      content
    });

    // Aggregation to recalculate averageRating — stored on Game for performance
    const agg = await Review.aggregate([
      { $match: { gameID: review.gameID } },
      { $group: { _id: '$gameID', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (agg.length) {
      await Game.findByIdAndUpdate(req.params.gameId, {
        averageRating: Math.round(agg[0].avg * 10) / 10,
        totalReviews:  agg[0].count
      });
    }

    const populated = await review.populate('userID', 'username avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:reviewId
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userID.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not your review' });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
