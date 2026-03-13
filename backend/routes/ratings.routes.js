const express = require('express');
const db = require('../db/database');

const router = express.Router();

// Obtener valoraciones de un item
router.get('/item/:item_id', (req, res) => {
  const { item_id } = req.params;
  db.get(
    'SELECT AVG(score) as average, COUNT(score) as count FROM ratings WHERE item_id = ?',
    [item_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// Valorar un item
router.post('/', (req, res) => {
  const { item_id, user_id, score } = req.body;
  if (!item_id || !user_id || !score) return res.status(400).json({ error: 'Missing fields' });

  db.run(
    'INSERT INTO ratings (item_id, user_id, score) VALUES (?, ?, ?)',
    [item_id, user_id, score],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, item_id, user_id, score });
    }
  );
});

module.exports = router;
