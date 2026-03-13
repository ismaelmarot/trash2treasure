const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const db = require('./db/database')

const app = express()
const PORT = 5000

// Middlewares
app.use(cors())
app.use(bodyParser.json())

// Route example
app.get('/', (req, res) => {
  res.send({ message: 'Trash2Treasure API running' })
})

// Import routes
const usersRoutes = require('./routes/users.routes')
const itemsRoutes = require('./routes/items.routes')

app.use('/api/users', usersRoutes)
app.use('/api/items', itemsRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})