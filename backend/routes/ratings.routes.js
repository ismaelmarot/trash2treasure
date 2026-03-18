const express = require('express');
const { Rating, Item } = require('../db/models');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

// Obtener ratings de un item
router.get('/item/:itemId', async (req, res) => {
  try {
    const ratings = await Rating.find({ item_id: req.params.itemId })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });
    
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear rating
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { item_id, score } = req.body;
    
    if (!item_id || !score) {
      return res.status(400).json({ error: 'Item ID and score are required' });
    }

    const item = await Item.findById(item_id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Verificar que el usuario no es el dueño del item
    if (item.user_id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot rate your own item' });
    }

    // Verificar si ya calificó este item
    const existingRating = await Rating.findOne({ 
      item_id, 
      user_id: req.user.id 
    });

    if (existingRating) {
      return res.status(400).json({ error: 'Already rated this item' });
    }

    const rating = new Rating({
      item_id,
      user_id: req.user.id,
      score
    });

    await rating.save();
    res.json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener promedio de ratings de un item
router.get('/item/:itemId/average', async (req, res) => {
  try {
    const result = await Rating.aggregate([
      { $match: { item_id: req.params.itemId } },
      { $group: { _id: null, average: { $avg: '$score' }, count: { $sum: 1 } } }
    ]);

    if (result.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    res.json({ average: result[0].average, count: result[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
