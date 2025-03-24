const jwt = require('jsonwebtoken')
const commentlistRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentlistRouter.get('/', async (request, response, next) => {
  try {
    Comment
      .find({})
      .populate('blog', { title: 1, url: 1, likes: 1, id: 1 })    // O que vai sacar da outra taboa
      .then(comments => {
        response.json(comments)
      })
  } catch(exception) {
    next(exception)
  }
})

commentlistRouter.post('/', async (request, response, next) => {
  const body = request.body
  const validationError = validateComment(body)
  if (validationError) {
    return response.status(validationError.status).json({ error: validationError.error })
  }

  const blog = await Blog.findById(body.blog)
  const newComment = new Comment({
    title: body.title, blog: blog
  })

  try {
    const commentResponse = await newComment.save()
    blog.comments = blog.comments.concat(commentResponse._id)
    await blog.save()

    response.status(201).json(commentResponse)
  } catch(exception) {
    next(exception)
  }
})

commentlistRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const validationError = validateComment(body)

  if (validationError) {
    return response.status(validationError.status).json({ error: validationError.error })
  }

  const comment = {
    title: body.title,
    blog: body.blogid
  }

  try {
    await Comment.findByIdAndUpdate(request.params.id, comment, { new: true })
      .then(updatedComment => {
        response.status(202).json(updatedComment)
      })
  } catch(exception) {
    next(exception)
  }
})

const validateComment = (body) => {
  if (!body) {
    return { status: 400, error: 'No body send' }
  } else if (!body.title) {
    return { status: 400, error: 'No Title send' }
  } else if (!body.blog) {
    return { status: 400, error: 'No blog send' }
  }
  return null
}

commentlistRouter.get('/:id', async (request, response, next) => {
  try {
    const comment = await Comment
      .findById(request.params.id)
      .populate('blog', { title: 1, url: 1, likes: 1, id: 1 })
    if (comment) {
      response.json(comment)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

commentlistRouter.delete('/:id', async (request, response, next) => {
  try {
    const comment = await Comment.findById(request.params.id)
    if (!comment) {
      response.status(400).end('No comment find')
    } else {
      await Comment.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
  } catch(exception) {
    next(exception)
  }
})

module.exports = commentlistRouter