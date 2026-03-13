const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db/database')

const router = express.Router()
const SECRET_KEY = 'YOUR_SECRET_KEY'

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 10)

    db.run(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, hash],
        function (err) {
            if (err) return res.status(400).json({ error: err.message })
            res.json({ id: this.lastID, name, email })
        }
    )
})

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(400).json({ error: err.message })
        if (!user) return res.status(404).json({ error: 'User not found' })

        const match = await bcrypt.compare(password, user.password_hash)
        if (!match) return res.status(401).json({ error: 'Invalid password' })

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    })
})

module.exports = router