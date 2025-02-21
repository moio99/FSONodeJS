const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const bloglistRouter = require('./controllers/bloglist')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', bloglistRouter)
app.use(middleware.unknownEndpoint)

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(middleware.errorHandler)

module.exports = app