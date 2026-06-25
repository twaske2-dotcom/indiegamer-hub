const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  gameID:    { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  userID:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

ReviewSchema.index({ gameID: 1, userID: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
