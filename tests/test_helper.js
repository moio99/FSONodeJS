const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { title: 'Título01', author: 'author A', url: 'umha direiçom 01', likes: 2 },
  { title: 'Título02', author: 'author B', url: 'umha direiçom 02', likes: 5 },
]

const userRoot = { username: 'root', name:'Iago Outeiro', password: 'segredo' }

const nonExistingId = async () => {
  const blog = new Blog({ title: 'TítuloXX', author: 'author X', url: 'umha direiçom XX' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getToken = async (api) => {
  const login = await api
    .post('/api/login')
    .send(userRoot)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return login.body.token
}

module.exports = {
  initialBlogs, userRoot, nonExistingId, blogsInDb, usersInDb, getToken
}