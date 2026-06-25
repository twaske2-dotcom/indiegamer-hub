const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const Game     = require('../models/Game');
const Review   = require('../models/Review');
const { protect, requireRole } = require('../middleware/auth');
const { fetchSteamGameData, fetchRawgGameData } = require('../services/steamApi');
const router   = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/games — browse all with filters
router.get('/', async (req, res) => {
  try {
    const { genre, minPrice, maxPrice, search, sort, featured } = req.query;
    const filter = { isPublished: true };

    if (genre)    filter.genre    = { $in: [genre] };
    if (featured) filter.isFeatured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'rating')   sortOption = { averageRating: -1 };
    if (sort === 'trending') sortOption = { totalReviews: -1 };

    const games = await Game.find(filter)
      .sort(sortOption)
      .populate('developerID', 'username avatar')
      .limit(50);
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/games/trending — most reviews in last 7 days
router.get('/trending', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trending = await Review.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$gameID', reviewCount: { $sum: 1 } } },
      { $sort:  { reviewCount: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
      { $unwind: '$game' }
    ]);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/games/upcoming — upcoming releases
router.get('/upcoming', async (req, res) => {
  try {
    const games = await Game.find({ releaseDate: { $gt: new Date() }, isPublished: true })
      .sort({ releaseDate: 1 })
      .limit(10)
      .populate('developerID', 'username');
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/games/:id
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('developerID', 'username avatar bio');
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/games — developer creates a game
router.post('/', protect, requireRole('developer', 'admin'), upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 6 }
]), async (req, res) => {
  try {
    const body = { ...req.body, developerID: req.user.id };

    if (req.files?.coverImage)
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    if (req.files?.screenshots)
      body.screenshots = req.files.screenshots.map(f => `/uploads/${f.filename}`);

    if (body.genre && typeof body.genre === 'string')
      body.genre = body.genre.split(',').map(g => g.trim());

    // Auto-fill from Steam if steamAppId provided
    if (body.steamAppId) {
      const steam = await fetchSteamGameData(body.steamAppId);
      body.price       = body.price || steam.price;
      body.releaseDate = body.releaseDate || steam.releaseDate;
      body.tags        = steam.tags;
      if (!body.screenshots?.length) body.screenshots = steam.screenshots;
      if (!body.coverImage)          body.coverImage   = steam.headerImage;
      body.storeLinks = { ...body.storeLinks, steam: steam.storeLink };
    }

    const game = await Game.create(body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/games/:id — update game
router.put('/:id', protect, requireRole('developer', 'admin'), async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    if (game.developerID.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not your game' });
    const updated = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/games/steam-fetch — preview Steam data before saving
router.post('/steam-fetch', protect, requireRole('developer', 'admin'), async (req, res) => {
  try {
    const { steamAppId } = req.body;
    if (!steamAppId) return res.status(400).json({ message: 'steamAppId required' });
    const data = await fetchSteamGameData(steamAppId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
