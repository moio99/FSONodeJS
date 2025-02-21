/* const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
console.log(mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.info('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
 */

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, '0.0.0.0', () => {
  logger.info(`O servidor está a escoitar no porto ${config.PORT}`)
})