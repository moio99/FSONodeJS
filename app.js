const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const fhonebookRouter = require('./controllers/phonebook')
const infoRouter = require('./controllers/info')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

// app.use(morgan('tiny'))    // middleware
morgan.token('bodyEmTexto', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :bodyEmTexto', {
    skip: (req) => req.method !== 'POST',
  })
)
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', fhonebookRouter)
app.use('/info', infoRouter)
app.use(middleware.unknownEndpoint)

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(middleware.errorHandler)

module.exports = app