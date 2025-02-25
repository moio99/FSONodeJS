const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

bloglistRouter.get('/', async (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

bloglistRouter.post('/', (request, response) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({
      error: 'No body send'
    })
  }

  const newBlog = new Blog(body)
  newBlog.save()
    .then(result => {
      logger.info(`Added ${result.title} author ${result.author} to blog list`)

      const blogResponse = {
        name: body.name,
        number: body.number,
        id: result._id.toString()
      }
      response.status(201).json(blogResponse)
    })
    .catch(error => next(error))
})

module.exports = bloglistRouter