const express = require('express');
const router = express.Router();
const { Thread, Post } = require('../models/Forum');
const { protect } = require('../middleware/auth');

// GET /api/forums/game/:gameId - All threads for a game
router.get('/game/:gameId', async (req, res) => {
  try {
    const threads = await Thread.find({ game: req.params.gameId })
      .populate('author', 'username avatar')
      .sort({ pinned: -1, createdAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/forums/thread/:threadId - Single thread with all posts
router.get('/thread/:threadId', async (req, res) => {
  try {
    const thread = await Thread.findByIdAndUpdate(
      req.params.threadId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username avatar');

    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const posts = await Post.find({ thread: thread._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: 1 });

    res.json({ thread, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/forums/thread - Create thread
router.post('/thread', protect, async (req, res) => {
  try {
    const { game, title, body } = req.body;
    const thread = await Thread.create({ game, title, body, author: req.user._id });
    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/forums/post - Reply to thread
router.post('/post', protect, async (req, res) => {
  try {
    const { thread, body } = req.body;
    const post = await Post.create({ thread, body, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
