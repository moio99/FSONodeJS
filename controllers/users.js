const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const validationError = validateUser(request.body)

  if (validationError) {
    return response.status(validationError.status).json({ error: validationError.error })
  }

  const { username, name, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try{
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
  catch(exception) {
    console.log('dddddddddd',exception)
    next(exception)
  }
})

const validateUser = (body) => {
  if (!body) {
    return { status: 400, error: 'No body send' }
  } else if (!body.username) {
    return { status: 400, error: 'No username send' }
  } else if (body.username.length < 3) {
    return { status: 400, error: 'The username must be at least 3 characters long' }
  } else if (!body.password) {
    return { status: 400, error: 'No password send' }
  } else if (body.password.length < 3) {
    return { status: 400, error: 'The password must be at least 3 characters long' }
  }
  return null
}

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

module.exports = usersRouter