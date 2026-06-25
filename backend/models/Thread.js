const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userID:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ThreadSchema = new mongoose.Schema({
  gameID:    { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  userID:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true },
  posts:     [PostSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thread', ThreadSchema);
