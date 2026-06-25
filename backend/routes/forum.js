const express = require('express');
const Thread  = require('../models/Thread');
const { protect } = require('../middleware/auth');
const router  = express.Router();

// GET /api/forum/:gameId/threads
router.get('/:gameId/threads', async (req, res) => {
  try {
    const threads = await Thread.find({ gameID: req.params.gameId })
      .populate('userID', 'username avatar')
      .select('-posts')
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/forum/thread/:threadId
router.get('/thread/:threadId', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId)
      .populate('userID', 'username avatar')
      .populate('posts.userID', 'username avatar');
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/forum/:gameId/threads — create thread
router.post('/:gameId/threads', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const thread = await Thread.create({
      gameID: req.params.gameId,
      userID: req.user.id,
      title,
      posts: [{ userID: req.user.id, content }]
    });
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/forum/thread/:threadId/reply
router.post('/thread/:threadId/reply', protect, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    thread.posts.push({ userID: req.user.id, content: req.body.content });
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
