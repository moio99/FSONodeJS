const jwt = require('jsonwebtoken')
const bloglistRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

bloglistRouter.get('/', async (request, response) => {
  try {
    Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1 })
      .then(blogs => {
        response.json(blogs)
      })
  } catch(exception) {
    next(exception)
  }
})

bloglistRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(400).end('Unauthorized')
  }

  const body = request.body
  const validationError = validateBlog(body)
  if (validationError) {
    return response.status(validationError.status).json({ error: validationError.error })
  }

  const user = await User.findById(request.user)
  const newBlog = new Blog({
    title: body.title, author: body.author, url: body.url, likes: body.likes, user: user._id
  })

  try {
    const blogResponse = await newBlog.save()
    user.blogs = user.blogs.concat(blogResponse._id)
    await user.save()

    response.status(201).json(blogResponse)
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
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', { username: 1, name: 1, id: 1 })
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
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      response.status(400).end('No blog find')
    } else if (!request.user) {
      response.status(400).end('Unauthorized')
    } else if (request.user === blog.user.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      response.status(400).end('The user is not the same one who created the blog')
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = bloglistRouter