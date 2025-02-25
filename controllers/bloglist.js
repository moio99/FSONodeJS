const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

bloglistRouter.get('/', async (request, response) => {
  try {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  } catch(exception) {
    next(exception)
  }
})

bloglistRouter.post('/', (request, response) => {
  const body = request.body
  if (!body) {
    return response.status(400).json({
      error: 'No body send'
    })
  } else if (!body.title) {
    return response.status(400).json({
      error: 'No Title send'
    })
  } else if (!body.url) {
    return response.status(400).json({
      error: 'No URL send'
    })
  } else if (!body.likes) {
    body.likes = 0
  }

  const newBlog = new Blog(body)
  try {
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
  } catch(exception) {
    next(exception)
  }
})

bloglistRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

bloglistRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

module.exports = bloglistRouter