const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---------------------------------------------------FIM')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    logger.error('Error type: CastError')
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    logger.error('Error type: ValidationError')
    logger.error(error.message)
    return response.status(400).json({ error: error.message })
  } else {
    logger.error('Error type: other')
    logger.error(error.message)
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}