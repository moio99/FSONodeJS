const testingRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

testingRouter.post('/reset', async (request, response, next) => {
  try {
      await User.deleteMany({})
      await Blog.deleteMany({})
      response.status(204).end()
  } catch(exception) {
    console.log('Error:', exception)
    next(exception)
  }
})

module.exports = testingRouter