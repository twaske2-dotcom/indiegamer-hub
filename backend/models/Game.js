const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  genre:         [{ type: String }],
  releaseDate:   { type: Date },
  developerID:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  screenshots:   [{ type: String }],
  trailerUrl:    { type: String, default: '' },
  storeLinks: {
    steam:  { type: String, default: '' },
    epic:   { type: String, default: '' },
    itch:   { type: String, default: '' }
  },
  steamAppId:    { type: String, default: '' },
  price:         { type: Number, default: 0 },
  tags:          [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalReviews:  { type: Number, default: 0 },
  isFeatured:    { type: Boolean, default: false },
  isPublished:   { type: Boolean, default: false },
  coverImage:    { type: String, default: '' },
  createdAt:     { type: Date, default: Date.now }
});

GameSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Game', GameSchema);
