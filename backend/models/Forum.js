const mongoose = require('mongoose');

// Thread belongs to a Game
const ThreadSchema = new mongoose.Schema(
  {
    game:    { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:   { type: String, required: true, trim: true },
    body:    { type: String, required: true },
    pinned:  { type: Boolean, default: false },
    views:   { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Post belongs to a Thread
const PostSchema = new mongoose.Schema(
  {
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body:   { type: String, required: true },
    likes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Increment postCount on thread when a post is added
PostSchema.post('save', async function () {
  await mongoose.model('Thread').findByIdAndUpdate(this.thread, { $inc: { postCount: 1 } });
});

const Thread = mongoose.model('Thread', ThreadSchema);
const Post   = mongoose.model('Post', PostSchema);

module.exports = { Thread, Post };
