const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, '0.0.0.0', () => {
  logger.info(`O servidor está a escoitar no porto ${config.PORT}`)
})