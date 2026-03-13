const express = require('express')
const db = require('../db/database')

const router = express.Router()

router.get('/', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message })
        res.json(rows)
    })
})

router.post('/', (req, res) => {
    const { title, description, category, latitude, longitude, user_id } = req.body

    db.run(
        'INSERT INTO items (title, description, category, latitude, longitude, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, category, latitude, longitude, user_id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message })
            res.json({ id: this.lastID, title, description, category, latitude, longitude, user_id })
        }
    )
})

module.exports = router