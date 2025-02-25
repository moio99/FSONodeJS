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
  const validationError = validateBlog(body)

  if (validationError) {
    return response.status(validationError.status).json({ error: validationError.error })
  }

  const newBlog = new Blog(body)
  try {
    newBlog.save()
      .then(result => {
        logger.info(`Added ${result.title} author ${result.author} to blog list`)

        const blogResponse = {
          title: body.title,
          author: body.author,
          url: body.url,
          likes: body.likes,
          id: result._id.toString()
        }
        response.status(201).json(blogResponse)
      })
  } catch(exception) {
    next(exception)
  }
})

bloglistRouter.put('/:id', async (request, response) => {
  const body = request.body
  const validationError = validateBlog(body)

  if (validationError) {
    return response.status(validationError.status).json({ error: validationError.error })
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  try {
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.status(202).json(updatedBlog)
      })
  } catch(exception) {
    next(exception)
  }
})

const validateBlog = (body) => {
  if (!body) {
    return { status: 400, error: 'No body send' }
  } else if (!body.title) {
    return { status: 400, error: 'No Title send' }
  } else if (!body.url) {
    return { status: 400, error: 'No URL send' }
  } else if (!body.likes) {
    body.likes = 0
  }
  return null
}

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